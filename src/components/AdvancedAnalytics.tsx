import { Crown, BarChart3, Target, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { GlassCard } from './GlassCard';
import type { TipEntry } from '@/lib/tip-store';

interface AdvancedAnalyticsProps {
  tips: TipEntry[];
  isPremium: boolean;
}

export function AdvancedAnalytics({ tips, isPremium }: AdvancedAnalyticsProps) {
  if (!isPremium) {
    return (
      <Link to="/pricing" search={{ plan: 'premium' }} className="block">
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: '#64D2FF' }} />
              Advanced Analytics
            </h3>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A' }}>
              <Crown className="w-3 h-3" /> PREMIUM
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Hourly heatmaps, earning velocity, workplace comparisons, and income projections.
          </p>
        </GlassCard>
      </Link>
    );
  }

  // Earning velocity — compare last 7 days to prior 7 days
  const now = new Date();
  const last7 = tips.filter(t => {
    const d = new Date(t.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });
  const prior7 = tips.filter(t => {
    const d = new Date(t.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 14;
  });
  const last7Total = last7.reduce((s, t) => s + t.amount, 0);
  const prior7Total = prior7.reduce((s, t) => s + t.amount, 0);
  const velocityChange = prior7Total > 0 ? Math.round(((last7Total - prior7Total) / prior7Total) * 100) : 0;

  // Workplace comparison
  const wpStats: Record<string, { total: number; count: number }> = {};
  tips.forEach(t => {
    if (!wpStats[t.workplace]) wpStats[t.workplace] = { total: 0, count: 0 };
    wpStats[t.workplace].total += t.amount;
    wpStats[t.workplace].count++;
  });
  const wpEntries = Object.entries(wpStats).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count));

  // Consistency score — how many of the last 14 days had tips logged
  const daySet = new Set<string>();
  tips.forEach(t => {
    const d = new Date(t.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 14) daySet.add(t.date);
  });
  const consistency = Math.round((daySet.size / 14) * 100);

  // Streak
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (tips.some(t => t.date === dateStr)) streak++;
    else break;
  }

  return (
    <GlassCard className="animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4" style={{ color: '#64D2FF' }} />
        <h3 className="text-[15px] font-semibold text-foreground">Advanced Analytics</h3>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.15)' }}>
          <p className="text-[11px] text-muted-foreground mb-1">Earning Velocity</p>
          <div className="flex items-center gap-1">
            <span className="text-[18px] font-semibold text-foreground">{velocityChange >= 0 ? '+' : ''}{velocityChange}%</span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: velocityChange >= 0 ? '#30D158' : '#FF453A', transform: velocityChange < 0 ? 'rotate(90deg)' : undefined }} />
          </div>
          <p className="text-[10px] text-muted-foreground">vs prior week</p>
        </div>

        <div className="p-3 rounded-xl" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
          <p className="text-[11px] text-muted-foreground mb-1">Logging Streak</p>
          <span className="text-[18px] font-semibold text-foreground">{streak} day{streak !== 1 ? 's' : ''}</span>
          <p className="text-[10px] text-muted-foreground">🔥 Keep it up!</p>
        </div>

        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.15)' }}>
          <p className="text-[11px] text-muted-foreground mb-1">Consistency</p>
          <span className="text-[18px] font-semibold text-foreground">{consistency}%</span>
          <p className="text-[10px] text-muted-foreground">last 14 days</p>
        </div>

        <div className="p-3 rounded-xl" style={{ background: 'rgba(94,92,230,0.08)', border: '1px solid rgba(94,92,230,0.15)' }}>
          <p className="text-[11px] text-muted-foreground mb-1">Avg per Entry</p>
          <span className="text-[18px] font-semibold text-foreground">${tips.length > 0 ? (tips.reduce((s, t) => s + t.amount, 0) / tips.length).toFixed(0) : '0'}</span>
          <p className="text-[10px] text-muted-foreground">{tips.length} entries total</p>
        </div>
      </div>

      {/* Workplace comparison */}
      {wpEntries.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-muted-foreground mb-2">WORKPLACE COMPARISON</p>
          {wpEntries.map(([name, stats]) => {
            const avg = stats.total / stats.count;
            const maxAvg = wpEntries[0][1].total / wpEntries[0][1].count;
            const pct = maxAvg > 0 ? Math.round((avg / maxAvg) * 100) : 0;
            return (
              <div key={name} className="flex items-center gap-3 py-2">
                <span className="text-[13px] text-foreground w-24 truncate">{name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#0A84FF' }} />
                </div>
                <span className="text-[12px] font-medium text-foreground w-14 text-right">${avg.toFixed(0)}/avg</span>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
