import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Delete } from 'lucide-react';
import { TabBar } from '@/components/TabBar';
import { useTips } from '@/hooks/use-tips';

export const Route = createFileRoute('/log')({
  component: LogPage,
});

function LogPage() {
  const { addTip } = useTips();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('0');
  const [mode, setMode] = useState<'total' | 'cash' | 'card'>('total');
  const [shift, setShift] = useState<'morning' | 'afternoon' | 'evening'>('evening');

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
    const val = parseFloat(amount) || 0;
    if (val <= 0) return;
    addTip({
      amount: val,
      cashAmount: mode === 'cash' ? val : mode === 'total' ? val * 0.4 : 0,
      cardAmount: mode === 'card' ? val : mode === 'total' ? val * 0.6 : 0,
      shift,
      workplace: 'Main Job',
      date: new Date().toISOString().split('T')[0],
    });
    navigate({ to: '/' });
  };

  const modes = ['total', 'cash', 'card'] as const;
  const shifts = ['morning', 'afternoon', 'evening'] as const;
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','del'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      <div className="text-center mb-2">
        <h1 className="text-[17px] font-semibold text-foreground">Log Tips</h1>
        <p className="text-[13px] text-muted-foreground">{today}</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.10)' }}>
        {modes.map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="flex-1 py-2 rounded-[10px] text-sm font-medium text-foreground capitalize transition-all"
            style={{ background: mode === m ? 'rgba(255,255,255,0.20)' : 'transparent' }}>
            {m}
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <span className="text-[28px] font-light text-muted-foreground">$</span>
        <span className="text-[56px] font-extralight text-foreground tracking-tight">{amount}</span>
      </div>

      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.10)' }}>
        {shifts.map(s => (
          <button key={s} onClick={() => setShift(s)}
            className="flex-1 py-2 rounded-[10px] text-xs font-medium text-foreground capitalize transition-all"
            style={{ background: shift === s ? 'rgba(255,255,255,0.20)' : 'transparent' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {keys.map(key => (
          <button key={key} onClick={() => handleKey(key)}
            className={`glass-numpad-key flex items-center justify-center h-16 text-2xl text-foreground font-normal ${key === '0' ? 'col-span-2' : ''}`}>
            {key === 'del' ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
      </div>

      <button onClick={handleSave} className="btn-ios-blue w-full h-[54px] text-[17px] font-semibold">
        Save Tips
      </button>

      <TabBar />
    </div>
  );
}
