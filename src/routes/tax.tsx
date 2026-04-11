import { createFileRoute } from '@tanstack/react-router';
import { GlassCard } from '@/components/GlassCard';
import { TabBar } from '@/components/TabBar';
import { useTips } from '@/hooks/use-tips';
import { FileText, Table } from 'lucide-react';

export const Route = createFileRoute('/tax')({
  component: TaxPage,
  head: () => ({
    meta: [
      { title: 'TipTracker Pro — Tax Export' },
      { name: 'description', content: 'Export IRS-ready tax reports for your tip income.' },
    ],
  }),
});

function TaxPage() {
  const { yearTips } = useTips();
  const year = new Date().getFullYear();
  const total = yearTips.reduce((s, t) => s + t.amount, 0);
  const cash = yearTips.reduce((s, t) => s + t.cashAmount, 0);
  const card = yearTips.reduce((s, t) => s + t.cardAmount, 0);
  const shifts = yearTips.length;

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
        <h1 className="text-[34px] font-bold text-foreground">Tax Export</h1>
        <span className="success-pill px-3 py-1 text-[13px] font-medium">IRS-Ready</span>
      </div>

      {/* Year summary */}
      <GlassCard className="mb-5 animate-fade-in-up stagger-1">
        <h2 className="text-[22px] font-semibold text-foreground">{year} Tax Summary</h2>
        <p className="text-[13px] text-muted-foreground mb-4">Jan 1 – Dec 31, {year}</p>
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.12)' }} />
        {[
          { label: 'Total Reported Tips', value: `$${total.toFixed(2)}` },
          { label: 'Cash Tips', value: `$${cash.toFixed(2)}` },
          { label: 'Card Tips', value: `$${card.toFixed(2)}` },
          { label: 'Total Shifts', value: String(shifts) },
        ].map((row, i) => (
          <div key={row.label} className="flex items-center justify-between py-3" style={i < 3 ? { borderBottom: '0.5px solid rgba(255,255,255,0.12)' } : undefined}>
            <span className="text-[15px] text-muted-foreground">{row.label}</span>
            <span className="text-[15px] font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* Export format */}
      <div className="mb-3 animate-fade-in-up stagger-2">
        <h3 className="text-[15px] font-semibold text-foreground mb-3">Export Format</h3>
      </div>

      <GlassCard className="mb-3 !p-0 animate-fade-in-up stagger-2">
        <button className="w-full flex items-center gap-4 px-5 py-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.20)' }}>
            <FileText className="w-5 h-5" style={{ color: '#FF453A' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-medium text-foreground">PDF Report</p>
            <p className="text-[13px] text-muted-foreground">Print-ready, IRS format</p>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.20)' }}>
            <Table className="w-5 h-5" style={{ color: '#30D158' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-medium text-foreground">CSV Spreadsheet</p>
            <p className="text-[13px] text-muted-foreground">For accountants</p>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
      </GlassCard>

      <TabBar />
    </div>
  );
}
