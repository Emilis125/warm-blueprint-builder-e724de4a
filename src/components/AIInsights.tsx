import { useState } from 'react';
import { Crown, Brain, TrendingUp, DollarSign, Clock, Lightbulb, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { GlassCard } from './GlassCard';
import { supabase } from '@/integrations/supabase/client';
import type { TipEntry } from '@/hooks/use-tips';

interface AIInsightsProps {
  tips: TipEntry[];
  weekTotal: number;
  monthTotal: number;
  isPremium: boolean;
}

const iconMap: Record<string, typeof Brain> = {
  earning: TrendingUp,
  shift: Clock,
  projection: DollarSign,
  tax: Lightbulb,
};

const colorMap: Record<string, string> = {
  earning: '#30D158',
  shift: '#5E5CE6',
  projection: '#0A84FF',
  tax: '#FF9F0A',
};

export function AIInsights({ tips, weekTotal, monthTotal, isPremium }: AIInsightsProps) {
  const [insights, setInsights] = useState<{ title: string; body: string; type: string }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPremium) {
    return (
      <Link to="/pricing" className="block">
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-4 h-4" style={{ color: '#BF5AF2' }} />
              AI-Powered Insights
            </h3>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A' }}>
              <Crown className="w-3 h-3" /> PREMIUM
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Get personalized earning strategies, shift optimization tips, and income projections powered by AI analysis of your data.
          </p>
        </GlassCard>
      </Link>
    );
  }

  const fetchInsights = async () => {
    if (tips.length < 3) {
      setInsights([{ title: 'Log more tips', body: 'Add at least 3 entries to unlock AI-powered insights about your earning patterns.', type: 'earning' }]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-insights', {
        body: { tips: tips.slice(0, 50) }, // Send last 50 tips max
      });
      if (fnError) throw fnError;
      setInsights(data?.insights || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load insights');
      // Fallback to algorithmic insights
      setInsights(generateFallbackInsights(tips, weekTotal, monthTotal));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on first render if no insights yet
  if (!insights && !loading && !error) {
    fetchInsights();
  }

  return (
    <GlassCard className="animate-fade-in-up stagger-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: '#BF5AF2' }} />
          <h3 className="text-[15px] font-semibold text-foreground">AI Insights</h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>

      {loading && !insights ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-[13px] text-muted-foreground">Analyzing your tips...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {(insights || []).map((insight, i) => {
            const Icon = iconMap[insight.type] || Lightbulb;
            const color = colorMap[insight.type] || '#FF9F0A';
            return (
              <div key={i} className="p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed pl-6">{insight.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

// Fallback algorithmic insights when AI is unavailable
function generateFallbackInsights(tips: TipEntry[], weekTotal: number, monthTotal: number) {
  const insights: { title: string; body: string; type: string }[] = [];
  
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
    insights.push({ title: `${bestDay[0]}s are your best day`, body: `You earn an average of $${avg.toFixed(0)} on ${bestDay[0]}s. Try to pick up more shifts on this day.`, type: 'earning' });
  }

  if (tips.length >= 5) {
    const recentAvg = tips.slice(0, 7).reduce((s, t) => s + t.amount, 0) / 7;
    insights.push({ title: `Monthly projection: $${(recentAvg * 30).toFixed(0)}`, body: `Based on your recent trend, you're on track for $${(recentAvg * 30).toFixed(0)} this month.`, type: 'projection' });
  }

  const totalCash = tips.reduce((s, t) => s + t.cashAmount, 0);
  const totalAll = tips.reduce((s, t) => s + t.amount, 0);
  const cashPct = Math.round((totalCash / totalAll) * 100);
  insights.push({ title: cashPct > 50 ? 'Cash-heavy earner' : 'Card tips dominate', body: `${cashPct}% of your tips are cash. Remember to report all cash tips for IRS compliance.`, type: 'tax' });

  return insights;
}
