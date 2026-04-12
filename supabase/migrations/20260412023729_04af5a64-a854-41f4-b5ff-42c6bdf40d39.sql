
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  reminder_time TEXT NOT NULL DEFAULT '21:00',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  push_subscription JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_notification_preferences_user_id ON public.notification_preferences (user_id);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification preferences"
ON public.notification_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
ON public.notification_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
ON public.notification_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences"
ON public.notification_preferences FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
