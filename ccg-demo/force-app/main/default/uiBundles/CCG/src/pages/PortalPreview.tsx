import { Link } from 'react-router';
import { Calendar, FileText, Receipt, MessageSquare, User } from 'lucide-react';

export default function PortalPreview() {
  return (
    <div className="bg-white min-h-full">
      <div className="border-b border-[var(--ccg-border)] bg-white">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center">
          <div className="text-base font-semibold text-[var(--ccg-text)]">
            The Counseling Center Group
          </div>
          <nav className="ml-auto flex items-center gap-6 text-sm text-[var(--ccg-text-muted)]">
            <a className="flex items-center gap-1 text-[var(--ccg-primary)] border-b-2 border-[var(--ccg-primary)] py-1">
              <Calendar size={14} /> Appointments
            </a>
            <a className="flex items-center gap-1">
              <FileText size={14} /> Documents
            </a>
            <a className="flex items-center gap-1">
              <Receipt size={14} /> Billing
            </a>
            <a className="flex items-center gap-1">
              <MessageSquare size={14} /> Messages
            </a>
            <div className="w-8 h-8 rounded-full bg-[var(--ccg-primary)] text-white flex items-center justify-center text-xs font-semibold">
              <User size={14} />
            </div>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-4 text-xs text-[var(--ccg-text-muted)]">
          Sarah's view · same Salesforce platform, patient-facing
        </div>
        <h1 className="text-2xl font-semibold mb-2">Appointments</h1>

        <div className="bg-[var(--ccg-primary-soft)] border border-[var(--ccg-primary)]/30 rounded-xl p-6 mb-6">
          <div className="text-xs uppercase tracking-wider text-[var(--ccg-primary)] font-semibold mb-2">
            Your next session
          </div>
          <div className="text-xl font-semibold text-[var(--ccg-text)]">
            Tuesday, May 26 · 2:00 PM
          </div>
          <div className="text-sm text-[var(--ccg-text-muted)] mt-1">
            Therapy with Dr. Emily Chen · Telehealth
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-[var(--ccg-primary)] text-white text-xs px-3 py-1.5 rounded-md">
              Join session
            </button>
            <button className="text-xs px-3 py-1.5 border border-[var(--ccg-border)] rounded-md">
              Reschedule
            </button>
          </div>
        </div>

        <div className="text-sm font-medium mb-2">Upcoming</div>
        <div className="bg-white border border-[var(--ccg-border)] rounded-xl divide-y divide-[var(--ccg-border)]">
          <div className="p-4 text-sm text-[var(--ccg-text-muted)]">
            No additional upcoming appointments.
          </div>
        </div>

        <div className="text-center mt-12 text-xs text-[var(--ccg-text-muted)]">
          Client portal for The Counseling Center Group
          <br />
          Powered by CCG · Terms of Service · Privacy Policy
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-xs text-[var(--ccg-primary)] hover:underline">
            ← Back to provider view
          </Link>
        </div>
      </div>
    </div>
  );
}
