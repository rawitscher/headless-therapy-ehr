import { inboxMessages } from '../data/demoData';

export default function Messages() {
  return (
    <div className="p-8 max-w-[1100px] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <div className="bg-white border border-[var(--ccg-border)] rounded-xl divide-y divide-[var(--ccg-border)]">
        {inboxMessages.map(m => (
          <div key={m.id} className="px-5 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              {m.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ccg-primary)]" />
              )}
              <span className="text-sm font-medium text-[var(--ccg-text)]">
                {m.patientName}
              </span>
              <span className="text-[10px] text-[var(--ccg-text-muted)]">· {m.channel}</span>
              <span className="ml-auto text-[10px] text-[var(--ccg-text-muted)]">
                {new Date(m.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-[var(--ccg-text-muted)]">{m.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
