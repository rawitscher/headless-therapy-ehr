import {
  FileText,
  Users,
  Zap,
  Mail,
  Search as SearchIcon,
  X,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const oldTools = [
  { name: 'TherapyNotes', sub: 'EHR · clinical notes', icon: FileText, color: '#0ea5e9' },
  { name: 'TherapyFlow', sub: 'CRM · intake & leads', icon: Users, color: '#6366f1' },
  { name: 'Zapier', sub: 'Automation glue · brittle', icon: Zap, color: '#f59e0b' },
  { name: 'Mailchimp', sub: 'Email campaigns', icon: Mail, color: '#facc15' },
  { name: 'Google Ads', sub: 'Lead acquisition', icon: SearchIcon, color: '#22c55e' },
];

const newPillars = [
  {
    name: 'Health or Sales Cloud',
    sub: 'Patient 360 · clinical data model',
    color: '#2c7da0',
  },
  {
    name: 'Service Cloud',
    sub: 'Intake pipeline · provider inbox',
    color: '#0a9396',
  },
  {
    name: 'Flow + Data Cloud',
    sub: 'Native automation · single source of truth',
    color: '#6366f1',
  },
  {
    name: 'Marketing Cloud',
    sub: 'Email · SMS · campaign attribution',
    color: '#d6336c',
  },
  {
    name: 'Agentforce',
    sub: 'Provider copilot · intake agent',
    color: '#7c3aed',
  },
];

export default function Consolidation() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="text-xs text-[var(--ccg-text-muted)] mb-1">
        Tech stack overview · the close
      </div>
      <h1 className="text-2xl font-semibold mb-1">5 tools → 1 platform</h1>
      <p className="text-sm text-[var(--ccg-text-muted)] mb-8">
        What CCG runs today vs. what runs on Salesforce
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Before */}
        <div className="bg-white border border-[var(--ccg-border)] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-amber-400" />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-red-600">
              Today
            </span>
            <h2 className="text-base font-semibold">5 disconnected tools</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {oldTools.map(t => {
              const Icon = t.icon;
              return (
                <div
                  key={t.name}
                  className="border border-[var(--ccg-border)] rounded-lg p-3 flex items-start gap-2 relative"
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${t.color}20`, color: t.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--ccg-text)]">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-[var(--ccg-text-muted)]">{t.sub}</div>
                  </div>
                  {t.name === 'Zapier' && (
                    <span className="absolute top-1 right-1 text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                      BROKEN
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--ccg-border)] grid grid-cols-3 gap-3 text-center">
            <Stat label="Logins/day" value="5" red />
            <Stat label="Data silos" value="5" red />
            <Stat label="Patient 360" value="No" red />
          </div>
        </div>

        {/* After */}
        <div className="bg-white border border-[var(--ccg-primary)]/40 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-teal-500" />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ccg-primary)]">
              With Salesforce
            </span>
            <h2 className="text-base font-semibold">1 unified platform</h2>
          </div>
          <div className="space-y-2">
            {newPillars.map(p => (
              <div
                key={p.name}
                className="border border-[var(--ccg-border)] rounded-lg p-3 flex items-center gap-3"
              >
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-[var(--ccg-text)]">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[var(--ccg-text-muted)]">{p.sub}</div>
                </div>
                <Check size={14} className="text-[var(--ccg-success)]" />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--ccg-border)] grid grid-cols-3 gap-3 text-center">
            <Stat label="Logins/day" value="1" green />
            <Stat label="Data silos" value="0" green />
            <Stat label="Patient 360" value="Yes" green />
          </div>
        </div>
      </div>

      {/* Zapier → Flow win */}
      <div className="bg-white border border-[var(--ccg-border)] rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-indigo-600" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600">
            One automation win
          </span>
          <h2 className="text-base font-semibold">
            The broken Zapier reminder, rebuilt as a Salesforce Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50/40">
            <div className="flex items-center gap-2 mb-2">
              <X size={14} className="text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                Today: Zapier "Appointment Reminder"
              </span>
            </div>
            <ul className="text-xs text-[var(--ccg-text-muted)] space-y-1 list-disc pl-5">
              <li>Polls TherapyNotes every 15 min — frequently misses sync</li>
              <li>Sends via Mailchimp — failed silently since 5/12</li>
              <li>No record of what was sent (or wasn't) back in TherapyNotes</li>
              <li>Costs $39/mo, 4 hours/month of admin troubleshooting</li>
            </ul>
          </div>

          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/40">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Tomorrow: CCG "Appointment Reminder · 24h before"
              </span>
            </div>
            <ul className="text-xs text-[var(--ccg-text-muted)] space-y-1 list-disc pl-5">
              <li>Schedule-triggered Flow runs natively on the patient record</li>
              <li>Sends via Marketing Cloud (email + SMS), logs delivery</li>
              <li>Updates the appointment record with reminder status</li>
              <li>No third-party glue, no monthly fee, no silent failures</li>
            </ul>
          </div>
        </div>

        {/* Flow Builder mock */}
        <div className="mt-5 border border-[var(--ccg-border)] rounded-lg p-5 bg-gray-50/60">
          <div className="text-[10px] uppercase tracking-wider text-[var(--ccg-text-muted)] mb-3">
            Flow Builder · Appointment Reminder
          </div>
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
            <FlowNode label="Start" sub="Scheduled · 24h before Appt" color="#2c7da0" />
            <Arrow />
            <FlowNode label="Get patient" sub="Person Account" color="#6366f1" />
            <Arrow />
            <FlowNode label="Decision" sub="Telehealth?" color="#f59e0b" />
            <Arrow />
            <FlowNode label="Send email" sub="Marketing Cloud" color="#0a9396" />
            <Arrow />
            <FlowNode label="Send SMS" sub="If cell on file" color="#0a9396" />
            <Arrow />
            <FlowNode label="Update record" sub="Reminder Sent ✓" color="#2f9e44" />
          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-teal-50 border border-[var(--ccg-border)] rounded-xl p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[var(--ccg-text)]">
            You don't have to give up the UI you love to get the platform you need.
          </div>
          <div className="text-xs text-[var(--ccg-text-muted)] mt-0.5">
            Same provider experience. One source of truth. Agentforce on top.
          </div>
        </div>
        <ArrowRight size={16} className="text-[var(--ccg-primary)]" />
      </div>
    </div>
  );
}

function FlowNode({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div
      className="bg-white border-2 rounded-lg px-3 py-2 shrink-0 min-w-[120px]"
      style={{ borderColor: color }}
    >
      <div className="text-[11px] font-semibold text-[var(--ccg-text)]">{label}</div>
      <div className="text-[9px] text-[var(--ccg-text-muted)]">{sub}</div>
    </div>
  );
}

function Arrow() {
  return <ArrowRight size={14} className="text-[var(--ccg-text-muted)] shrink-0" />;
}

function Stat({
  label,
  value,
  red,
  green,
}: {
  label: string;
  value: string;
  red?: boolean;
  green?: boolean;
}) {
  return (
    <div>
      <div
        className={`text-xl font-semibold ${
          red ? 'text-red-600' : green ? 'text-emerald-600' : 'text-[var(--ccg-text)]'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--ccg-text-muted)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
