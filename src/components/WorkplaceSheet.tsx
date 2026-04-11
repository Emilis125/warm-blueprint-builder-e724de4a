import { useState } from 'react';
import { X, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

interface WorkplaceSheetProps {
  open: boolean;
  onClose: () => void;
  workplaces: string[];
  selected: string;
  onSelect: (wp: string) => void;
  onAdd: (wp: string) => void;
  onRemove: (wp: string) => void;
}

export function WorkplaceSheet({ open, onClose, workplaces, selected, onSelect, onAdd, onRemove }: WorkplaceSheetProps) {
  const { isPro } = useSubscription();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  if (!open) return null;

  const handleAdd = () => {
    const name = newName.trim();
    if (name && !workplaces.includes(name)) {
      onAdd(name);
      setNewName('');
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[430px] glass-sheet animate-slide-up px-5 pt-4 pb-8" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.30)' }} />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-bold text-foreground">Workplaces</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          {workplaces.map((wp, i) => (
            <button
              key={wp}
              onClick={() => { onSelect(wp); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-4"
              style={i < workplaces.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.10)' } : undefined}
            >
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selected === wp ? '#0A84FF' : 'rgba(255,255,255,0.25)' }}>
                {selected === wp && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0A84FF' }} />}
              </div>
              <span className="flex-1 text-left text-[15px] text-foreground">{wp}</span>
              {isPro && workplaces.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(wp); }} className="p-1">
                  <Trash2 className="w-4 h-4" style={{ color: '#FF453A' }} />
                </button>
              )}
            </button>
          ))}
        </div>

        {isPro && (
          adding ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Workplace name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
                className="flex-1 px-4 h-[48px] rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <button onClick={handleAdd} className="px-4 h-[48px] rounded-xl text-sm font-semibold" style={{ background: '#0A84FF', color: 'white' }}>
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl text-[14px] font-medium"
              style={{ background: 'rgba(10,132,255,0.12)', color: '#0A84FF', border: '1px dashed rgba(10,132,255,0.30)' }}
            >
              <Plus className="w-4 h-4" /> Add Workplace
            </button>
          )
        )}

        {!isPro && (
          <p className="text-[12px] text-muted-foreground text-center mt-2">Upgrade to Pro to add multiple workplaces</p>
        )}
      </div>
    </div>
  );
}
