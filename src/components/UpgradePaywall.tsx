import { useState } from 'react';
import { Lock, Crown } from 'lucide-react';
import { SubscriptionSheet } from './SubscriptionSheet';

interface UpgradePaywallProps {
  feature: string;
  description?: string;
  tier?: 'pro' | 'premium';
}

export function UpgradePaywall({ feature, description, tier = 'pro' }: UpgradePaywallProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl p-5 text-center" style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.15)' }}>
          <Lock className="w-6 h-6" style={{ color: '#0A84FF' }} />
        </div>
        <h3 className="text-[17px] font-semibold text-foreground mb-1">{feature}</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          {description || `Upgrade to ${tier === 'premium' ? 'Premium' : 'Pro'} to unlock this feature.`}
        </p>
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold"
          style={{
            background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)',
            color: 'white',
            boxShadow: '0 0 20px rgba(10,132,255,0.40)',
          }}
        >
          <Crown className="w-4 h-4" />
          Upgrade to {tier === 'premium' ? 'Premium' : 'Pro'}
        </button>
      </div>
      <SubscriptionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
