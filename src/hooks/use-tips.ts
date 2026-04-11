import { useState, useEffect, useCallback } from 'react';
import { subscribe, getTips, addTip, getTodayTips, getYesterdayTips, getWeekTips, getMonthTips, getYearTips, getDailyTotals, type TipEntry } from '@/lib/tip-store';

export function useTips() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    return subscribe(() => setVersion(v => v + 1));
  }, []);

  const todayTips = getTodayTips();
  const yesterdayTips = getYesterdayTips();
  const todayTotal = todayTips.reduce((s, t) => s + t.amount, 0);
  const yesterdayTotal = yesterdayTips.reduce((s, t) => s + t.amount, 0);
  const todayCash = todayTips.reduce((s, t) => s + t.cashAmount, 0);
  const todayCard = todayTips.reduce((s, t) => s + t.cardAmount, 0);
  const diff = todayTotal - yesterdayTotal;

  const weekTips = getWeekTips();
  const weekTotal = weekTips.reduce((s, t) => s + t.amount, 0);
  const monthTips = getMonthTips();
  const monthTotal = monthTips.reduce((s, t) => s + t.amount, 0);

  return {
    allTips: getTips(),
    todayTotal,
    yesterdayTotal,
    todayCash,
    todayCard,
    diff,
    weekTotal,
    weekTips,
    monthTotal,
    monthTips,
    yearTips: getYearTips(),
    dailyTotals: getDailyTotals(7),
    addTip: useCallback((entry: Omit<TipEntry, 'id' | 'createdAt'>) => addTip(entry), []),
  };
}
