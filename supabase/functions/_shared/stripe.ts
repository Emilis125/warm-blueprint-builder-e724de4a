import Stripe from "npm:stripe@17";

export type StripeEnv = "sandbox" | "live";

const GATEWAY_BASE = "https://stripe-gateway.lovable.dev";

/**
 * Creates a Stripe client that routes all API calls through the Lovable
 * connector gateway. The keys stored in secrets are gateway connection
 * identifiers (lovc_*), NOT real Stripe secret keys, so requests must go
 * through the gateway which attaches the real credentials.
 */
export function createStripeClient(env: StripeEnv): Stripe {
  const key =
    env === "live"
      ? Deno.env.get("STRIPE_LIVE_API_KEY")
      : Deno.env.get("STRIPE_SANDBOX_API_KEY");

  if (!key) {
    throw new Error(`Missing Stripe API key for environment: ${env}`);
  }

  // Create a fetch-based HTTP client that rewrites the host to the gateway
  const gatewayFetch: typeof fetch = (input, init) => {
    let url: string;
    if (typeof input === "string") {
      url = input.replace("https://api.stripe.com", GATEWAY_BASE);
    } else if (input instanceof URL) {
      url = input.toString().replace("https://api.stripe.com", GATEWAY_BASE);
    } else {
      url = (input as Request).url.replace("https://api.stripe.com", GATEWAY_BASE);
      input = new Request(url, input as Request);
      return fetch(input, init);
    }
    return fetch(url, init);
  };

  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(gatewayFetch),
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
