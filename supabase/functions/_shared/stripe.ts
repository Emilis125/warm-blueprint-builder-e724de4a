export type StripeEnv = "sandbox" | "live";

const GATEWAY_BASE = "https://connector-gateway.lovable.dev/stripe";

function getKeys(env: StripeEnv) {
  const connectionKey =
    env === "live"
      ? Deno.env.get("STRIPE_LIVE_API_KEY")
      : Deno.env.get("STRIPE_SANDBOX_API_KEY");
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!connectionKey || !lovableApiKey) {
    throw new Error(`Missing API keys for environment: ${env}`);
  }
  return { connectionKey, lovableApiKey };
}

async function stripeRequest(
  env: StripeEnv,
  method: string,
  path: string,
  body?: Record<string, any> | string
): Promise<any> {
  const { connectionKey, lovableApiKey } = getKeys(env);
  const url = `${GATEWAY_BASE}${path}`;

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${lovableApiKey}`,
    "X-Connection-Api-Key": connectionKey,
  };

  let bodyStr: string | undefined;
  if (body) {
    if (typeof body === "string") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      bodyStr = body;
    } else {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      bodyStr = encodeParams(body);
    }
  }

  const res = await fetch(url, { method, headers, body: bodyStr });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Stripe API error: ${res.status}`);
  }
  return data;
}

function encodeParams(obj: Record<string, any>, prefix = ""): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (val === undefined || val === null) continue;
    if (typeof val === "object" && !Array.isArray(val)) {
      parts.push(encodeParams(val, fullKey));
    } else if (Array.isArray(val)) {
      val.forEach((v, i) => {
        if (typeof v === "object") {
          parts.push(encodeParams(v, `${fullKey}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(v)}`);
        }
      });
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(val)}`);
    }
  }
  return parts.filter(Boolean).join("&");
}

/** Lightweight Stripe gateway client — no SDK needed */
export function createStripeClient(env: StripeEnv) {
  return {
    prices: {
      list: (params: Record<string, any>) =>
        stripeRequest(env, "GET", `/v1/prices?${encodeParams(params)}`),
    },
    checkout: {
      sessions: {
        create: (params: Record<string, any>) =>
          stripeRequest(env, "POST", "/v1/checkout/sessions", params),
      },
    },
    billingPortal: {
      sessions: {
        create: (params: Record<string, any>) =>
          stripeRequest(env, "POST", "/v1/billing_portal/sessions", params),
      },
    },
    subscriptions: {
      retrieve: (id: string) =>
        stripeRequest(env, "GET", `/v1/subscriptions/${id}`),
      update: (id: string, params: Record<string, any>) =>
        stripeRequest(env, "POST", `/v1/subscriptions/${id}`, params),
    },
    customers: {
      list: (params: Record<string, any>) =>
        stripeRequest(env, "GET", `/v1/customers?${encodeParams(params)}`),
      create: (params: Record<string, any>) =>
        stripeRequest(env, "POST", "/v1/customers", params),
    },
    webhooks: {
      constructEvent: (body: string, sig: string, secret: string) => {
        // For webhook verification we still need the Stripe SDK
        throw new Error("Use verifyWebhook() instead");
      },
    },
  };
}

export async function verifyWebhook(
  req: Request,
  env: StripeEnv
): Promise<{ event: any; body: string }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret =
    env === "live"
      ? Deno.env.get("PAYMENTS_LIVE_WEBHOOK_SECRET")
      : Deno.env.get("PAYMENTS_SANDBOX_WEBHOOK_SECRET");

  if (!signature || !body || !secret) {
    throw new Error("Missing signature, body, or webhook secret");
  }

  const Stripe = (await import("npm:stripe@17")).default;
  const stripe = new Stripe("not-used");
  const event = stripe.webhooks.constructEvent(body, signature, secret);
  return { event, body };
}
