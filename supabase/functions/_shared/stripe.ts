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

  // Route through gateway by overriding the Stripe host
  const client = new Stripe(key, {
    apiVersion: "2025-04-30.basil",
  });

  // Override the base path to route through the Lovable gateway
  // @ts-ignore — internal Stripe SDK override
  client._api = { ...(client as any)._api, host: "stripe-gateway.lovable.dev", protocol: "https" };

  return client;
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
