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
    price: '$0',
    period: '/forever',
    icon: Star,
    color: 'rgba(255,255,255,0.60)',
    features: ['Log up to 30 tips/month', 'Basic weekly chart', 'Cash & card split'],
    missing: ['Tax export (PDF & CSV)', 'Advanced reports', 'Ad-free experience', 'Priority support'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    icon: Zap,
    color: '#0A84FF',
    popular: true,
    features: ['Unlimited tip logging', 'Full weekly & monthly charts', 'Cash & card split', 'Tax export (PDF & CSV)', 'Advanced reports'],
    missing: ['Ad-free experience', 'Priority support'],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    icon: Crown,
    color: '#FFD60A',
    features: ['Everything in Pro', 'Ad-free experience', 'Priority support', 'Custom categories', 'Multi-workplace', 'Data export & backup'],
    missing: [],
  },
];

export function SubscriptionSheet({ open, onClose }: SubscriptionSheetProps) {
  const { plan: currentPlan, setPlan } = useSubscription();
  const [selected, setSelected] = useState<'free' | 'pro' | 'premium'>('pro');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[430px] glass-sheet animate-slide-up px-5 pt-4 pb-8" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Handle */}
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.30)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[22px] font-bold text-foreground">Upgrade Plan</h2>
            <p className="text-[13px] text-muted-foreground">Unlock all features</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-muted-foreground" />
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
                      <span className="text-[22px] font-bold text-foreground">{p.price}</span>
                      <span className="text-[13px] text-muted-foreground">{p.period}</span>
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
          onClick={() => { setPlan(selected); onClose(); }}
          className="w-full h-[54px] rounded-2xl text-[17px] font-bold text-foreground"
          style={{
            background: selected === 'premium' ? 'linear-gradient(135deg, #FFD60A, #FF9F0A)' : '#0A84FF',
            color: selected === 'premium' ? '#1C1C1E' : 'white',
            boxShadow: selected === 'premium' ? '0 0 24px rgba(255,214,10,0.50)' : '0 0 24px rgba(10,132,255,0.50)',
          }}
        >
          {currentPlan === selected ? 'Current Plan' : selected === 'free' ? 'Downgrade to Free' : `Start 7-Day Free Trial`}
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-3">
          Cancel anytime. No charge during trial period.
        </p>
      </div>
    </div>
  );
}
