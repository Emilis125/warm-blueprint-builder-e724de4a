import Stripe from "npm:stripe@17";

export type StripeEnv = "sandbox" | "live";

const GATEWAY_BASE = "https://connector-gateway.lovable.dev/stripe";

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionKey =
    env === "live"
      ? Deno.env.get("STRIPE_LIVE_API_KEY")
      : Deno.env.get("STRIPE_SANDBOX_API_KEY");

  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

  if (!connectionKey || !lovableApiKey) {
    throw new Error(`Missing API keys for environment: ${env}`);
  }

  // Use a custom fetch-based HTTP client that routes through the Lovable gateway
  const gatewayHttpClient: Stripe.HttpClient = {
    makeRequest: async (
      host: string,
      port: string,
      path: string,
      method: string,
      headers: Record<string, string>,
      requestData: string | null,
      protocol: string,
      timeout: number
    ): Promise<Stripe.HttpClientResponse> => {
      const url = `${GATEWAY_BASE}${path}`;
      const res = await fetch(url, {
        method,
        headers: {
          ...headers,
          "Authorization": `Bearer ${lovableApiKey}`,
          "X-Connection-Api-Key": connectionKey,
        },
        body: requestData || undefined,
      });

      return {
        getStatusCode: () => res.status,
        getHeaders: () => {
          const h: Record<string, string> = {};
          res.headers.forEach((v, k) => { h[k] = v; });
          return h;
        },
        getRawResponse: () => res as any,
        toStream: (cb: (chunk: Uint8Array) => void) => {
          return res.body;
        },
        toJSON: async () => {
          const text = await res.text();
          return JSON.parse(text);
        },
      };
    },
  };

  return new Stripe("not-used", {
    httpClient: gatewayHttpClient,
    apiVersion: "2025-04-30.basil",
  });
}

export async function verifyWebhook(
  req: Request,
  env: StripeEnv
): Promise<{ event: Stripe.Event; body: string }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  const secret =
    env === "live"
      ? Deno.env.get("PAYMENTS_LIVE_WEBHOOK_SECRET")
      : Deno.env.get("PAYMENTS_SANDBOX_WEBHOOK_SECRET");

  if (!signature || !body || !secret) {
    throw new Error("Missing signature, body, or webhook secret");
  }

  const stripe = createStripeClient(env);
  const event = stripe.webhooks.constructEvent(body, signature, secret);
  return { event, body };
}
