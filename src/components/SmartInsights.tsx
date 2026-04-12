import { Crown, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { GlassCard } from './GlassCard';

interface SmartInsightsProps {
  bestDay: { date: string; total: number };
  bestShift: { shift: string; total: number };
  weekTotal: number;
  weekTipCount: number;
  isPro: boolean;
}

export function SmartInsights({ bestDay, bestShift, weekTotal, weekTipCount, isPro }: SmartInsightsProps) {
  const avgPerShift = weekTipCount > 0 ? weekTotal / weekTipCount : 0;
  const bestDayLabel = bestDay.date
    ? new Date(bestDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
    : '—';

  if (!isPro) {
    return (
      <Link to="/pricing" search={{ plan: 'pro' }} className="block">
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#FF9F0A' }} />
              Smart Insights
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}>
                <Crown className="w-3 h-3" /> PRO
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(48,209,88,0.25)', color: '#30D158' }}>
                7 DAYS FREE
              </span>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground">Discover your best earning days, peak shifts, and weekly trends. Upgrade to Pro.</p>
        </GlassCard>
      </Link>
    );
  }

  return (
    <GlassCard className="animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4" style={{ color: '#FF9F0A' }} />
        <h3 className="text-[15px] font-semibold text-foreground">Smart Insights</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.15)' }}>
          <Calendar className="w-5 h-5 shrink-0" style={{ color: '#FF9F0A' }} />
          <div>
            <p className="text-[13px] font-medium text-foreground">Best Day: {bestDayLabel}</p>
            <p className="text-[11px] text-muted-foreground">${bestDay.total.toFixed(2)} earned</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(94,92,230,0.08)', border: '1px solid rgba(94,92,230,0.15)' }}>
          <Clock className="w-5 h-5 shrink-0" style={{ color: '#5E5CE6' }} />
          <div>
            <p className="text-[13px] font-medium text-foreground capitalize">Peak Shift: {bestShift.shift}</p>
            <p className="text-[11px] text-muted-foreground">${bestShift.total.toFixed(2)} total from this shift</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
          <TrendingUp className="w-5 h-5 shrink-0" style={{ color: '#30D158' }} />
          <div>
            <p className="text-[13px] font-medium text-foreground">Avg per Shift: ${avgPerShift.toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">{weekTipCount} shifts this week</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
