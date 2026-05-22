import { Link } from 'react-router';
import {
  Calendar,
  MessageSquare,
  CheckSquare,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  History,
} from 'lucide-react';
import {
  currentUser,
  weekAppointments,
  inboxMessages,
  patients,
} from '../data/demoData';

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export default function Home() {
  // Today is May 22, 2026 per demo
  const today = weekAppointments.filter(a => a.start.startsWith('2026-05-22'));
  const completedToday = today.filter(a => a.status === 'Completed').length;
  const remainingToday = today.filter(a => a.status !== 'Completed').length;
  const unreadCount = inboxMessages.filter(m => m.unread).length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--ccg-text)]">
          Good morning, Dr. {currentUser.name.split(' ').slice(-1)[0]}
        </h1>
        <p className="text-sm text-[var(--ccg-text-muted)] mt-1">
          Friday, May 22, 2026 · You have {today.length} sessions today
        </p>
      </div>

      {/* Continue where you left off + AI nudge */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Continue card */}
        <Link
          to="/patients/sarah-mitchell"
          className="lg:col-span-2 group relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--ccg-primary)] to-[#1f6280] text-white p-5 hover:shadow-lg transition-shadow"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/70 font-semibold mb-2">
              <History size={11} /> Continue where you left off
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-base font-semibold border border-white/20">
                SM
              </div>
              <div>
                <div className="text-base font-semibold">Sarah Mitchell</div>
                <div className="text-xs text-white/80">
                  Patient 360 · last viewed 11 minutes ago
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/90 group-hover:text-white">
              Open Patient 360
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>

        {/* AI proactive banner */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-xl border border-[var(--ccg-border)] bg-gradient-to-r from-indigo-50 via-white to-teal-50">
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-teal-500" />
          <div className="flex items-start gap-4 p-5 pl-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shrink-0 ccg-ai-pulse">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Agentforce
                </span>
                <span className="text-xs text-[var(--ccg-text-muted)]">·</span>
                <span className="text-xs text-[var(--ccg-text-muted)]">
                  3 patients need attention before your next session
                </span>
              </div>
              <p className="text-sm text-[var(--ccg-text)]">
                <span className="font-medium">Sarah Mitchell</span> missed her last 2 sessions
                and PHQ-9 jumped from 11 → 16. Consider a check-in before next Tuesday.
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  to="/patients/sarah-mitchell"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ccg-primary)] hover:underline"
                >
                  Open Sarah's Patient 360 <ArrowRight size={12} />
                </Link>
                <button className="text-xs text-[var(--ccg-text-muted)] hover:text-[var(--ccg-text)]">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Calendar}
          label="Today's sessions"
          value={today.length}
          sub={`${completedToday} done · ${remainingToday} upcoming`}
          accent="var(--ccg-primary)"
        />
        <KpiCard
          icon={MessageSquare}
          label="Unread messages"
          value={unreadCount}
          sub="2 flagged urgent"
          accent="var(--ccg-accent)"
        />
        <KpiCard
          icon={CheckSquare}
          label="Notes pending"
          value={3}
          sub="1 AI-drafted, ready to review"
          accent="#6366f1"
        />
        <KpiCard
          icon={TrendingUp}
          label="Caseload"
          value={patients.filter(p => p.primaryClinician === currentUser.name).length}
          sub="active patients this month"
          accent="var(--ccg-success)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today schedule */}
        <div className="lg:col-span-2 bg-white border border-[var(--ccg-border)] rounded-xl">
          <div className="px-5 py-4 border-b border-[var(--ccg-border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ccg-text)]">Today's schedule</h2>
            <Link to="/scheduling" className="text-xs text-[var(--ccg-primary)] hover:underline">
              View week →
            </Link>
          </div>
          <div className="divide-y divide-[var(--ccg-border)]">
            {today.length === 0 && (
              <div className="p-6 text-center text-sm text-[var(--ccg-text-muted)]">
                No sessions today.
              </div>
            )}
            {today.map(appt => (
              <Link
                key={appt.id}
                to={`/patients/${slugFor(appt.patientName)}`}
                className="flex items-center gap-4 p-4 hover:bg-[var(--ccg-primary-soft)] transition-colors"
              >
                <div className="w-16 text-xs text-[var(--ccg-text-muted)] shrink-0">
                  <div className="font-semibold text-[var(--ccg-text)]">
                    {formatTime(appt.start)}
                  </div>
                  <div>{appt.durationMin} min</div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                  style={{ backgroundColor: 'var(--ccg-primary)' }}
                >
                  {initialsFor(appt.patientName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--ccg-text)]">
                    {appt.patientName}
                  </div>
                  <div className="text-xs text-[var(--ccg-text-muted)]">
                    {appt.type} · {appt.location}
                  </div>
                </div>
                <StatusPill status={appt.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
            <div className="px-5 py-4 border-b border-[var(--ccg-border)] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--ccg-text)]">Recent messages</h2>
              <Link to="/messages" className="text-xs text-[var(--ccg-primary)] hover:underline">
                Inbox →
              </Link>
            </div>
            <div className="divide-y divide-[var(--ccg-border)]">
              {inboxMessages.slice(0, 4).map(m => (
                <div key={m.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    {m.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ccg-primary)]" />
                    )}
                    <span className="text-xs font-medium text-[var(--ccg-text)]">
                      {m.patientName}
                    </span>
                    <span className="ml-auto text-[10px] text-[var(--ccg-text-muted)]">
                      <Clock size={10} className="inline mr-1" />
                      {new Date(m.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--ccg-text-muted)] truncate">
                    {m.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
            <div className="px-5 py-4 border-b border-[var(--ccg-border)] flex items-center gap-2">
              <AlertTriangle size={14} className="text-[var(--ccg-warning)]" />
              <h2 className="text-sm font-semibold text-[var(--ccg-text)]">
                Caseload alerts
              </h2>
            </div>
            <div className="divide-y divide-[var(--ccg-border)] text-xs">
              <div className="px-5 py-3">
                <div className="font-medium text-[var(--ccg-text)]">Sarah Mitchell</div>
                <div className="text-[var(--ccg-text-muted)]">
                  2 no-shows in last 4 sessions · PHQ-9 trending up
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="font-medium text-[var(--ccg-text)]">David Kim</div>
                <div className="text-[var(--ccg-text-muted)]">
                  Outstanding invoice 14d overdue
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="font-medium text-[var(--ccg-text)]">Elena Rivera</div>
                <div className="text-[var(--ccg-text-muted)]">
                  Intake today at 1:00 PM · new patient
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-[var(--ccg-text-muted)]">{label}</span>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon size={14} />
        </div>
      </div>
      <div className="text-2xl font-semibold text-[var(--ccg-text)]">{value}</div>
      <div className="text-xs text-[var(--ccg-text-muted)] mt-1">{sub}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Completed: { bg: '#dcfce7', color: '#15803d' },
    Confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
    Scheduled: { bg: '#f3f4f6', color: '#374151' },
    'No-show': { bg: '#fee2e2', color: '#b91c1c' },
    Cancelled: { bg: '#fef3c7', color: '#92400e' },
  };
  const c = map[status] || map.Scheduled;
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {status}
    </span>
  );
}

function initialsFor(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('');
}

function slugFor(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
