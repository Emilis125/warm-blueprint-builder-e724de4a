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

    // Look up subscription to get Stripe customer ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('paddle_customer_id')
      .eq('user_id', user.id)
      .eq('environment', 'live')
      .maybeSingle();

    if (!sub?.paddle_customer_id) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404, headers: corsHeaders });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.paddle_customer_id,
      return_url: 'https://warm-blueprint-builder.lovable.app/pricing',
    });

    return new Response(JSON.stringify({ url: session.url }), { headers: corsHeaders });
  } catch (e: any) {
    console.error('Portal error:', e);
    return new Response(JSON.stringify({ error: 'Failed to create portal session' }), { status: 500, headers: corsHeaders });
  }
});
