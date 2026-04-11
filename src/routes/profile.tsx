import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RequireAuth } from '@/components/RequireAuth';
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { SubscriptionSheet } from '@/components/SubscriptionSheet';
import { AdBanner } from '@/components/AdBanner';
import { NotificationSheet } from '@/components/NotificationSheet';
import { WorkplaceSheet } from '@/components/WorkplaceSheet';
import { CategoriesSheet } from '@/components/CategoriesSheet';
import { PrioritySupport } from '@/components/PrioritySupport';
import { useSubscription } from '@/hooks/use-subscription';
import { useSettings } from '@/hooks/use-settings';
import { useTips } from '@/hooks/use-tips';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Briefcase, CreditCard, Calendar, LogOut, ChevronRight, Crown, Lock, Tag, Database, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/profile')({
  component: () => <RequireAuth><ProfilePage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Profile' },
      { name: 'description', content: 'Manage your TipTracker Pro settings and account.' },
    ],
  }),
});

function downloadBackup(allTips: any[]) {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    tipCount: allTips.length,
    tips: allTips,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TipTracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [subOpen, setSubOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [wpOpen, setWpOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [backupDone, setBackupDone] = useState(false);
  const { plan, isPro, isPremium } = useSubscription();
  const { monthTipCount, allTips } = useTips();
  const { workplaces, addWorkplace, removeWorkplace } = useSettings();
  const [selectedWp, setSelectedWp] = useState(workplaces[0] || 'Main Job');

  const planLabels = { free: 'Free Plan', pro: 'Pro Plan', premium: 'Premium' };
  const planColors = { free: 'rgba(255,255,255,0.60)', pro: '#0A84FF', premium: '#FFD60A' };

  const handleBackup = () => {
    downloadBackup(allTips);
    setBackupDone(true);
    toast.success('Backup downloaded!', { description: 'Your tip data has been exported as a JSON file.' });
    setTimeout(() => setBackupDone(false), 3000);
  };

  const handleCloudBackup = () => {
    toast.success('Cloud backup active!', { description: 'Your data is automatically synced to the cloud via Lovable Cloud.' });
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  const settings = [
    { icon: Bell, label: 'Notifications', sub: 'Daily reminder at 11:00 PM', onClick: () => setNotifOpen(true) },
    { icon: Briefcase, label: 'Workplace', sub: isPro ? `${workplaces.length} workplace${workplaces.length > 1 ? 's' : ''}` : 'Main Job', onClick: isPro ? () => setWpOpen(true) : undefined, premium: !isPro },
    { icon: Tag, label: 'Custom Categories', sub: isPremium ? 'Manage categories' : 'Premium feature', onClick: isPremium ? () => setCatOpen(true) : undefined, premium: !isPremium },
    { icon: CreditCard, label: 'Subscription', sub: planLabels[plan], onClick: () => setSubOpen(true), badge: plan !== 'free' },
    { icon: Calendar, label: 'Tax Year', sub: String(new Date().getFullYear()), onClick: undefined },
    { icon: Download, label: 'Data Export & Backup', sub: isPremium ? (backupDone ? 'Downloaded ✓' : 'Download all data as JSON') : 'Premium feature', onClick: isPremium ? handleBackup : undefined, premium: !isPremium },
    { icon: Database, label: 'Cloud Backup', sub: isPro ? 'Sync data to cloud' : 'Pro feature', onClick: isPro ? handleCloudBackup : undefined, premium: !isPro },
  ];

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      <h1 className="text-[34px] font-bold text-foreground mb-8 animate-fade-in-up">Profile</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8 animate-fade-in-up stagger-1">
        <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-3">
          <span className="text-xl font-semibold text-foreground">{initials}</span>
        </div>
        <p className="text-[17px] font-semibold text-foreground">{displayName}</p>
        <p className="text-[15px] text-muted-foreground">{user?.email || ''}</p>
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

      {/* Free plan usage */}
      {!isPro && (
        <GlassCard className="mb-5 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-muted-foreground">Tips this month</span>
            <span className="text-[13px] font-medium text-foreground">{monthTipCount} / 30</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min((monthTipCount / 30) * 100, 100)}%`,
              background: monthTipCount >= 25 ? '#FF453A' : monthTipCount >= 20 ? '#FF9F0A' : '#0A84FF',
            }} />
          </div>
        </GlassCard>
      )}

      {/* Ad banner */}
      <div className="mb-5 animate-fade-in-up stagger-2">
        <AdBanner variant="inline" />
      </div>

      {/* Settings */}
      <GlassCard className="!p-0 mb-5 animate-fade-in-up stagger-2">
        {settings.map((item, i) => (
          <button
            key={item.label}
            onClick={item.premium ? () => setSubOpen(true) : item.onClick}
            className="w-full flex items-center gap-4 px-5 py-4"
            style={i < settings.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.12)' } : undefined}
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-medium text-foreground">{item.label}</p>
                {item.premium && <Lock className="w-3 h-3" style={{ color: '#FFD60A' }} />}
              </div>
              <p className="text-[13px] text-muted-foreground">{item.sub}</p>
            </div>
            {item.label === 'Data Export & Backup' && backupDone ? (
              <CheckCircle className="w-4 h-4" style={{ color: '#30D158' }} />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </GlassCard>

      {/* Priority Support */}
      <div className="mb-5">
        <PrioritySupport isPremium={isPremium} />
      </div>

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
            <p className="text-[13px] text-muted-foreground">Unlock unlimited features</p>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: '#0A84FF' }} />
        </button>
      )}

      {/* Sign Out */}
      <GlassCard className="!p-0 animate-fade-in-up stagger-3">
        <button className="w-full flex items-center gap-4 px-5 py-4" onClick={async () => {
          await signOut();
          navigate({ to: '/login' });
        }}>
          <LogOut className="w-5 h-5" style={{ color: '#FF453A' }} />
          <span className="text-[15px] font-medium" style={{ color: '#FF453A' }}>Sign Out</span>
        </button>
      </GlassCard>

      <SubscriptionSheet open={subOpen} onClose={() => setSubOpen(false)} />
      <NotificationSheet open={notifOpen} onClose={() => setNotifOpen(false)} />
      <WorkplaceSheet
        open={wpOpen}
        onClose={() => setWpOpen(false)}
        workplaces={workplaces}
        selected={selectedWp}
        onSelect={setSelectedWp}
        onAdd={addWorkplace}
        onRemove={removeWorkplace}
      />
      <CategoriesSheet open={catOpen} onClose={() => setCatOpen(false)} />
      <TabBar />
    </div>
  );
}
