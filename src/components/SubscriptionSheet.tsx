import { useState } from 'react';
import { X, Check, Crown, Zap, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

interface SubscriptionSheetProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: { monthly: '/forever', annual: '/forever' },
    icon: Star,
    color: 'rgba(255,255,255,0.60)',
    features: ['Daily logging', 'Basic weekly chart', 'Cash & card split', '30-day history'],
    missing: ['Unlimited history', 'Tax export (PDF & CSV)', 'Advanced reports & insights', 'Goal tracking', 'Multi-job tracking', 'Cloud backup', 'Ad-free experience', 'AI insights', 'Priority support'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: { monthly: '$4.99', annual: '$39' },
    period: { monthly: '/month', annual: '/year' },
    icon: Zap,
    color: '#0A84FF',
    popular: true,
    features: ['Unlimited tip logging', 'Unlimited history', 'Full weekly & monthly charts', 'Tax export (PDF & CSV)', 'Smart insights & trends', 'Goal tracking', 'Multi-job tracking', 'Cloud backup'],
    missing: ['Ad-free experience', 'AI insights', 'Priority support'],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: { monthly: '$9.99', annual: '$79' },
    period: { monthly: '/month', annual: '/year' },
    icon: Crown,
    color: '#FFD60A',
    features: ['Everything in Pro', 'Ad-free experience', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Data export & backup'],
    missing: [],
  },
];

export function SubscriptionSheet({ open, onClose }: SubscriptionSheetProps) {
  const { plan: currentPlan } = useSubscription();
  const [selected, setSelected] = useState<'free' | 'pro' | 'premium'>('pro');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[430px] glass-sheet animate-slide-up px-5 pt-4 pb-8" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Handle */}
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.30)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] font-bold text-foreground">Upgrade Plan</h2>
            <p className="text-[13px] text-muted-foreground">Unlock all features</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Billing toggle */}
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.10)' }}>
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
        <div className="space-y-3 mb-5">
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
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-semibold text-foreground">{p.name}</span>
                      {p.popular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#0A84FF', color: 'white' }}>
                          POPULAR
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
                      {billing === 'annual' && p.id === 'pro' && (
                        <span className="ml-2 text-[11px] line-through text-muted-foreground">$59.88/yr</span>
                      )}
                      {billing === 'annual' && p.id === 'premium' && (
                        <span className="ml-2 text-[11px] line-through text-muted-foreground">$119.88/yr</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
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
          onClick={() => { onClose(); }}
          className="w-full h-[54px] rounded-2xl text-[17px] font-bold text-foreground"
          style={{
            background: selected === 'premium' ? 'linear-gradient(135deg, #FFD60A, #FF9F0A)' : '#0A84FF',
            color: selected === 'premium' ? '#1C1C1E' : 'white',
            boxShadow: selected === 'premium' ? '0 0 24px rgba(255,214,10,0.50)' : '0 0 24px rgba(10,132,255,0.50)',
          }}
        >
          {currentPlan === selected ? 'Current Plan' : selected === 'free' ? 'Downgrade to Free' : selected === 'pro' ? 'Start 7-Day Free Trial' : 'Subscribe to Premium'}
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-3">
          {selected === 'premium' ? 'Cancel anytime. Billed immediately.' : selected === 'pro' ? '7-day free trial. Cancel anytime.' : ''}
        </p>
      </div>
    </div>
  );
}
