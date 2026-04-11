interface DayData {
  day: string;
  total: number;
  date: string;
}

export function WeekChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map(d => d.total), 1);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="glass p-5 animate-fade-in-up stagger-3">
      <h3 className="text-[17px] font-semibold text-foreground mb-4">This Week</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d) => {
          const height = (d.total / max) * 100;
          const isToday = d.date === today;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[11px] text-foreground font-medium">
                {d.total > 0 ? `$${Math.round(d.total)}` : ''}
              </span>
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${Math.max(height * 0.8, 4)}px`,
                    background: isToday ? '#0A84FF' : 'rgba(10, 132, 255, 0.35)',
                    boxShadow: isToday ? '0 0 16px rgba(10,132,255,0.60)' : 'none',
                  }}
                />
              </div>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
