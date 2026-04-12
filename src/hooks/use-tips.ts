import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useCallback } from 'react';
import { useSubscription } from './use-subscription';

export interface TipEntry {
  id: string;
  amount: number;
  cashAmount: number;
  cardAmount: number;
  shift: 'morning' | 'afternoon' | 'evening';
  workplace: string;
  date: string;
  notes?: string;
  createdAt: string;
}

function mapRow(row: any): TipEntry {
  return {
    id: row.id,
    amount: Number(row.amount),
    cashAmount: Number(row.cash_amount),
    cardAmount: Number(row.card_amount),
    shift: row.shift,
    workplace: row.workplace,
    date: row.date,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  };
}

export function useTips() {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const queryClient = useQueryClient();

  const { data: allTipsRaw = [] } = useQuery({
    queryKey: ['tips', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
    enabled: !!user,
  });

  // Free users: 30-day history restriction
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffStr = thirtyDaysAgo.toISOString().split('T')[0];

  const allTips = isPro ? allTipsRaw : allTipsRaw.filter(t => t.date >= cutoffStr);
  const hasHiddenTips = !isPro && allTipsRaw.length > allTips.length;

  const addTipMutation = useMutation({
    mutationFn: async (entry: Omit<TipEntry, 'id' | 'createdAt'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('tips').insert({
        user_id: user.id,
        amount: entry.amount,
        cash_amount: entry.cashAmount,
        card_amount: entry.cardAmount,
        shift: entry.shift,
        workplace: entry.workplace,
        date: entry.date,
        notes: entry.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    },
  });

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const todayTips = allTips.filter(t => t.date === todayStr);
  const yesterdayTips = allTips.filter(t => t.date === yesterdayStr);
  const todayTotal = todayTips.reduce((s, t) => s + t.amount, 0);
  const yesterdayTotal = yesterdayTips.reduce((s, t) => s + t.amount, 0);
  const todayCash = todayTips.reduce((s, t) => s + t.cashAmount, 0);
  const todayCard = todayTips.reduce((s, t) => s + t.cardAmount, 0);

  // Week tips (Mon-Sun)
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  weekStart.setHours(0, 0, 0, 0);
  const weekTips = allTips.filter(t => new Date(t.date) >= weekStart);
  const weekTotal = weekTips.reduce((s, t) => s + t.amount, 0);

  // Month tips
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthTips = allTips.filter(t => t.date >= startOfMonth);
  const monthTotal = monthTips.reduce((s, t) => s + t.amount, 0);

  // Year tips
  const yearTips = allTips.filter(t => t.date.startsWith(String(now.getFullYear())));

  // Daily totals for chart
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyTotals = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayTips = allTips.filter(t => t.date === dateStr);
    const total = dayTips.reduce((sum, t) => sum + t.amount, 0);
    return { date: dateStr, total, day: dayNames[d.getDay()] };
  });

  // Best day & shift
  const byDate: Record<string, number> = {};
  weekTips.forEach(t => { byDate[t.date] = (byDate[t.date] || 0) + t.amount; });
  let bestDate = '', bestTotal = 0;
  for (const [date, total] of Object.entries(byDate)) {
    if (total > bestTotal) { bestDate = date; bestTotal = total; }
  }

  const byShift: Record<string, number> = {};
  weekTips.forEach(t => { byShift[t.shift] = (byShift[t.shift] || 0) + t.amount; });
  let bestShiftName = 'evening', bestShiftTotal = 0;
  for (const [shift, total] of Object.entries(byShift)) {
    if (total > bestShiftTotal) { bestShiftName = shift; bestShiftTotal = total; }
  }

  // Month tip count uses raw data (for limit tracking, not history restriction)
  const monthTipCountRaw = allTipsRaw.filter(t => t.date >= startOfMonth).length;

  return {
    allTips,
    todayTotal,
    yesterdayTotal,
    todayCash,
    todayCard,
    diff: todayTotal - yesterdayTotal,
    weekTotal,
    weekTips,
    monthTotal,
    monthTips,
    monthTipCount: monthTipCountRaw,
    yearTips,
    dailyTotals,
    bestDay: { date: bestDate, total: bestTotal },
    bestShift: { shift: bestShiftName, total: bestShiftTotal },
    addTip: useCallback((entry: Omit<TipEntry, 'id' | 'createdAt'>) => addTipMutation.mutate(entry), [addTipMutation]),
    hasHiddenTips,
  };
}
