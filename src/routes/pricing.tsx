import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { TabBar } from '@/components/TabBar';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Check, X, Crown, Zap, Star, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { toast } from 'sonner';
import { z } from 'zod';

const pricingSearchSchema = z.object({
  plan: z.enum(['free', 'pro', 'premium']).optional(),
  checkout: z.string().optional(),
});

export const Route = createFileRoute('/pricing')({
  validateSearch: pricingSearchSchema,
  component: () => <RequireAuth><PricingPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Pricing' },
      { name: 'description', content: 'Choose the right plan for your tip tracking needs.' },
    ],
  }),
});

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: { monthly: '/forever', annual: '/forever' },
    icon: Star,
    color: 'rgba(255,255,255,0.60)',
    features: ['Daily logging', 'Basic weekly chart', 'Cash & card split', '30-day history'],
    missing: ['Unlimited history', 'Tax export (PDF & CSV)', 'Advanced reports & insights', 'Goal tracking', 'Multi-job tracking', 'Ad-free experience', 'Cloud backup', 'AI insights', 'Priority support'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: { monthly: '$4.99', annual: '$39' },
    period: { monthly: '/month', annual: '/year' },
    icon: Zap,
    color: '#0A84FF',
    popular: true,
    trialBadge: '7 DAYS FREE',
    features: ['Unlimited tip logging', 'Unlimited history', 'Full weekly & monthly charts', 'Tax export (PDF & CSV)', 'Smart insights & trends', 'Goal tracking', 'Multi-job tracking'],
    missing: ['Ad-free experience', 'Cloud backup', 'AI insights', 'Priority support'],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: { monthly: '$9.99', annual: '$79' },
    period: { monthly: '/month', annual: '/year' },
    icon: Crown,
    color: '#FFD60A',
    features: ['Everything in Pro', 'Ad-free experience', 'Cloud backup', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Data export & backup'],
    missing: [],
  },
];

const priceIdMap = {
  pro: { monthly: 'pro_monthly', annual: 'pro_annual' },
  premium: { monthly: 'premium_monthly', annual: 'premium_annual' },
} as const;

