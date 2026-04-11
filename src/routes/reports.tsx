import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { useTips } from '@/hooks/use-tips';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePaywall } from '@/components/UpgradePaywall';
import { AdBanner } from '@/components/AdBanner';

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Reports' },
      { name: 'description', content: 'View your weekly, monthly, and yearly tip reports.' },
    ],
  }),
});

function ReportsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { weekTips, monthTips, yearTips, weekTotal, monthTotal } = useTips();
  const { isPro } = useSubscription();

  const tips = period === 'week' ? weekTips : period === 'month' ? monthTips : yearTips;
  const total = period === 'week' ? weekTotal : period === 'month' ? monthTotal : yearTips.reduce((s, t) => s + t.amount, 0);
  const shifts = tips.length;
  const avg = shifts > 0 ? total / shifts : 0;
  const best = tips.length > 0 ? Math.max(...tips.map(t => t.amount)) : 0;

  const periods = ['week', 'month', 'year'] as const;

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      <h1 className="text-[34px] font-bold text-foreground mb-5 animate-fade-in-up">Reports</h1>

      {/* Period selector */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 animate-fade-in-up stagger-1" style={{ background: 'rgba(255,255,255,0.10)' }}>
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className="flex-1 py-2 rounded-[10px] text-sm font-medium text-foreground capitalize transition-all"
            style={{ background: period === p ? 'rgba(255,255,255,0.20)' : 'transparent' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Summary — always visible */}
      <GlassCard className="mb-5 animate-fade-in-up stagger-2 !p-0">
        {[
          { label: 'Total Earned', value: `$${total.toFixed(2)}` },
          { label: 'Avg per Shift', value: `$${avg.toFixed(2)}` },
          { label: 'Best Entry', value: `$${best.toFixed(2)}` },
          { label: 'Shifts Logged', value: String(shifts) },
        ].map((row, i) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-4" style={i < 3 ? { borderBottom: '0.5px solid rgba(255,255,255,0.12)' } : undefined}>
            <span className="text-[15px] text-muted-foreground">{row.label}</span>
            <span className="text-[15px] font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* Ad banner for free users */}
      <div className="mb-5 animate-fade-in-up stagger-3">
        <AdBanner variant="inline" />
      </div>

      {/* Advanced chart — paywalled for month/year */}
      {period === 'week' || isPro ? (
        <GlassCard className="animate-fade-in-up stagger-3">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">
            {period === 'week' ? 'Daily Breakdown' : period === 'month' ? 'Weekly Breakdown' : 'Monthly Breakdown'}
          </h3>
          <div className="flex items-end gap-3 h-28">
            {(period === 'week' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : period === 'month' ? ['W1','W2','W3','W4'] : ['Q1','Q2','Q3','Q4']).map((label, i) => {
              const heights = [60, 80, 45, 95, 70, 50, 75];
              const h = heights[i % heights.length];
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: '70px' }}>
                    <div className="w-full rounded-md" style={{
                      height: `${h}%`,
                      background: i === (period === 'week' ? 6 : 3) ? '#0A84FF' : 'rgba(10,132,255,0.35)',
                      boxShadow: i === (period === 'week' ? 6 : 3) ? '0 0 16px rgba(10,132,255,0.60)' : 'none',
                    }} />
                  </div>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.50)' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      ) : (
        <div className="animate-fade-in-up stagger-3">
          <UpgradePaywall
            feature="Advanced Reports"
            description="Unlock monthly and yearly breakdowns, trends, and detailed analytics."
          />
        </div>
      )}

      <TabBar />
    </div>
  );
}
