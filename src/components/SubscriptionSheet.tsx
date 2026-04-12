import { Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useSubscription } from '@/hooks/use-subscription';

interface SubscriptionSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SubscriptionSheet({ open, onClose }: SubscriptionSheetProps) {
  const { plan } = useSubscription();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[430px] glass-sheet animate-slide-up px-5 pt-4 pb-8">
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.30)' }} />
        <div className="text-center mb-6">
          <Crown className="w-10 h-10 mx-auto mb-3" style={{ color: '#FFD60A' }} />
          <h2 className="text-[22px] font-bold text-foreground mb-1">Upgrade Your Plan</h2>
          <p className="text-[13px] text-muted-foreground">Unlock unlimited features and premium tools</p>
        </div>
        <Link
          to="/pricing"
          onClick={onClose}
          className="block w-full h-[54px] rounded-2xl text-[17px] font-bold text-center leading-[54px]"
          style={{ background: '#0A84FF', color: 'white', boxShadow: '0 0 24px rgba(10,132,255,0.50)' }}
        >
          View Plans & Pricing
        </Link>
      </div>
    </div>
  );
}
