import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripe } from '../_shared/stripe.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Content-Type': 'application/json',
};

const PRICE_MAP: Record<string, { amount: number; name: string; interval: 'month' | 'year'; product: string }> = {
  pro_monthly: { amount: 499, name: 'Pro Monthly', interval: 'month', product: 'pro_plan' },
  pro_annual: { amount: 3900, name: 'Pro Annual', interval: 'year', product: 'pro_plan' },
  premium_monthly: { amount: 999, name: 'Premium Monthly', interval: 'month', product: 'premium_plan' },
  premium_annual: { amount: 7900, name: 'Premium Annual', interval: 'year', product: 'premium_plan' },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { priceId, successUrl, cancelUrl } = await req.json();
    const priceConfig = PRICE_MAP[priceId];
    if (!priceConfig) {
      return new Response(JSON.stringify({ error: 'Invalid price ID' }), { status: 400, headers: corsHeaders });
    }

    const stripe = getStripe();

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: priceConfig.amount,
          recurring: { interval: priceConfig.interval },
          product_data: { name: priceConfig.name },
        },
        quantity: 1,
      }],
      subscription_data: {
        trial_period_days: priceConfig.product === 'pro_plan' ? 7 : undefined,
        metadata: { userId: user.id, productId: priceConfig.product, priceId },
      },
      success_url: successUrl || 'https://warm-blueprint-builder.lovable.app/pricing?checkout=success',
      cancel_url: cancelUrl || 'https://warm-blueprint-builder.lovable.app/pricing',
      metadata: { userId: user.id },
    });

    return new Response(JSON.stringify({ url: session.url }), { headers: corsHeaders });
  } catch (e: any) {
    console.error('Checkout error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
