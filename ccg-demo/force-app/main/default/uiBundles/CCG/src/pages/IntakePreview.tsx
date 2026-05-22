import { Sparkles, ArrowRight } from 'lucide-react';
import { intakeLeads } from '../data/demoData';

const stages: { id: 'New' | 'Outreach' | 'Scheduled' | 'Converted'; label: string }[] = [
  { id: 'New', label: 'New requests' },
  { id: 'Outreach', label: 'In outreach' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Converted', label: 'Converted' },
];

export default function IntakePreview() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="text-xs text-[var(--ccg-text-muted)] mb-1">
        Lauren's view · same Salesforce platform, intake coordinator role
      </div>
      <h1 className="text-2xl font-semibold mb-1">Intake pipeline</h1>
      <p className="text-sm text-[var(--ccg-text-muted)] mb-6">
        New patient requests · AI-matched to clinicians by specialty, modality, and availability
      </p>

      <div className="grid grid-cols-4 gap-4">
        {stages.map(s => {
          const leads = intakeLeads.filter(l => l.stage === s.id);
          return (
            <div key={s.id} className="bg-white border border-[var(--ccg-border)] rounded-xl">
              <div className="px-4 py-3 border-b border-[var(--ccg-border)] flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[var(--ccg-text)]">
                  {s.label}
                </h3>
                <span className="text-[10px] text-[var(--ccg-text-muted)]">
                  {leads.length}
                </span>
              </div>
              <div className="p-3 space-y-2 min-h-[300px]">
                {leads.map(l => (
                  <div
                    key={l.id}
                    className="border border-[var(--ccg-border)] rounded-lg p-3 hover:shadow-sm transition-shadow bg-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                        style={{ backgroundColor: 'var(--ccg-primary)' }}
                      >
                        {l.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[var(--ccg-text)] truncate">
                          {l.name}
                        </div>
                        <div className="text-[10px] text-[var(--ccg-text-muted)]">
                          {l.source} · {new Date(l.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--ccg-text-muted)] mb-2">
                      {l.reason} · {l.preferredModality}
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-md p-2 border border-indigo-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={10} className="text-indigo-600" />
                        <span className="text-[9px] uppercase tracking-wider text-indigo-700 font-semibold">
                          Agentforce match {l.matchScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--ccg-text-muted)] leading-relaxed">
                        {l.aiSummary}
                      </div>
                    </div>
                    {s.id === 'New' && (
                      <button className="mt-2 w-full bg-[var(--ccg-primary)] text-white text-[10px] py-1.5 rounded flex items-center justify-center gap-1">
                        Send AI-drafted outreach <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
