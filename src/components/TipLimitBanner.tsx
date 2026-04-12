import { AlertTriangle, Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface TipLimitBannerProps {
  used: number;
  limit: number;
}

export function TipLimitBanner({ used, limit }: TipLimitBannerProps) {
  const remaining = Math.max(0, limit - used);
  const isAtLimit = remaining === 0;
  const isNearLimit = remaining <= 5 && remaining > 0;

  if (!isAtLimit && !isNearLimit) return null;

  return (
    <div className="rounded-2xl p-4 mb-4" style={{
      background: isAtLimit ? 'rgba(255,69,58,0.12)' : 'rgba(255,149,0,0.12)',
      border: `1px solid ${isAtLimit ? 'rgba(255,69,58,0.30)' : 'rgba(255,149,0,0.30)'}`,
    }}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: isAtLimit ? '#FF453A' : '#FF9F0A' }} />
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-foreground mb-0.5">
            {isAtLimit ? 'Monthly tip limit reached' : `Only ${remaining} tips left this month`}
          </p>
          <p className="text-[12px] text-muted-foreground mb-2">
            {isAtLimit
              ? 'Free plan allows 30 tips per month. Upgrade to Pro for unlimited logging.'
              : `You've used ${used} of ${limit} free tips. Upgrade for unlimited.`}
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: '#0A84FF', color: 'white' }}
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
