import { Link } from 'react-router';
import { customers, orders, todayKpis, todayPriorities } from '@/data/demoData';
import AgentforcePill from '@/components/AgentforcePill';
import Avatar from '@/components/Avatar';

export default function Today() {
  const recentOrders = [...orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
      <section className="cg-fade-up">
        <div
          className="text-xs uppercase tracking-[0.22em]"
          style={{ color: 'var(--cg-muted)' }}
        >
          Friday · Resort 26 launch week
        </div>
        <h1 className="font-display text-5xl mt-2" style={{ color: 'var(--cg-ink)' }}>
          Good morning, Isabella.
        </h1>
        <p className="mt-3 max-w-2xl text-base" style={{ color: 'var(--cg-muted)' }}>
          A quiet but loyal start to the day at <strong style={{ color: 'var(--cg-ink-soft)' }}>Melrose Flagship</strong>.
          Three customers need attention before noon.
        </p>
      </section>

      <div className="cg-divider mt-10" />

      <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 cg-fade-up" style={{ animationDelay: '60ms' }}>
        {todayKpis.map(k => (
          <div key={k.label} className="cg-card p-5">
            <div
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--cg-muted)' }}
            >
              {k.label}
            </div>
            <div className="mt-2 font-display text-3xl" style={{ color: 'var(--cg-ink)' }}>
              {k.value}
            </div>
            <div
              className="mt-1 text-xs font-medium"
              style={{
                color:
                  k.trend === 'up'
                    ? 'var(--cg-sage)'
                    : k.trend === 'down'
                      ? 'var(--cg-clay)'
                      : 'var(--cg-muted)',
              }}
            >
              {k.delta} vs. yesterday
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cg-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl" style={{ color: 'var(--cg-ink)' }}>
              Today's priorities
            </h2>
            <AgentforcePill>Agentforce · Daily Brief</AgentforcePill>
          </div>

          <div className="space-y-3">
            {todayPriorities.map(p => {
              const c = customers.find(x => x.id === p.customerId);
              if (!c) return null;
              return (
                <Link
                  to={`/customers/${c.id}`}
                  key={p.id}
                  className="cg-ai-card block p-5 rounded-lg group"
                >
                  <div className="flex items-start gap-4">
                    <Avatar firstName={c.firstName} lastName={c.lastName} hue={c.avatarHue} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] uppercase tracking-[0.18em] font-semibold"
                          style={{ color: 'var(--cg-clay)' }}
                        >
                          {c.loyaltyTier} · {c.city}
                        </span>
                        <span className="cg-pill" style={{ background: '#fff' }}>
                          {c.signals.churnRisk} risk
                        </span>
                      </div>
                      <div className="mt-2 font-display text-xl" style={{ color: 'var(--cg-ink)' }}>
                        {p.title}
                      </div>
                      <div className="mt-1 text-sm" style={{ color: 'var(--cg-muted)' }}>
                        {p.why}
                      </div>
                    </div>
                    <div
                      className="hidden sm:flex items-center text-xs font-medium transition-transform group-hover:translate-x-1"
                      style={{ color: 'var(--cg-clay)' }}
                    >
                      Open ›
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="cg-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl" style={{ color: 'var(--cg-ink)' }}>
              Latest orders
            </h2>
            <Link to="/orders" className="text-xs cg-link uppercase tracking-[0.14em]">
              View all
            </Link>
          </div>
          <div className="cg-card divide-y" style={{ borderColor: 'var(--cg-line)' }}>
            {recentOrders.map(o => {
              const c = customers.find(x => x.id === o.customerId);
              return (
                <div key={o.id} className="p-4 flex items-center gap-3">
                  {c && (
                    <Avatar firstName={c.firstName} lastName={c.lastName} hue={c.avatarHue} size="sm" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--cg-ink)' }}>
                      {o.orderNumber}{' '}
                      <span style={{ color: 'var(--cg-muted)' }}>· {c ? `${c.firstName} ${c.lastName}` : ''}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--cg-muted)' }}>
                      {o.date} · {o.channel}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: 'var(--cg-ink)' }}>
                      ${o.total.toLocaleString()}
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color:
                          o.status === 'Returned'
                            ? 'var(--cg-clay)'
                            : o.status === 'Processing'
                              ? 'var(--cg-muted)'
                              : 'var(--cg-sage)',
                      }}
                    >
                      {o.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
