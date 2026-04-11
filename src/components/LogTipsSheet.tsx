import { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { useTips } from '@/hooks/use-tips';
import { useSubscription } from '@/hooks/use-subscription';
import { useSettings } from '@/hooks/use-settings';
import { TipLimitBanner } from './TipLimitBanner';
import { WorkplaceSheet } from './WorkplaceSheet';

const FREE_TIP_LIMIT = 30;

interface LogTipsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function LogTipsSheet({ open, onClose }: LogTipsSheetProps) {
  const { addTip, monthTipCount } = useTips();
  const { isPro } = useSubscription();
  const { workplaces, addWorkplace, removeWorkplace } = useSettings();
  const [amount, setAmount] = useState('0');
  const [mode, setMode] = useState<'total' | 'cash' | 'card'>('total');
  const [shift, setShift] = useState<'morning' | 'afternoon' | 'evening'>('evening');
  const [workplace, setWorkplace] = useState(workplaces[0] || 'Main Job');
  const [notes, setNotes] = useState('');
  const [wpSheetOpen, setWpSheetOpen] = useState(false);

  if (!open) return null;

  const atLimit = !isPro && monthTipCount >= FREE_TIP_LIMIT;

  const handleKey = (key: string) => {
    if (key === 'del') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.');
    } else {
      setAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleSave = () => {
    if (atLimit) return;
    const val = parseFloat(amount) || 0;
    if (val <= 0) return;
    const cashAmount = mode === 'cash' ? val : mode === 'total' ? val * 0.4 : 0;
    const cardAmount = mode === 'card' ? val : mode === 'total' ? val * 0.6 : 0;
    const totalAmount = mode === 'total' ? val : cashAmount + cardAmount;

    addTip({
      amount: totalAmount,
      cashAmount: mode === 'total' ? val * 0.4 : cashAmount,
      cardAmount: mode === 'total' ? val * 0.6 : cardAmount,
      shift,
      workplace,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    });

    setAmount('0');
    setNotes('');
    onClose();
  };

  const modes = ['total', 'cash', 'card'] as const;
  const shifts = ['morning', 'afternoon', 'evening'] as const;
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','del'];

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="relative w-full max-w-[430px] glass-sheet animate-slide-up"
          style={{ maxHeight: '92vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </div>

          <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 20px)' }}>
            <div className="flex items-center justify-between mb-2">
              <button onClick={onClose} className="text-muted-foreground text-sm">Cancel</button>
              <div className="text-center">
                <h2 className="text-[17px] font-semibold text-foreground">Log Tips</h2>
                <p className="text-[13px] text-muted-foreground">{dateStr}</p>
              </div>
              <div className="w-12" />
            </div>

            {/* Tip limit warning */}
            {!isPro && <TipLimitBanner used={monthTipCount} limit={FREE_TIP_LIMIT} />}

            <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.10)' }}>
              {modes.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-[10px] text-sm font-medium text-foreground capitalize transition-all"
                  style={{ background: mode === m ? 'rgba(255,255,255,0.20)' : 'transparent' }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="text-center mb-4">
              <span className="text-[28px] font-light text-muted-foreground">$</span>
              <span className="text-[56px] font-extralight text-foreground tracking-tight">{amount}</span>
            </div>

            <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.10)' }}>
              {shifts.map(s => (
                <button
                  key={s}
                  onClick={() => setShift(s)}
                  className="flex-1 py-2 rounded-[10px] text-xs font-medium text-foreground capitalize transition-all"
                  style={{ background: shift === s ? 'rgba(255,255,255,0.20)' : 'transparent' }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Workplace selector */}
            <button
              onClick={() => setWpSheetOpen(true)}
              className="w-full flex items-center justify-between px-4 h-[50px] rounded-2xl mb-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <span className="text-sm text-muted-foreground">Workplace</span>
              <span className="text-sm text-foreground">{workplace} ›</span>
            </button>

            {/* Notes field */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Add a note (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 h-[50px] rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              />
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {keys.map(key => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`glass-numpad-key flex items-center justify-center h-14 text-xl text-foreground font-normal ${key === '0' ? 'col-span-2' : ''}`}
                  style={key === 'del' ? { background: 'rgba(255,255,255,0.08)' } : undefined}
                >
                  {key === 'del' ? <Delete className="w-5 h-5" /> : key}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="btn-ios-blue w-full h-[54px] text-[17px] font-semibold"
              style={atLimit ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
            >
              {atLimit ? 'Tip Limit Reached' : 'Save Tips'}
            </button>
          </div>
        </div>
      </div>

      <WorkplaceSheet
        open={wpSheetOpen}
        onClose={() => setWpSheetOpen(false)}
        workplaces={workplaces}
        selected={workplace}
        onSelect={setWorkplace}
        onAdd={addWorkplace}
        onRemove={removeWorkplace}
      />
    </>
  );
}
