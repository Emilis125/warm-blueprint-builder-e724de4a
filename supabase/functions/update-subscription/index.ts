import { createClient } from 'npm:@supabase/supabase-js@2';
import { getPaddleClient, gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';

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

    const { priceId, environment } = await req.json();
    const env = (environment || 'sandbox') as PaddleEnv;

    // Look up current subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('paddle_subscription_id')
      .eq('user_id', user.id)
      .eq('environment', env)
      .maybeSingle();

    if (!sub) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404, headers: corsHeaders });
    }

    // Resolve the human-readable price ID to Paddle internal ID
    const priceRes = await gatewayFetch(env, `/prices?external_id=${encodeURIComponent(priceId)}`);
    const priceData = await priceRes.json();
    if (!priceData.data?.length) {
      return new Response(JSON.stringify({ error: 'Price not found' }), { status: 404, headers: corsHeaders });
    }
    const paddlePriceId = priceData.data[0].id;

    // Update the subscription items
    const paddle = getPaddleClient(env);
    const updated = await paddle.subscriptions.update(sub.paddle_subscription_id, {
      items: [{ priceId: paddlePriceId, quantity: 1 }],
      prorationBillingMode: 'prorated_immediately',
    });

    return new Response(JSON.stringify({ success: true, status: updated.status }), { headers: corsHeaders });
  } catch (e: any) {
    console.error('Update subscription error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Failed to update subscription' }), { status: 500, headers: corsHeaders });
  }
});
