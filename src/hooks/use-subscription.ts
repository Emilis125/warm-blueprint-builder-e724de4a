import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { getPaddleEnvironment } from '@/lib/paddle';

interface Subscription {
  product_id: string;
  price_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const env = getPaddleEnvironment();

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('product_id, price_id, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .eq('environment', env)
        .maybeSingle();

      setSubscription(data);
      setLoading(false);
    };

    fetchSubscription();

    // Realtime updates
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchSubscription()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const productId = subscription?.product_id || '';

  const plan: 'free' | 'pro' | 'premium' = !isActive
    ? 'free'
    : productId === 'premium_plan'
      ? 'premium'
      : productId === 'pro_plan'
        ? 'pro'
        : 'free';

  return {
    plan,
    isPro: plan === 'pro' || plan === 'premium',
    isPremium: plan === 'premium',
    loading,
    subscription,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
  };
}
