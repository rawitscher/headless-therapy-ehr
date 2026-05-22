import { FileText, MessageSquareWarning, DollarSign, Sparkles } from 'lucide-react';

const items = [
  {
    icon: FileText,
    title: 'Sign 3 pending session notes',
    sub: 'James Okafor (5/21), Sarah Mitchell (5/5, AI-drafted), David Kim (5/15)',
    accent: '#6366f1',
  },
  {
    icon: MessageSquareWarning,
    title: 'Reply to Sarah Mitchell',
    sub: 'Apology for missed Tuesday session · sent 8:14 AM',
    accent: '#0a9396',
  },
  {
    icon: DollarSign,
    title: 'Review 2 outstanding invoices',
    sub: 'Total $250 across 2 patients',
    accent: '#2f9e44',
  },
];

export default function ToDo() {
  return (
    <div className="p-8 max-w-[900px] mx-auto">
      <h1 className="text-2xl font-semibold mb-1">To-Do</h1>
      <p className="text-sm text-[var(--ccg-text-muted)] mb-6">
        3 items waiting · prioritized by Agentforce
      </p>
      <div className="space-y-3">
        {items.map(it => {
          const Icon = it.icon;
          return (
            <div
              key={it.title}
              className="bg-white border border-[var(--ccg-border)] rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${it.accent}18`, color: it.accent }}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--ccg-text)]">
                  {it.title}
                </div>
                <div className="text-xs text-[var(--ccg-text-muted)] mt-0.5">{it.sub}</div>
              </div>
              <button className="text-xs text-[var(--ccg-primary)] hover:underline">
                Open
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-gradient-to-r from-indigo-50 via-white to-teal-50 border border-[var(--ccg-border)] rounded-xl p-4 flex items-center gap-3">
        <Sparkles size={16} className="text-indigo-600" />
        <p className="text-xs text-[var(--ccg-text-muted)]">
          Nice! You're all caught up after these.
        </p>
      </div>
    </div>
  );
}
