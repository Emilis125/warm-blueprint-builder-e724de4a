import { createFileRoute } from '@tanstack/react-router';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { Bell, Briefcase, CreditCard, Calendar, LogOut, ChevronRight } from 'lucide-react';

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
  const settings = [
    { icon: Bell, label: 'Notifications', sub: 'Daily reminder at 11:00 PM' },
    { icon: Briefcase, label: 'Workplace', sub: 'Main Job' },
    { icon: CreditCard, label: 'Subscription', sub: 'Free Plan' },
    { icon: Calendar, label: 'Tax Year', sub: '2025' },
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
        <span className="mt-2 px-4 py-1 glass-pill text-[13px] font-medium text-foreground">Free</span>
      </div>

      {/* Settings */}
      <GlassCard className="!p-0 mb-5 animate-fade-in-up stagger-2">
        {settings.map((item, i) => (
          <button key={item.label} className="w-full flex items-center gap-4 px-5 py-4"
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

      {/* Sign Out */}
      <GlassCard className="!p-0 animate-fade-in-up stagger-3">
        <button className="w-full flex items-center gap-4 px-5 py-4">
          <LogOut className="w-5 h-5" style={{ color: '#FF453A' }} />
          <span className="text-[15px] font-medium" style={{ color: '#FF453A' }}>Sign Out</span>
        </button>
      </GlassCard>

      <TabBar />
    </div>
  );
}
