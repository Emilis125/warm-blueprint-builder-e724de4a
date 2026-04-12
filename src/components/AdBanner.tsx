import { useState } from 'react';
import { X, Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useSubscription } from '@/hooks/use-subscription';

interface AdBannerProps {
  variant?: 'inline' | 'sticky';
}

export function AdBanner({ variant = 'inline' }: AdBannerProps) {
  const { isPremium } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (isPremium || dismissed) return null;

  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up" style={{ width: 'min(380px, calc(100% - 48px))' }}>
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{
          background: 'linear-gradient(135deg, rgba(10,132,255,0.20), rgba(94,92,230,0.20))',
          border: '1px solid rgba(10,132,255,0.30)',
          backdropFilter: 'blur(20px)',
        }}>
          <Crown className="w-5 h-5 shrink-0" style={{ color: '#FFD60A' }} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">Go Premium — Remove ads</p>
            <p className="text-[11px] text-muted-foreground">Enjoy an ad-free experience</p>
          </div>
          <Link to="/pricing" className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold" style={{ background: '#0A84FF', color: 'white' }}>
            Upgrade
          </Link>
          <button onClick={() => setDismissed(true)} className="shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>SPONSORED</span>
        </div>
        <button onClick={() => setDismissed(true)}>
          <X className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.25)' }} />
        </button>
      </div>
      <div className="px-4 pb-4">
        <div className="h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.15), rgba(255,214,10,0.15))', border: '1px dashed rgba(255,255,255,0.12)' }}>
          <p className="text-[13px] text-muted-foreground">Ad placeholder</p>
        </div>
        <Link to="/pricing" className="mt-2 text-[11px] font-medium flex items-center gap-1" style={{ color: '#0A84FF' }}>
          <Crown className="w-3 h-3" /> Remove ads with Premium
        </Link>
      </div>
    </div>
  );
}
