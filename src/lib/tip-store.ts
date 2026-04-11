// Simple in-memory tip store (will be replaced with DB later)
export interface TipEntry {
  id: string;
  amount: number;
  cashAmount: number;
  cardAmount: number;
  shift: 'morning' | 'afternoon' | 'evening';
  workplace: string;
  date: string; // ISO date string
  createdAt: string;
}

// Demo data for the current week
const today = new Date();
const getDateStr = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

let tips: TipEntry[] = [
  { id: '1', amount: 95, cashAmount: 40, cardAmount: 55, shift: 'evening', workplace: 'Main Job', date: getDateStr(6), createdAt: getDateStr(6) },
  { id: '2', amount: 112, cashAmount: 48, cardAmount: 64, shift: 'evening', workplace: 'Main Job', date: getDateStr(5), createdAt: getDateStr(5) },
  { id: '3', amount: 78, cashAmount: 30, cardAmount: 48, shift: 'afternoon', workplace: 'Main Job', date: getDateStr(4), createdAt: getDateStr(4) },
  { id: '4', amount: 145, cashAmount: 60, cardAmount: 85, shift: 'evening', workplace: 'Main Job', date: getDateStr(3), createdAt: getDateStr(3) },
  { id: '5', amount: 88, cashAmount: 35, cardAmount: 53, shift: 'evening', workplace: 'Main Job', date: getDateStr(2), createdAt: getDateStr(2) },
  { id: '6', amount: 109.50, cashAmount: 52, cardAmount: 57.50, shift: 'evening', workplace: 'Main Job', date: getDateStr(1), createdAt: getDateStr(1) },
  { id: '7', amount: 127.50, cashAmount: 52, cardAmount: 75.50, shift: 'evening', workplace: 'Main Job', date: getDateStr(0), createdAt: getDateStr(0) },
];

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => { listeners = listeners.filter(l => l !== listener); };
}

export function getTips() { return tips; }

export function addTip(entry: Omit<TipEntry, 'id' | 'createdAt'>) {
  tips = [...tips, { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
  notify();
}

export function getTodayTips() {
  const todayStr = new Date().toISOString().split('T')[0];
  return tips.filter(t => t.date === todayStr);
}

export function getYesterdayTips() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yStr = d.toISOString().split('T')[0];
  return tips.filter(t => t.date === yStr);
}

export function getWeekTips() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  start.setHours(0, 0, 0, 0);
  return tips.filter(t => new Date(t.date) >= start);
}

export function getMonthTips() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  return tips.filter(t => t.date >= startOfMonth);
}

export function getYearTips(year?: number) {
  const y = year || new Date().getFullYear();
  return tips.filter(t => t.date.startsWith(String(y)));
}

export function getDailyTotals(days: number) {
  const result: { date: string; total: number; day: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTips = tips.filter(t => t.date === dateStr);
    const total = dayTips.reduce((sum, t) => sum + t.amount, 0);
    result.push({ date: dateStr, total, day: dayNames[d.getDay()] });
  }
  return result;
}
