import { useSyncExternalStore } from 'react';
import { subscriptionStore } from '@/lib/subscription-store';

export function useSubscription() {
  const plan = useSyncExternalStore(
    subscriptionStore.subscribe,
    subscriptionStore.getPlan,
    subscriptionStore.getPlan,
  );

  return {
    plan,
    isPro: plan === 'pro' || plan === 'premium',
    isPremium: plan === 'premium',
    setPlan: subscriptionStore.setPlan,
  };
}
