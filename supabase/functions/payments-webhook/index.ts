import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";
import Stripe from "npm:stripe@17";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Determine environment from query parameter
    const url = new URL(req.url);
    const env = (url.searchParams.get("env") || "sandbox") as StripeEnv;

    const { event } = await verifyWebhook(req, env);
    console.log("Stripe event:", event.type, "env:", env);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        console.log("Payment failed:", (event.data.object as any).id);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleSubscriptionUpsert(sub: Stripe.Subscription, env: StripeEnv) {
  const userId = sub.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  const item = sub.items.data[0];
  const stripePriceId = item?.price?.id || "";
  const lookupKey = item?.price?.lookup_key || "";

  // Determine product from lookup_key (e.g. pro_monthly -> pro_plan)
  let productId = "";
  if (lookupKey.startsWith("pro_")) productId = "pro_plan";
  else if (lookupKey.startsWith("premium_")) productId = "premium_plan";

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer as string,
      product_id: productId,
      price_id: lookupKey || stripePriceId,
      status: sub.status,
      current_period_start: item?.created
        ? new Date(item.created * 1000).toISOString()
        : new Date().toISOString(),
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,environment" }
  );
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}
