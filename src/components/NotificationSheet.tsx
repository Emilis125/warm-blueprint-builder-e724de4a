import { useState } from 'react';
import { X, Clock } from 'lucide-react';

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
}

const timeOptions = [
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM',
];

export function NotificationSheet({ open, onClose }: NotificationSheetProps) {
  const [enabled, setEnabled] = useState(true);
  const [selectedTime, setSelectedTime] = useState('11:00 PM');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[430px] glass-sheet animate-slide-up px-5 pt-4 pb-8" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.30)' }} />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-bold text-foreground">Notifications</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Enable/disable */}
        <div className="flex items-center justify-between px-5 py-4 mb-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div>
            <p className="text-[15px] font-medium text-foreground">Daily Reminder</p>
            <p className="text-[12px] text-muted-foreground">"Don't forget to log your tips"</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className="w-12 h-7 rounded-full transition-all relative"
            style={{ background: enabled ? '#30D158' : 'rgba(255,255,255,0.15)' }}
          >
            <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all" style={{ left: enabled ? '22px' : '2px' }} />
          </button>
        </div>

        {enabled && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground">Remind me at</span>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              {timeOptions.map((time, i) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="w-full flex items-center justify-between px-5 py-3.5"
                  style={i < timeOptions.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.08)' } : undefined}
                >
                  <span className="text-[15px] text-foreground">{time}</span>
                  {selectedTime === time && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#0A84FF' }}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full h-[48px] mt-5 rounded-2xl text-[15px] font-semibold"
          style={{ background: '#0A84FF', color: 'white' }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
