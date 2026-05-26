const BEFORE = [
  { name: 'Shopify POS', hue: 145 },
  { name: 'Klaviyo', hue: 220 },
  { name: 'Yotpo Loyalty', hue: 30 },
  { name: 'Gorgias', hue: 280 },
  { name: 'Stamped Reviews', hue: 350 },
  { name: 'Mailchimp', hue: 50 },
  { name: 'Google Sheets', hue: 130 },
];

export default function Consolidation() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
      <div className="text-center cg-fade-up">
        <div
          className="text-xs uppercase tracking-[0.22em]"
          style={{ color: 'var(--cg-muted)' }}
        >
          The Cult Gaia stack
        </div>
        <h1 className="font-display text-5xl mt-3" style={{ color: 'var(--cg-ink)' }}>
          7 tools → 1 platform
        </h1>
        <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--cg-muted)' }}>
          The same beautiful experience your team uses today — without the seven dashboards,
          three CSV exports, and one very tired ops manager.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        {/* Before */}
        <div className="cg-fade-up" style={{ animationDelay: '120ms' }}>
          <div
            className="text-[10px] uppercase tracking-[0.22em] text-center mb-4"
            style={{ color: 'var(--cg-muted)' }}
          >
            Today
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BEFORE.map(t => (
              <div
                key={t.name}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium text-center p-2 cg-card"
                style={{
                  background: `hsl(${t.hue} 35% 96%)`,
                  color: `hsl(${t.hue} 40% 28%)`,
                  borderColor: `hsl(${t.hue} 30% 86%)`,
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex flex-col items-center">
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" aria-hidden>
            <path
              d="M2 24 H56 M44 10 L58 24 L44 38"
              stroke="var(--cg-clay)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className="text-[10px] uppercase tracking-[0.22em] mt-2"
            style={{ color: 'var(--cg-clay)' }}
          >
            Consolidate
          </div>
        </div>

        {/* After */}
        <div className="cg-fade-up" style={{ animationDelay: '240ms' }}>
          <div
            className="text-[10px] uppercase tracking-[0.22em] text-center mb-4"
            style={{ color: 'var(--cg-muted)' }}
          >
            Tomorrow
          </div>
          <div
            className="rounded-lg overflow-hidden cg-card cg-pulse"
            style={{ background: 'var(--cg-ink)', borderColor: 'var(--cg-ink)' }}
          >
            <div className="p-8 text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-md font-display text-3xl mb-4"
                style={{ background: 'var(--cg-bg)', color: 'var(--cg-ink)' }}
              >
                CG
              </div>
              <div className="font-display text-3xl" style={{ color: 'var(--cg-bg)' }}>
                Atelier Console
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.22em] mt-2"
                style={{ color: 'var(--cg-accent)' }}
              >
                Built on Salesforce
              </div>
              <div
                className="mt-6 text-sm leading-relaxed"
                style={{ color: 'rgba(250,247,242,0.75)' }}
              >
                Commerce · Service · Marketing · Loyalty · Data · Agentforce —
                under one beautifully Cult Gaia roof.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cg-divider mt-20" />

      <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm">
        {[
          {
            t: 'One customer record',
            d: 'No more reconciling Shopify, Klaviyo, and your spreadsheet. One profile, one truth.',
          },
          {
            t: 'AI everywhere',
            d: 'Agentforce drafts the outreach, surfaces the at-risk customer, and answers the late-night ticket.',
          },
          {
            t: 'Your brand, your UX',
            d: 'This console looks like Cult Gaia — because it is. We just gave it a CRM underneath.',
          },
        ].map((b, i) => (
          <div key={b.t} className="cg-card p-6 cg-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="font-display text-xl" style={{ color: 'var(--cg-ink)' }}>
              {b.t}
            </div>
            <div className="mt-2" style={{ color: 'var(--cg-muted)' }}>
              {b.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
