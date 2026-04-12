import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyStripeWebhook } from '../_shared/stripe.ts';
import Stripe from 'npm:stripe@17';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const event = await verifyStripeWebhook(req);
    console.log('Stripe event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        console.log('Payment failed:', (event.data.object as any).id);
        break;
      default:
        console.log('Unhandled event:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});

async function handleSubscriptionUpsert(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const item = sub.items.data[0];
  const productId = sub.metadata?.productId || '';
  const priceId = sub.metadata?.priceId || '';

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    paddle_subscription_id: sub.id, // reusing column for Stripe sub ID
    paddle_customer_id: sub.customer as string, // reusing column for Stripe customer ID
    product_id: productId,
    price_id: priceId,
    status: sub.status,
    current_period_start: new Date(sub.items.data[0].created * 1000).toISOString(),
    current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    environment: 'live',
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id,environment',
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await supabase.from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', sub.id);
}
