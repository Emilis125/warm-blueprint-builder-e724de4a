import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { GlassCard } from '@/components/GlassCard';
import { WeekChart } from '@/components/WeekChart';
import { LogTipsSheet } from '@/components/LogTipsSheet';
import { TabBar } from '@/components/TabBar';
import { AdBanner } from '@/components/AdBanner';
import { GoalTracker } from '@/components/GoalTracker';
import { useTips } from '@/hooks/use-tips';
import { useSubscription } from '@/hooks/use-subscription';
import { useSettings } from '@/hooks/use-settings';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Dashboard' },
      { name: 'description', content: 'Track your tips in seconds. Stay tax-ready all year.' },
    ],
  }),
});

function Dashboard() {
  const [logOpen, setLogOpen] = useState(false);
  const { todayTotal, todayCash, todayCard, diff, dailyTotals, yesterdayTotal, weekTotal, monthTotal } = useTips();
  const { isPro } = useSubscription();
  const { weeklyGoal, monthlyGoal, setWeeklyGoal, setMonthlyGoal } = useSettings();

  const today = new Date();
  const dayStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const cashPercent = todayTotal > 0 ? Math.round((todayCash / todayTotal) * 100) : 0;
  const cardPercent = todayTotal > 0 ? Math.round((todayCard / todayTotal) * 100) : 0;

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      {/* Header */}
      <div className="mb-5 animate-fade-in-up">
        <h1 className="text-[34px] font-bold text-foreground">Today</h1>
        <p className="text-[15px] text-muted-foreground">{dayStr}</p>
      </div>

      {/* Hero Card */}
      <GlassCard variant="hero" className="mb-3 animate-fade-in-up stagger-1">
        <p className="text-[13px] text-muted-foreground mb-1">Total Earned Today</p>
        <p className="text-[44px] font-light text-foreground tracking-tight">
          ${todayTotal.toFixed(2)}
        </p>
        {diff !== 0 && (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium mt-2 ${diff > 0 ? 'success-pill' : ''}`}
            style={diff < 0 ? { background: 'rgba(255,69,58,0.20)', border: '1px solid rgba(255,69,58,0.40)', color: '#FF453A' } : undefined}
          >
            {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {diff > 0 ? '+' : ''}${diff.toFixed(2)} vs yesterday
          </span>
        )}
      </GlassCard>

      {/* Cash / Card split */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <GlassCard className="animate-fade-in-up stagger-2">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1">CASH</p>
          <p className="text-[22px] font-semibold text-foreground">${todayCash.toFixed(2)}</p>
          {cashPercent > 0 && <p className="text-[12px] mt-1" style={{ color: '#30D158' }}>{cashPercent}%</p>}
        </GlassCard>
        <GlassCard className="animate-fade-in-up stagger-2">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1">CARD</p>
          <p className="text-[22px] font-semibold text-foreground">${todayCard.toFixed(2)}</p>
          {cardPercent > 0 && <p className="text-[12px] mt-1" style={{ color: '#30D158' }}>{cardPercent}%</p>}
        </GlassCard>
      </div>

      {/* Ad banner */}
      <div className="mb-5 animate-fade-in-up stagger-3">
        <AdBanner variant="inline" />
      </div>

      {/* Week Chart */}
      <WeekChart data={dailyTotals} />

      {/* Goal Tracker */}
      <div className="mt-5">
        <GoalTracker
          weekTotal={weekTotal}
          monthTotal={monthTotal}
          isPro={isPro}
          weeklyGoal={weeklyGoal}
          monthlyGoal={monthlyGoal}
          onSetWeeklyGoal={setWeeklyGoal}
          onSetMonthlyGoal={setMonthlyGoal}
        />
      </div>

      {/* Log Tips Button */}
      <button
        onClick={() => setLogOpen(true)}
        className="w-full h-[54px] mt-5 text-[17px] font-bold text-foreground rounded-2xl animate-fade-in-up stagger-4"
        style={{
          background: 'rgba(10,132,255,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(10,132,255,0.60)',
        }}
      >
        Log Tips +
      </button>

      {/* Sticky upgrade banner */}
      <AdBanner variant="sticky" />

      <LogTipsSheet open={logOpen} onClose={() => setLogOpen(false)} />
      <TabBar />
    </div>
  );
}
