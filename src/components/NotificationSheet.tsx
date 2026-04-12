import { useState, useEffect } from 'react';
import { X, Clock, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
}

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      options.push(value);
    }
  }
  return options;
}

function formatTime24to12(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hour12}:${mStr} ${ampm}`;
}

const allTimes = generateTimeOptions();

export function NotificationSheet({ open, onClose }: NotificationSheetProps) {
  const { prefs, loading, permissionState, savePreferences } = useNotifications();
  const [enabled, setEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('21:00');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      setEnabled(prefs.enabled);
      setSelectedTime(prefs.reminder_time);
    }
  }, [loading, prefs]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    await savePreferences({
      enabled,
      reminder_time: selectedTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setSaving(false);
    onClose();
  };

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

        {permissionState === 'denied' && (
          <div className="px-4 py-3 mb-4 rounded-2xl" style={{ background: 'rgba(255,59,48,0.15)', border: '1px solid rgba(255,59,48,0.3)' }}>
            <p className="text-[13px] text-red-400">
              Notifications are blocked in your browser. Please enable them in your browser settings to receive reminders.
            </p>
          </div>
        )}

        {/* Enable/disable */}
        <div className="flex items-center justify-between px-5 py-4 mb-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div>
            <p className="text-[15px] font-medium text-foreground">Daily Reminder</p>
            <p className="text-[12px] text-muted-foreground">"Don't forget to log your tips"</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            disabled={permissionState === 'denied'}
            className="w-12 h-7 rounded-full transition-all relative"
            style={{ background: enabled ? '#30D158' : 'rgba(255,255,255,0.15)', opacity: permissionState === 'denied' ? 0.5 : 1 }}
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
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', maxHeight: '240px', overflowY: 'auto' }}>
              {allTimes.map((time, i) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="w-full flex items-center justify-between px-5 py-3.5"
                  style={i < allTimes.length - 1 ? { borderBottom: '0.5px solid rgba(255,255,255,0.08)' } : undefined}
                >
                  <span className="text-[15px] text-foreground">{formatTime24to12(time)}</span>
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
          onClick={handleSave}
          disabled={saving}
          className="w-full h-[48px] mt-5 rounded-2xl text-[15px] font-semibold"
          style={{ background: '#0A84FF', color: 'white', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
