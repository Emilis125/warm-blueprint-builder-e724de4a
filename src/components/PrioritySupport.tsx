import { Crown, Headphones, Mail, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

interface PrioritySupportProps {
  isPremium: boolean;
}

export function PrioritySupport({ isPremium }: PrioritySupportProps) {
  if (!isPremium) {
    return (
      <Link to="/pricing" search={{ plan: 'premium' }} className="block">
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <Headphones className="w-4 h-4" style={{ color: '#FF375F' }} />
              Priority Support
            </h3>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A' }}>
              <Crown className="w-3 h-3" /> PREMIUM
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground">Get fast, dedicated support from our team. Premium members skip the queue.</p>
        </GlassCard>
      </Link>
    );
  }

  return (
    <GlassCard className="animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="w-4 h-4" style={{ color: '#FF375F' }} />
        <h3 className="text-[15px] font-semibold text-foreground">Priority Support</h3>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(48,209,88,0.20)', color: '#30D158' }}>ACTIVE</span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => {
            window.location.href = 'mailto:emiljaso11@gmail.com?subject=Premium Support Request';
            toast.success('Opening email client...');
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Mail className="w-5 h-5" style={{ color: '#0A84FF' }} />
          <div className="flex-1 text-left">
            <p className="text-[14px] font-medium text-foreground">Email Support</p>
            <p className="text-[11px] text-muted-foreground">Response within 2 hours</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </GlassCard>
  );
}
