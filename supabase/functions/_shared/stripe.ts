import Stripe from "npm:stripe@17";

export type StripeEnv = "sandbox" | "live";

const GATEWAY_BASE = "https://stripe-gateway.lovable.dev";

export function createStripeClient(env: StripeEnv): Stripe {
  const key =
    env === "live"
      ? Deno.env.get("STRIPE_LIVE_API_KEY")
      : Deno.env.get("STRIPE_SANDBOX_API_KEY");

  if (!key) {
    throw new Error(`Missing Stripe API key for environment: ${env}`);
  }

  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
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
