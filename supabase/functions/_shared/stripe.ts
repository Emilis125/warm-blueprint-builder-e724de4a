import Stripe from 'npm:stripe@17';

const stripeKey = Deno.env.get('API_KEY_STRIPE')!;

export function getStripe(): Stripe {
  return new Stripe(stripeKey);
}

export async function verifyStripeWebhook(req: Request): Promise<Stripe.Event> {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

  if (!signature || !body) {
    throw new Error('Missing signature or body');
  }

  const stripe = getStripe();
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