function PricingPage() {
  const { user } = useAuth();
  const { plan: currentPlan, subscription } = useSubscription();
  const { plan: searchPlan, checkout } = Route.useSearch();
  const [selected, setSelected] = useState<'free' | 'pro' | 'premium'>(searchPlan || 'pro');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const { openCheckout, closeCheckout, isOpen: checkoutOpen, CheckoutForm } = useStripeCheckout();
  const [actionLoading, setActionLoading] = useState(false);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

  const handleSubscribe = async () => {
    if (selected === currentPlan) return;
    if (actionLoading || checkoutOpen) return;

    // Downgrade to free = open customer portal to cancel
    if (selected === 'free') {
      await openCustomerPortal();
      return;
    }

    const priceId = priceIdMap[selected][billing];

    // Open Stripe embedded checkout
    openCheckout({
      priceId,
      quantity: 1,
      customerEmail: user?.email || undefined,
      userId: user?.id || "",
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  const openCustomerPortal = async () => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          returnUrl: window.location.href,
          environment: getStripeEnvironment(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Portal error:', err);
      toast.error('Could not open subscription management');
    } finally {
      setActionLoading(false);
    }
  };

  const isSuccess = checkout === 'success';
  const loading = checkoutOpen || actionLoading;

  const getButtonText = () => {
    if (currentPlan === selected) return 'Current Plan';
    if (selected === 'free') return 'Manage Subscription';
    if (isActive && currentPlan !== 'free') {
      const tiers = { free: 0, pro: 1, premium: 2 };
      return tiers[selected] > tiers[currentPlan] ? `Upgrade to ${selected === 'premium' ? 'Premium' : 'Pro'}` : `Switch to ${selected === 'premium' ? 'Premium' : 'Pro'}`;
    }
    return `Subscribe to ${selected === 'premium' ? 'Premium' : 'Pro'}`;
  };

  if (checkoutOpen && CheckoutForm) {
    return (
      <div className="min-h-screen max-w-[430px] mx-auto pb-32">
        <div className="px-4 pt-12">
          <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
            <button onClick={closeCheckout} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-foreground">Checkout</h1>
              <p className="text-[13px] text-muted-foreground">Complete your subscription</p>
            </div>
          </div>
          <CheckoutForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[430px] mx-auto pb-32">
      <div className="px-4 pt-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
          <button onClick={() => window.history.back()} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-foreground">Upgrade Plan</h1>
            <p className="text-[13px] text-muted-foreground">Unlock all features</p>
          </div>
        </div>

        {/* Success message */}
        {isSuccess && (
          <div className="mb-4 p-4 rounded-2xl text-center animate-fade-in-up" style={{ background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.3)' }}>
            <p className="text-[15px] font-semibold" style={{ color: '#30D158' }}>🎉 Payment successful!</p>
            <p className="text-[13px] text-muted-foreground mt-1">Your subscription is now active.</p>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 animate-fade-in-up stagger-1" style={{ background: 'rgba(255,255,255,0.10)' }}>
          <button
            onClick={() => setBilling('monthly')}
            className="flex-1 py-2 rounded-[10px] text-[13px] font-medium text-foreground transition-all"
            style={{ background: billing === 'monthly' ? 'rgba(255,255,255,0.20)' : 'transparent' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className="flex-1 py-2 rounded-[10px] text-[13px] font-medium text-foreground transition-all relative"
            style={{ background: billing === 'annual' ? 'rgba(255,255,255,0.20)' : 'transparent' }}
          >
            Annual
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#30D158', color: '#1C1C1E' }}>
              SAVE 35%
            </span>
          </button>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-5 animate-fade-in-up stagger-2">
          {plans.map((p) => {
            const isSelected = selected === p.id;
            const isCurrent = currentPlan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="w-full text-left rounded-2xl p-4 transition-all"
                style={{
                  background: isSelected ? `${p.color}15` : 'rgba(255,255,255,0.06)',
                  border: isSelected ? `2px solid ${p.color}` : '2px solid transparent',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}25` }}>
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[17px] font-semibold text-foreground">{p.name}</span>
                      {p.popular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#0A84FF', color: 'white' }}>
                          POPULAR
                        </span>
                      )}
                      {p.id === 'pro' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(48,209,88,0.25)', color: '#30D158' }}>
                          7 DAYS FREE
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(48,209,88,0.25)', color: '#30D158' }}>
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[22px] font-bold text-foreground">{p.price[billing]}</span>
                      <span className="text-[13px] text-muted-foreground">{p.period[billing]}</span>
                      {p.id === 'pro' && (
                        <span className="ml-2 text-[11px] font-semibold" style={{ color: '#30D158' }}>7 days free</span>
                      )}
                      {billing === 'annual' && p.id === 'pro' && (
                        <span className="ml-2 text-[11px] line-through text-muted-foreground">$59.88/yr</span>
                      )}
                      {billing === 'annual' && p.id === 'premium' && (
                        <span className="ml-2 text-[11px] line-through text-muted-foreground">$119.88/yr</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#30D158' }} />
                      <span className="text-[13px] text-foreground/80">{f}</span>
                    </div>
                  ))}
                  {p.missing.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <X className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
                      <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading || selected === currentPlan}
          className="w-full h-[54px] rounded-2xl text-[17px] font-bold text-foreground animate-fade-in-up stagger-3 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: selected === 'premium' ? 'linear-gradient(135deg, #FFD60A, #FF9F0A)' : '#0A84FF',
            color: selected === 'premium' ? '#1C1C1E' : 'white',
            boxShadow: selected === 'premium' ? '0 0 24px rgba(255,214,10,0.50)' : '0 0 24px rgba(10,132,255,0.50)',
          }}
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {getButtonText()}
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-3">
          {selected === 'premium' ? 'Cancel anytime. Billed immediately.' : selected === 'pro' ? '7-day free trial. Cancel anytime.' : ''}
        </p>

        {/* Manage subscription link for active subscribers */}
        {isActive && currentPlan !== 'free' && (
          <button
            onClick={openCustomerPortal}
            disabled={actionLoading}
            className="w-full text-center mt-4 text-[14px] font-medium"
            style={{ color: '#0A84FF' }}
          >
            Manage Subscription & Billing →
          </button>
        )}

        <div className="flex items-center justify-center gap-4 mt-6 mb-2">
          <Link to="/terms" className="text-[12px] text-muted-foreground hover:text-foreground">Terms</Link>
          <span className="text-[12px] text-muted-foreground">·</span>
          <Link to="/privacy" className="text-[12px] text-muted-foreground hover:text-foreground">Privacy</Link>
          <span className="text-[12px] text-muted-foreground">·</span>
          <Link to="/refund" className="text-[12px] text-muted-foreground hover:text-foreground">Refund Policy</Link>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
