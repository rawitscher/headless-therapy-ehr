import { Link } from 'react-router';
import { Search, Filter, Plus, AlertCircle, Database } from 'lucide-react';
import { patients, SALESFORCE_INSTANCE_URL } from '../data/demoData';

export default function Patients() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--ccg-text)]">Patients</h1>
          <p className="text-sm text-[var(--ccg-text-muted)] mt-1">
            {patients.length} active records · cash-pay
          </p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 bg-[var(--ccg-primary)] hover:bg-[var(--ccg-primary-hover)] text-white text-xs font-medium px-3 py-2 rounded-md">
          <Plus size={14} /> New patient
        </button>
      </div>

      <div className="bg-white border border-[var(--ccg-border)] rounded-xl">
        <div className="px-4 py-3 border-b border-[var(--ccg-border)] flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ccg-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full border border-[var(--ccg-border)] rounded-md text-xs pl-8 pr-2 py-1.5 focus:outline-none focus:border-[var(--ccg-primary)]"
            />
          </div>
          <button className="flex items-center gap-1 text-xs text-[var(--ccg-text-muted)] border border-[var(--ccg-border)] px-2.5 py-1.5 rounded-md hover:bg-gray-50">
            <Filter size={12} /> All statuses
          </button>
          <button className="flex items-center gap-1 text-xs text-[var(--ccg-text-muted)] border border-[var(--ccg-border)] px-2.5 py-1.5 rounded-md hover:bg-gray-50">
            All clinicians
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[var(--ccg-text-muted)]">
            <tr className="text-left text-xs">
              <th className="px-4 py-2.5 font-medium">Patient</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Primary clinician</th>
              <th className="px-4 py-2.5 font-medium">Diagnosis</th>
              <th className="px-4 py-2.5 font-medium">Next appointment</th>
              <th className="px-4 py-2.5 font-medium">Balance</th>
              <th className="px-4 py-2.5 font-medium">AI</th>
              <th className="px-4 py-2.5 font-medium">CRM</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => {
              const next = p.nextAppointment
                ? new Date(p.nextAppointment).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : '—';
              return (
                <tr
                  key={p.id}
                  className="border-t border-[var(--ccg-border)] hover:bg-[var(--ccg-primary-soft)]"
                >
                  <td className="px-4 py-3">
                    <Link to={`/patients/${p.slug}`} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: 'var(--ccg-primary)' }}
                      >
                        {p.initials}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--ccg-text)] hover:text-[var(--ccg-primary)]">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-[var(--ccg-text-muted)]">
                          {p.age} · {p.pronouns}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'New'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--ccg-text-muted)]">
                    {p.primaryClinician}
                  </td>
                  <td className="px-4 py-3 text-[var(--ccg-text-muted)] text-xs">
                    {p.diagnosis[0]}
                  </td>
                  <td className="px-4 py-3 text-[var(--ccg-text-muted)] text-xs">{next}</td>
                  <td className="px-4 py-3 text-xs">
                    {p.outstandingBalance && p.outstandingBalance > 0 ? (
                      <span className="text-[var(--ccg-danger)] font-medium">
                        ${p.outstandingBalance}
                      </span>
                    ) : (
                      <span className="text-[var(--ccg-text-muted)]">$0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.riskLevel === 'Medium' || p.riskLevel === 'High' ? (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700">
                        <AlertCircle size={12} /> {p.riskLevel} risk
                      </div>
                    ) : (
                      <span className="text-[10px] text-[var(--ccg-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.salesforceContactId ? (
                      <a
                        href={`${SALESFORCE_INSTANCE_URL}/lightning/r/Contact/${p.salesforceContactId}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] text-[var(--ccg-text-muted)] hover:text-[var(--ccg-primary)]"
                        title={`Salesforce Contact: ${p.salesforceContactId}`}
                      >
                        <Database size={10} />
                        <span className="font-mono">
                          {p.salesforceContactId.slice(0, 6)}…
                        </span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-[var(--ccg-text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
