
-- Rename legacy Paddle columns to Stripe equivalents
ALTER TABLE public.subscriptions RENAME COLUMN paddle_subscription_id TO stripe_subscription_id;
ALTER TABLE public.subscriptions RENAME COLUMN paddle_customer_id TO stripe_customer_id;

-- Update the has_active_subscription function (no column changes needed, it doesn't use those columns)
-- Update the unique constraint if one exists
DO $$
BEGIN
  -- Drop old unique constraint on (user_id, environment) if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_environment_key'
  ) THEN
    NULL; -- keep it, it's fine
  END IF;
END $$;
