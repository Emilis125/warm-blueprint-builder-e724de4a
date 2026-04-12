import { useState } from 'react';
import { Crown, Target, Pencil, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { GlassCard } from './GlassCard';

interface GoalTrackerProps {
  weekTotal: number;
  monthTotal: number;
  isPro: boolean;
  weeklyGoal: number;
  monthlyGoal: number;
  onSetWeeklyGoal: (val: number) => void;
  onSetMonthlyGoal: (val: number) => void;
}

export function GoalTracker({ weekTotal, monthTotal, isPro, weeklyGoal, monthlyGoal, onSetWeeklyGoal, onSetMonthlyGoal }: GoalTrackerProps) {
  const [editingWeekly, setEditingWeekly] = useState(false);
  const [editingMonthly, setEditingMonthly] = useState(false);
  const [weekInput, setWeekInput] = useState(String(weeklyGoal));
  const [monthInput, setMonthInput] = useState(String(monthlyGoal));

  const weekPct = Math.min((weekTotal / weeklyGoal) * 100, 100);
  const monthPct = Math.min((monthTotal / monthlyGoal) * 100, 100);

  if (!isPro) {
    return (
      <Link to="/pricing" search={{ plan: 'pro' }} className="block">
        <GlassCard className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: '#0A84FF' }} />
              Goal Tracking
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
          <p className="text-[13px] text-muted-foreground">Set weekly and monthly income goals to track your progress. Upgrade to Pro to unlock.</p>
        </GlassCard>
      </Link>
    );
  }

  const saveWeekly = () => {
    const val = parseFloat(weekInput);
    if (val > 0) onSetWeeklyGoal(val);
    setEditingWeekly(false);
  };

  const saveMonthly = () => {
    const val = parseFloat(monthInput);
    if (val > 0) onSetMonthlyGoal(val);
    setEditingMonthly(false);
  };

  return (
    <GlassCard className="animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4" style={{ color: '#0A84FF' }} />
        <h3 className="text-[15px] font-semibold text-foreground">Goals</h3>
      </div>

      {/* Weekly goal */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-muted-foreground">Weekly Goal</span>
          <div className="flex items-center gap-1.5">
            {editingWeekly ? (
              <>
                <input
                  type="number"
                  value={weekInput}
                  onChange={(e) => setWeekInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveWeekly()}
                  autoFocus
                  className="w-20 text-right text-[13px] font-medium text-foreground bg-transparent outline-none border-b"
                  style={{ borderColor: '#0A84FF' }}
                />
                <button onClick={saveWeekly}><Check className="w-3.5 h-3.5" style={{ color: '#30D158' }} /></button>
              </>
            ) : (
              <>
                <span className="text-[13px] font-medium text-foreground">${weekTotal.toFixed(0)} / ${weeklyGoal}</span>
                <button onClick={() => { setWeekInput(String(weeklyGoal)); setEditingWeekly(true); }}>
                  <Pencil className="w-3 h-3 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all" style={{
            width: `${weekPct}%`,
            background: weekPct >= 100 ? '#30D158' : '#0A84FF',
            boxShadow: weekPct >= 100 ? '0 0 12px rgba(48,209,88,0.50)' : '0 0 12px rgba(10,132,255,0.40)',
          }} />
        </div>
        {weekPct >= 100 && <p className="text-[11px] mt-1 font-medium" style={{ color: '#30D158' }}>🎉 Goal reached!</p>}
      </div>

      {/* Monthly goal */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-muted-foreground">Monthly Goal</span>
          <div className="flex items-center gap-1.5">
            {editingMonthly ? (
              <>
                <input
                  type="number"
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveMonthly()}
                  autoFocus
                  className="w-20 text-right text-[13px] font-medium text-foreground bg-transparent outline-none border-b"
                  style={{ borderColor: '#5E5CE6' }}
                />
                <button onClick={saveMonthly}><Check className="w-3.5 h-3.5" style={{ color: '#30D158' }} /></button>
              </>
            ) : (
              <>
                <span className="text-[13px] font-medium text-foreground">${monthTotal.toFixed(0)} / ${monthlyGoal}</span>
                <button onClick={() => { setMonthInput(String(monthlyGoal)); setEditingMonthly(true); }}>
                  <Pencil className="w-3 h-3 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all" style={{
            width: `${monthPct}%`,
            background: monthPct >= 100 ? '#30D158' : '#5E5CE6',
            boxShadow: monthPct >= 100 ? '0 0 12px rgba(48,209,88,0.50)' : '0 0 12px rgba(94,92,230,0.40)',
          }} />
        </div>
        {monthPct >= 100 && <p className="text-[11px] mt-1 font-medium" style={{ color: '#30D158' }}>🎉 Goal reached!</p>}
      </div>
    </GlassCard>
  );
}
