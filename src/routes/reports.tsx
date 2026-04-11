import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { AdBanner } from '@/components/AdBanner';
import { useTips } from '@/hooks/use-tips';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePaywall } from '@/components/UpgradePaywall';

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
  const { isPro, isPremium } = useSubscription();

  const tips = period === 'week' ? weekTips : period === 'month' ? monthTips : yearTips;
  const total = period === 'week' ? weekTotal : period === 'month' ? monthTotal : yearTips.reduce((s, t) => s + t.amount, 0);
  const shifts = tips.length;
  const avg = shifts > 0 ? total / shifts : 0;
  const best = tips.length > 0 ? Math.max(...tips.map(t => t.amount)) : 0;
  const cashTotal = tips.reduce((s, t) => s + t.cashAmount, 0);
  const cardTotal = tips.reduce((s, t) => s + t.cardAmount, 0);

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

      {/* Cash vs Card breakdown — Pro feature */}
      {isPro ? (
        <GlassCard className="mb-5 animate-fade-in-up stagger-3">
          <h3 className="text-[15px] font-semibold text-foreground mb-3">Cash vs Card</h3>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(48,209,88,0.10)', border: '1px solid rgba(48,209,88,0.20)' }}>
              <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: '#30D158' }}>CASH</p>
              <p className="text-[20px] font-semibold text-foreground">${cashTotal.toFixed(2)}</p>
              <p className="text-[12px] text-muted-foreground">{total > 0 ? Math.round((cashTotal / total) * 100) : 0}% of total</p>
            </div>
            <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(10,132,255,0.10)', border: '1px solid rgba(10,132,255,0.20)' }}>
              <p className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: '#0A84FF' }}>CARD</p>
              <p className="text-[20px] font-semibold text-foreground">${cardTotal.toFixed(2)}</p>
              <p className="text-[12px] text-muted-foreground">{total > 0 ? Math.round((cardTotal / total) * 100) : 0}% of total</p>
            </div>
          </div>
        </GlassCard>
      ) : null}

      {/* Advanced chart — paywalled for month/year */}
      {period === 'week' || isPro ? (
        <GlassCard className="mb-5 animate-fade-in-up stagger-3">
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
        <div className="mb-5 animate-fade-in-up stagger-3">
          <UpgradePaywall
            feature="Advanced Reports"
            description="Unlock monthly and yearly breakdowns, trends, and detailed analytics."
          />
        </div>
      )}

      {/* Shift breakdown — Premium feature */}
      {isPremium ? (
        <GlassCard className="animate-fade-in-up stagger-4">
          <h3 className="text-[15px] font-semibold text-foreground mb-3">Shift Performance</h3>
          {(['morning', 'afternoon', 'evening'] as const).map(s => {
            const shiftTips = tips.filter(t => t.shift === s);
            const shiftTotal = shiftTips.reduce((sum, t) => sum + t.amount, 0);
            const pct = total > 0 ? Math.round((shiftTotal / total) * 100) : 0;
            return (
              <div key={s} className="flex items-center justify-between py-2.5" style={{ borderBottom: s !== 'evening' ? '0.5px solid rgba(255,255,255,0.08)' : undefined }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px]">{s === 'morning' ? '🌅' : s === 'afternoon' ? '☀️' : '🌙'}</span>
                  <span className="text-[14px] text-foreground capitalize">{s}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#0A84FF' }} />
                  </div>
                  <span className="text-[13px] font-medium text-foreground w-16 text-right">${shiftTotal.toFixed(0)}</span>
                </div>
              </div>
            );
          })}
        </GlassCard>
      ) : isPro ? (
        <div className="animate-fade-in-up stagger-4">
          <UpgradePaywall
            feature="Shift Performance"
            description="See which shifts earn you the most. Premium only."
          />
        </div>
      ) : null}

      <TabBar />
    </div>
  );
}
