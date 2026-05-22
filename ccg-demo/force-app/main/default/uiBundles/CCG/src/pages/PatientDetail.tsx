import { useParams, Link } from 'react-router';
import { useState } from 'react';
import {
  Calendar,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  FileText,
  MessageSquareWarning,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import {
  getPatient,
  sarahAppointments,
  sarahNotes,
  sarahMessages,
  sarahBilling,
  sarahPhq9,
  SALESFORCE_INSTANCE_URL,
} from '../data/demoData';
import { StatusPill } from './Home';

const TABS = [
  'Info',
  'To-Do',
  'Schedule',
  'Documents',
  'Billing',
  'Billing Settings',
  'Clinicians',
  'Portal',
  'Messages',
  'Insights',
] as const;

type Tab = (typeof TABS)[number];

export default function PatientDetail() {
  const { slug } = useParams();
  const patient = getPatient(slug || '');
  const [tab, setTab] = useState<Tab>('Insights');

  if (!patient) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Patient not found</h1>
        <Link to="/patients" className="text-[var(--ccg-primary)] text-sm">
          ← Back to patients
        </Link>
      </div>
    );
  }

  const nextAppt = patient.nextAppointment
    ? new Date(patient.nextAppointment).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="flex flex-col">
      {/* Patient header */}
      <div className="bg-white border-b border-[var(--ccg-border)] px-8 py-5">
        <div className="flex items-start gap-5 max-w-[1400px] mx-auto">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold shrink-0"
            style={{ backgroundColor: 'var(--ccg-primary)' }}
          >
            {patient.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--ccg-text)]">
                <span className="text-[var(--ccg-text-muted)] text-base font-normal">
                  Patient:{' '}
                </span>
                {patient.name}
              </h1>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  patient.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {patient.status}
              </span>
              {patient.riskLevel === 'Medium' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                  <AlertTriangle size={10} /> Medium risk
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-[var(--ccg-text-muted)]">
              <div>
                DOB {patient.dob} · Age {patient.age}
              </div>
              <div>{patient.pronouns}</div>
              <div>{patient.paymentType}</div>
              <div>Primary: {patient.primaryClinician}</div>
            </div>
          </div>
          <div className="text-right shrink-0 flex flex-col items-end gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--ccg-text-muted)]">
                Next appointment
              </div>
              <div className="text-sm font-medium text-[var(--ccg-text)] flex items-center gap-1 justify-end mt-1">
                <Calendar size={13} className="text-[var(--ccg-primary)]" /> {nextAppt}
              </div>
              <button className="mt-1 text-xs text-[var(--ccg-primary)] hover:underline">
                Schedule new session
              </button>
            </div>
            {patient.salesforceContactId && (
              <a
                href={`${SALESFORCE_INSTANCE_URL}/lightning/r/Contact/${patient.salesforceContactId}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[10px] text-[var(--ccg-text-muted)] hover:text-[var(--ccg-primary)] border border-[var(--ccg-border)] hover:border-[var(--ccg-primary)] rounded-md px-2 py-1 transition-colors"
                title={`Salesforce Contact ID: ${patient.salesforceContactId}`}
              >
                <Database size={10} />
                <span className="font-mono">{patient.salesforceContactId}</span>
                <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto mt-5 flex gap-0 border-b border-[var(--ccg-border)] -mb-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors relative ${
                tab === t
                  ? 'border-[var(--ccg-primary)] text-[var(--ccg-primary)]'
                  : 'border-transparent text-[var(--ccg-text-muted)] hover:text-[var(--ccg-text)]'
              }`}
            >
              {t}
              {t === 'Insights' && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] bg-gradient-to-r from-indigo-500 to-teal-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  <Sparkles size={8} /> AI
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {tab === 'Insights' && <InsightsTab patientName={patient.preferredName || patient.name} />}
        {tab === 'Info' && <InfoTab />}
        {tab === 'Schedule' && <ScheduleTab />}
        {tab === 'Documents' && <DocumentsTab />}
        {tab === 'Billing' && <BillingTab />}
        {tab === 'Messages' && <MessagesTab />}
        {tab === 'Portal' && <PortalTab />}
        {(tab === 'To-Do' || tab === 'Clinicians' || tab === 'Billing Settings') && (
          <EmptyTab name={tab} />
        )}
      </div>
    </div>
  );
}

function InsightsTab({ patientName }: { patientName: string }) {
  const cards: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accent: string;
    tag: string;
    title: string;
    body: string;
    chart?: React.ReactNode;
    primaryAction: string;
    secondaryAction?: string;
    notePreview?: { date: string; title: string; body: string };
  }[] = [
    {
      icon: FileText,
      accent: '#6366f1',
      tag: 'AI-drafted note',
      title: 'Progress note from 5/5 ready to review',
      body: 'Drafted from session transcript and your prior notes pattern. Hover to preview.',
      primaryAction: 'Review & sign',
      secondaryAction: 'Edit draft',
      notePreview: {
        date: 'May 5, 2026 · Progress note · Dr. Emily Chen',
        title: 'Session 14 — work stress, sleep disruption',
        body: 'Patient presented in tearful, fatigued state at start of session. Reports increased anxiety following team restructure announced 4/30 — now reports to a new manager she describes as "cold and exacting." Sleep latency 60+ minutes 4 nights this week; multiple wake-ups described.\n\nPHQ-9 administered: score 16 (up from 11 on 4/21). Largest movers: anhedonia (3) and sleep (3). Denies SI/HI. No change in appetite or substance use.\n\nWe reviewed cognitive reframing techniques from sessions 10-12 and discussed reintroducing the evening wind-down protocol. Patient agreed to 30 min screen-free wind-down nightly and to track sleep latency in the portal.\n\nPlan: weekly individual therapy continues. Will reassess PHQ-9 in 2 weeks. Consider medication management referral if symptoms persist.',
      },
    },
    {
      icon: AlertTriangle,
      accent: '#f59f00',
      tag: 'Churn risk',
      title: 'Missed 2 of her last 4 sessions',
      body: 'Missed sessions correlate with reported work stress in May. Consider reaching out before her next session on Tue 5/26.',
      primaryAction: 'Draft outreach',
      secondaryAction: 'View attendance',
    },
    {
      icon: TrendingDown,
      accent: '#d6336c',
      tag: 'Clinical signal',
      title: 'PHQ-9 jumped 11 → 16 on 5/5',
      body: 'Largest movers: anhedonia and sleep items. Consider treatment plan review.',
      chart: <MiniSpark points={sarahPhq9.map(p => p.score)} />,
      primaryAction: 'Open treatment plan',
    },
    {
      icon: MessageSquareWarning,
      accent: '#0a9396',
      tag: 'Engagement',
      title: 'Last portal login was 18 days ago',
      body: 'No between-session mood check-ins since 5/3. Suggest the weekly check-in template.',
      primaryAction: 'Send check-in',
    },
  ];

  return (
    <div className="space-y-5">
      <div
        className="flex items-center gap-2 mb-1 ccg-fade-up"
        style={{ animationDelay: '0ms' }}
      >
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center ccg-ai-pulse">
          <Sparkles size={14} className="text-white ccg-sparkle-in" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--ccg-text)]">
            Agentforce insights for {patientName}
          </h2>
          <p className="text-xs text-[var(--ccg-text-muted)]">
            From {patientName}'s sessions, portal activity, and billing · refreshed 2m ago
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <div
            key={c.tag}
            className="ccg-fade-up"
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <InsightCard {...c} />
          </div>
        ))}
      </div>

      <div
        className="bg-gradient-to-r from-indigo-50 via-white to-teal-50 border border-[var(--ccg-border)] rounded-lg p-3 flex items-center gap-3 ccg-fade-up"
        style={{ animationDelay: `${120 + cards.length * 90}ms` }}
      >
        <Sparkles size={14} className="text-indigo-600 shrink-0" />
        <p className="text-xs text-[var(--ccg-text-muted)]">
          Ask <span className="font-semibold text-[var(--ccg-text)]">CCG Copilot</span> a
          question about {patientName} — click the chat in the lower right.
        </p>
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  accent,
  tag,
  title,
  body,
  primaryAction,
  secondaryAction,
  chart,
  notePreview,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  tag: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction?: string;
  chart?: React.ReactNode;
  notePreview?: { date: string; title: string; body: string };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative bg-white border border-[var(--ccg-border)] rounded-lg p-4 hover:shadow-sm hover:border-[var(--ccg-border-strong)] transition-all group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {tag}
            </span>
            {notePreview && (
              <span className="text-[9px] text-[var(--ccg-text-muted)] italic">
                hover to preview
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-[var(--ccg-text)] leading-snug">
            {title}
          </h3>
          <p className="text-xs text-[var(--ccg-text-muted)] leading-relaxed mt-1">
            {body}
          </p>
          {chart && <div className="mt-3 -mb-1">{chart}</div>}
          <div className="flex items-center gap-3 mt-3">
            <button
              className="text-xs font-medium px-2.5 py-1 rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: accent }}
            >
              {primaryAction}
            </button>
            {secondaryAction && (
              <button className="text-xs text-[var(--ccg-text-muted)] hover:text-[var(--ccg-text)]">
                {secondaryAction}
              </button>
            )}
          </div>
        </div>
      </div>

      {notePreview && hovered && (
        <div className="mt-4 pt-4 border-t border-[var(--ccg-border)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shrink-0">
              <Sparkles size={10} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-wider font-semibold text-indigo-600">
                AI draft · not yet signed
              </div>
              <div className="text-[10px] text-[var(--ccg-text-muted)] truncate">
                {notePreview.date}
              </div>
            </div>
          </div>
          <h4 className="text-xs font-semibold text-[var(--ccg-text)] mb-2">
            {notePreview.title}
          </h4>
          <div className="text-[11px] text-[var(--ccg-text)] leading-relaxed whitespace-pre-line max-h-[240px] overflow-y-auto pr-1 bg-gray-50/60 rounded-md p-3 border border-[var(--ccg-border)]">
            {notePreview.body}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[var(--ccg-primary)] text-white hover:bg-[var(--ccg-primary-hover)] flex items-center gap-1">
              <Check size={10} /> Sign as-is
            </button>
            <button className="text-[11px] text-[var(--ccg-text-muted)] hover:text-[var(--ccg-text)] flex items-center gap-1">
              <ArrowRight size={10} /> Edit before signing
            </button>
            <button className="text-[11px] text-[var(--ccg-text-muted)] hover:text-[var(--ccg-text)] flex items-center gap-1 ml-auto">
              <X size={10} /> Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniSpark({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 240;
  const h = 50;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h + 16}`}
      className="text-[var(--ccg-primary)]"
    >
      <defs>
        <linearGradient id="phqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6336c" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d6336c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#phqGrad)" />
      <path
        d={d}
        fill="none"
        stroke="#d6336c"
        strokeWidth="2"
        className="ccg-draw-line"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={i * step}
            cy={h - ((p - min) / range) * h}
            r="3"
            fill="#d6336c"
          />
          <text
            x={i * step}
            y={h + 12}
            textAnchor="middle"
            fontSize="9"
            fill="#6b7280"
          >
            {p}
          </text>
        </g>
      ))}
    </svg>
  );
}

function InfoTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card title="Demographics">
        <Row label="Legal name" value="Sarah Elizabeth Mitchell" />
        <Row label="Preferred name" value="Sarah" />
        <Row label="DOB" value="March 14, 1991" />
        <Row label="Pronouns" value="she/her" />
        <Row label="Gender" value="Female" />
        <Row label="Marital status" value="Single" />
      </Card>
      <Card title="Contact">
        <Row label="Phone" value="(212) 555-0142" />
        <Row label="Email" value="sarah.mitchell@example.com" />
        <Row label="Address" value="142 W 78th St, New York, NY 10024" />
        <Row label="Emergency contact" value="Karen Mitchell (mother) · (212) 555-0188" />
      </Card>
      <Card title="Clinical">
        <Row label="Primary diagnosis" value="GAD (F41.1)" />
        <Row label="Secondary" value="MDD, recurrent (F33.1)" />
        <Row label="Treatment modality" value="CBT, weekly" />
        <Row label="Risk level" value="Medium" />
        <Row label="Primary clinician" value="Dr. Emily Chen" />
        <Row label="Care team" value="Dr. Patel (psychiatry, ext.)" />
      </Card>
      <Card title="Payment">
        <Row label="Type" value="Cash-pay" />
        <Row label="Session rate" value="$175" />
        <Row label="Card on file" value="Visa ···· 4421" />
        <Row label="Outstanding balance" value="$250" highlight />
      </Card>
    </div>
  );
}

function ScheduleTab() {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
      <div className="px-5 py-4 border-b border-[var(--ccg-border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold">Appointment history</h3>
        <button className="text-xs text-[var(--ccg-primary)] hover:underline">
          + Schedule new
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-[var(--ccg-text-muted)]">
          <tr className="text-left">
            <th className="px-5 py-2 font-medium">Date</th>
            <th className="px-5 py-2 font-medium">Type</th>
            <th className="px-5 py-2 font-medium">Clinician</th>
            <th className="px-5 py-2 font-medium">Location</th>
            <th className="px-5 py-2 font-medium">Status</th>
            <th className="px-5 py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sarahAppointments.map(a => (
            <tr key={a.id} className="border-t border-[var(--ccg-border)]">
              <td className="px-5 py-3">
                {new Date(a.start).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-5 py-3 text-[var(--ccg-text-muted)]">{a.type}</td>
              <td className="px-5 py-3 text-[var(--ccg-text-muted)]">{a.clinician}</td>
              <td className="px-5 py-3 text-[var(--ccg-text-muted)]">{a.location}</td>
              <td className="px-5 py-3">
                <StatusPill status={a.status} />
              </td>
              <td className="px-5 py-3 text-xs text-[var(--ccg-text-muted)]">
                {a.notesStatus === 'AI Drafted' ? (
                  <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                    <Sparkles size={11} /> AI Drafted
                  </span>
                ) : (
                  a.notesStatus || '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
      <div className="px-5 py-4 border-b border-[var(--ccg-border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold">Session notes & documents</h3>
        <button className="text-xs text-[var(--ccg-primary)] hover:underline">
          + New note
        </button>
      </div>
      <div className="divide-y divide-[var(--ccg-border)]">
        {sarahNotes.map(n => (
          <div key={n.id} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-[var(--ccg-text)]">{n.type}</span>
              <span className="text-xs text-[var(--ccg-text-muted)]">
                · {n.date} · {n.clinician}
              </span>
              <span
                className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  n.status === 'Signed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : n.status === 'AI Drafted'
                      ? 'bg-indigo-50 text-indigo-700 inline-flex items-center gap-1'
                      : 'bg-amber-50 text-amber-700'
                }`}
              >
                {n.status === 'AI Drafted' && <Sparkles size={9} />}
                {n.status}
              </span>
            </div>
            <p className="text-xs text-[var(--ccg-text-muted)] leading-relaxed">
              {n.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingTab() {
  const total = sarahBilling
    .filter(b => b.status === 'Outstanding')
    .reduce((s, b) => s + b.amount, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Outstanding balance" value={`$${total}`} accent="var(--ccg-danger)" />
        <Stat label="Paid this year" value="$2,975" />
        <Stat label="Sessions YTD" value="17" />
      </div>
      <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-[var(--ccg-text-muted)]">
            <tr className="text-left">
              <th className="px-5 py-2 font-medium">Date</th>
              <th className="px-5 py-2 font-medium">Description</th>
              <th className="px-5 py-2 font-medium text-right">Amount</th>
              <th className="px-5 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sarahBilling.map(b => (
              <tr key={b.id} className="border-t border-[var(--ccg-border)]">
                <td className="px-5 py-3">{b.date}</td>
                <td className="px-5 py-3 text-[var(--ccg-text-muted)]">{b.description}</td>
                <td className="px-5 py-3 text-right">${b.amount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      b.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesTab() {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
      <div className="px-5 py-4 border-b border-[var(--ccg-border)]">
        <h3 className="text-sm font-semibold">Messages with Sarah</h3>
      </div>
      <div className="divide-y divide-[var(--ccg-border)]">
        {sarahMessages.map(m => (
          <div key={m.id} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-[var(--ccg-primary)]" />}
              <span className="text-xs font-medium">{m.patientName}</span>
              <span className="text-[10px] text-[var(--ccg-text-muted)]">
                · {new Date(m.timestamp).toLocaleString()}
              </span>
              <span className="ml-auto text-[10px] text-[var(--ccg-text-muted)]">
                {m.channel}
              </span>
            </div>
            <p className="text-sm text-[var(--ccg-text-muted)]">{m.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalTab() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Portal activity">
        <Row label="Account status" value="Active" />
        <Row label="Last login" value="May 3, 2026 · 9:24 AM" />
        <Row label="Logins (30d)" value="2 (down from 6)" />
        <Row label="Mood check-ins" value="0 in last 14 days" />
      </Card>
      <Card title="Portal forms">
        <Row label="Intake forms" value="Complete" />
        <Row label="Consent" value="Signed 2/10/2026" />
        <Row label="Treatment plan agreement" value="Signed 3/12/2026" />
        <Row label="HIPAA" value="Signed 2/10/2026" />
      </Card>
      <div className="col-span-2">
        <Link
          to="/portal-preview"
          className="inline-flex items-center gap-1 text-xs text-[var(--ccg-primary)] hover:underline"
        >
          Preview what Sarah sees in her portal <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function EmptyTab({ name }: { name: string }) {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl p-12 text-center text-sm text-[var(--ccg-text-muted)]">
      {name} content lives here in production. Stubbed for demo focus.
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
      <div className="px-5 py-3 border-b border-[var(--ccg-border)]">
        <h3 className="text-sm font-semibold text-[var(--ccg-text)]">{title}</h3>
      </div>
      <div className="px-5 py-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline text-xs py-1">
      <span className="text-[var(--ccg-text-muted)]">{label}</span>
      <span
        className={`text-right ${
          highlight ? 'text-[var(--ccg-danger)] font-semibold' : 'text-[var(--ccg-text)]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-[var(--ccg-border)] rounded-xl p-5">
      <div className="text-xs text-[var(--ccg-text-muted)] mb-1">{label}</div>
      <div
        className="text-2xl font-semibold"
        style={{ color: accent || 'var(--ccg-text)' }}
      >
        {value}
      </div>
    </div>
  );
}
