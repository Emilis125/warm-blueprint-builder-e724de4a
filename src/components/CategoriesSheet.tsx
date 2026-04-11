import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

interface CategoriesSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CategoriesSheet({ open, onClose }: CategoriesSheetProps) {
  const { categories, addCategory, removeCategory } = useSettings();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  if (!open) return null;

  const handleAdd = () => {
    const name = newName.trim();
    if (name && !categories.includes(name)) {
      addCategory(name);
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
          <h2 className="text-[20px] font-bold text-foreground">Custom Categories</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          {categories.map((cat, i) => (
            <div
              key={cat}
              className="flex items-center gap-3 px-5 py-4"
              style={i < categories.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.10)' } : undefined}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: '#0A84FF' }} />
              <span className="flex-1 text-[15px] text-foreground">{cat}</span>
              <button onClick={() => removeCategory(cat)} className="p-1">
                <Trash2 className="w-4 h-4" style={{ color: '#FF453A' }} />
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Category name"
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
            <Plus className="w-4 h-4" /> Add Category
          </button>
        )}
      </div>
    </div>
  );
}
