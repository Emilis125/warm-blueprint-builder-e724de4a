import { useState } from 'react';
import { Crown, Brain, TrendingUp, DollarSign, Clock, Lightbulb, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SubscriptionSheet } from './SubscriptionSheet';
import type { TipEntry } from '@/lib/tip-store';

interface AIInsightsProps {
  tips: TipEntry[];
  weekTotal: number;
  monthTotal: number;
  isPremium: boolean;
}

function generateInsights(tips: TipEntry[], weekTotal: number, monthTotal: number) {
  if (tips.length < 3) {
    return [{ icon: Lightbulb, title: 'Log more tips', body: 'Add at least 3 entries to unlock personalized AI insights about your earning patterns.', color: '#FF9F0A' }];
  }

  const insights: { icon: typeof Brain; title: string; body: string; color: string }[] = [];

  // Best day of week analysis
  const dayTotals: Record<string, { total: number; count: number }> = {};
  tips.forEach(t => {
    const day = new Date(t.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    if (!dayTotals[day]) dayTotals[day] = { total: 0, count: 0 };
    dayTotals[day].total += t.amount;
    dayTotals[day].count++;
  });
  const bestDay = Object.entries(dayTotals).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))[0];
  if (bestDay) {
    const avg = bestDay[1].total / bestDay[1].count;
    insights.push({
      icon: TrendingUp,
      title: `${bestDay[0]}s are your goldmine`,
      body: `You earn an average of $${avg.toFixed(0)} on ${bestDay[0]}s — ${Math.round((avg / (monthTotal / Math.max(tips.length, 1))) * 100 - 100)}% above your overall average. Try picking up extra ${bestDay[0]} shifts.`,
      color: '#30D158',
    });
  }

  // Shift optimization
  const shiftStats: Record<string, { total: number; count: number }> = {};
  tips.forEach(t => {
    if (!shiftStats[t.shift]) shiftStats[t.shift] = { total: 0, count: 0 };
    shiftStats[t.shift].total += t.amount;
    shiftStats[t.shift].count++;
  });
  const shiftEntries = Object.entries(shiftStats).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count));
  if (shiftEntries.length > 1) {
    const top = shiftEntries[0];
    const bottom = shiftEntries[shiftEntries.length - 1];
    const topAvg = top[1].total / top[1].count;
    const bottomAvg = bottom[1].total / bottom[1].count;
    const diff = topAvg - bottomAvg;
    if (diff > 5) {
      insights.push({
        icon: Clock,
        title: `${top[0].charAt(0).toUpperCase() + top[0].slice(1)} shifts pay $${diff.toFixed(0)} more`,
        body: `Your ${top[0]} shifts average $${topAvg.toFixed(0)} vs $${bottomAvg.toFixed(0)} for ${bottom[0]}. Prioritizing ${top[0]} shifts could boost your monthly income by $${(diff * 4).toFixed(0)}+.`,
        color: '#5E5CE6',
      });
    }
  }

  // Earnings projection
  if (tips.length >= 5) {
    const recentTips = tips.slice(-7);
    const dailyAvg = recentTips.reduce((s, t) => s + t.amount, 0) / 7;
    const projectedMonth = dailyAvg * 30;
    insights.push({
      icon: DollarSign,
      title: `Monthly projection: $${projectedMonth.toFixed(0)}`,
      body: `Based on your recent 7-day trend of $${(dailyAvg * 7).toFixed(0)}/week, you're on track to earn $${projectedMonth.toFixed(0)} this month. ${projectedMonth > monthTotal ? 'Great momentum! 📈' : 'Keep pushing! 💪'}`,
      color: '#0A84FF',
    });
  }

  // Cash vs card trend
  const totalCash = tips.reduce((s, t) => s + t.cashAmount, 0);
  const totalCard = tips.reduce((s, t) => s + t.cardAmount, 0);
  const cashPct = Math.round((totalCash / (totalCash + totalCard)) * 100);
  insights.push({
    icon: Lightbulb,
    title: cashPct > 50 ? 'Cash-heavy earner' : 'Card tips dominate',
    body: cashPct > 50
      ? `${cashPct}% of your tips are cash. Remember to report all cash tips for tax compliance — the IRS requires reporting tips over $20/month.`
      : `${100 - cashPct}% of your tips come via card. These are auto-reported by your employer, making tax filing easier.`,
    color: '#FF9F0A',
  });

  return insights.slice(0, 4);
}

export function AIInsights({ tips, weekTotal, monthTotal, isPremium }: AIInsightsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isPremium) {
    return (
      <>
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-4 h-4" style={{ color: '#BF5AF2' }} />
              AI-Powered Insights
            </h3>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A' }}
            >
              <Crown className="w-3 h-3" /> PREMIUM
            </button>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Get personalized earning strategies, shift optimization tips, and income projections powered by AI analysis of your data.
          </p>
        </GlassCard>
        <SubscriptionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </>
    );
  }

  const insights = generateInsights(tips, weekTotal, monthTotal);

  return (
    <GlassCard className="animate-fade-in-up stagger-4" key={refreshKey}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: '#BF5AF2' }} />
          <h3 className="text-[15px] font-semibold text-foreground">AI Insights</h3>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="p-3 rounded-xl" style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}15` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <insight.icon className="w-4 h-4 shrink-0" style={{ color: insight.color }} />
              <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed pl-6">{insight.body}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
