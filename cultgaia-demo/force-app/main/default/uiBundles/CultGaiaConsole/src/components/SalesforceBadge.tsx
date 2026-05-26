type Props = {
  recordId: string;
  sobject?: string;
  label?: string;
};

const INSTANCE_URL = 'https://java-power-7159-dev-ed.scratch.my.salesforce.com';

export default function SalesforceBadge({ recordId, sobject = 'Contact', label }: Props) {
  if (!recordId) {
    return (
      <span
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
        style={{
          background: 'transparent',
          color: 'var(--cg-muted)',
          border: '1px dashed var(--cg-line)',
        }}
        title="Salesforce ID will appear after data import"
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--cg-muted)' }} />
        CRM record pending
      </span>
    );
  }

  const href = `${INSTANCE_URL}/lightning/r/${sobject}/${recordId}/view`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full transition-colors"
      style={{
        background: '#eaf3fb',
        color: '#0b5cab',
        border: '1px solid #cfe2f3',
      }}
      title="Open this record in Salesforce"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14 3v2h3.59l-9.3 9.29 1.42 1.42L19 6.41V10h2V3h-7zM5 5h6V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2v6H5V5z" />
      </svg>
      {label ?? `${sobject} · ${recordId.slice(0, 6)}…`}
    </a>
  );
}
