// In-memory subscription state (UI-only, no real payments)
type Plan = 'free' | 'pro' | 'premium';

let currentPlan: Plan = 'free';
const listeners = new Set<() => void>();

export const subscriptionStore = {
  getPlan: () => currentPlan,
  setPlan: (plan: Plan) => {
    currentPlan = plan;
    listeners.forEach(fn => fn());
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  isPro: () => currentPlan === 'pro' || currentPlan === 'premium',
  isPremium: () => currentPlan === 'premium',
};
