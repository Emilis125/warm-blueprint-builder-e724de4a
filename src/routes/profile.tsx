import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { SubscriptionSheet } from '@/components/SubscriptionSheet';
import { useSubscription } from '@/hooks/use-subscription';
import { Bell, Briefcase, CreditCard, Calendar, LogOut, ChevronRight, Crown } from 'lucide-react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Profile' },
      { name: 'description', content: 'Manage your TipTracker Pro settings and account.' },
    ],
  }),
});

function ProfilePage() {
  const [subOpen, setSubOpen] = useState(false);
  const { plan } = useSubscription();

  const planLabels = { free: 'Free Plan', pro: 'Pro Plan', premium: 'Premium' };
  const planColors = { free: 'rgba(255,255,255,0.60)', pro: '#0A84FF', premium: '#FFD60A' };

  const settings = [
    { icon: Bell, label: 'Notifications', sub: 'Daily reminder at 11:00 PM', onClick: undefined },
    { icon: Briefcase, label: 'Workplace', sub: 'Main Job', onClick: undefined },
    { icon: CreditCard, label: 'Subscription', sub: planLabels[plan], onClick: () => setSubOpen(true), badge: plan !== 'free' },
    { icon: Calendar, label: 'Tax Year', sub: '2025', onClick: undefined },
  ];

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      <h1 className="text-[34px] font-bold text-foreground mb-8 animate-fade-in-up">Profile</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8 animate-fade-in-up stagger-1">
        <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-3">
          <span className="text-xl font-semibold text-foreground">JD</span>
        </div>
        <p className="text-[17px] font-semibold text-foreground">John Doe</p>
        <p className="text-[15px] text-muted-foreground">john@example.com</p>
        <span className="mt-2 px-4 py-1 rounded-full text-[13px] font-medium flex items-center gap-1.5"
          style={{
            background: plan === 'premium' ? 'rgba(255,214,10,0.15)' : plan === 'pro' ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.08)',
            color: planColors[plan],
            border: plan !== 'free' ? `1px solid ${planColors[plan]}40` : undefined,
          }}
        >
          {plan !== 'free' && <Crown className="w-3 h-3" />}
          {planLabels[plan]}
        </span>
      </div>

      {/* Settings */}
      <GlassCard className="!p-0 mb-5 animate-fade-in-up stagger-2">
        {settings.map((item, i) => (
          <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-4 px-5 py-4"
            style={i < settings.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.12)' } : undefined}>
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-[15px] font-medium text-foreground">{item.label}</p>
              <p className="text-[13px] text-muted-foreground">{item.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </GlassCard>

      {/* Upgrade CTA for free users */}
      {plan === 'free' && (
        <button
          onClick={() => setSubOpen(true)}
          className="w-full rounded-2xl p-4 mb-5 flex items-center gap-4 animate-fade-in-up stagger-3"
          style={{
            background: 'linear-gradient(135deg, rgba(10,132,255,0.15), rgba(94,92,230,0.15))',
            border: '1px solid rgba(10,132,255,0.25)',
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.20)' }}>
            <Crown className="w-5 h-5" style={{ color: '#0A84FF' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-foreground">Upgrade to Pro</p>
            <p className="text-[13px] text-muted-foreground">Start your 7-day free trial</p>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: '#0A84FF' }} />
        </button>
      )}

      {/* Sign Out */}
      <GlassCard className="!p-0 animate-fade-in-up stagger-3">
        <button className="w-full flex items-center gap-4 px-5 py-4">
          <LogOut className="w-5 h-5" style={{ color: '#FF453A' }} />
          <span className="text-[15px] font-medium" style={{ color: '#FF453A' }}>Sign Out</span>
        </button>
      </GlassCard>

      <SubscriptionSheet open={subOpen} onClose={() => setSubOpen(false)} />
      <TabBar />
    </div>
  );
}
