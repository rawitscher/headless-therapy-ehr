import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { customers, orders } from '@/data/demoData';
import Avatar from '@/components/Avatar';
import AgentforcePill from '@/components/AgentforcePill';
import SalesforceBadge from '@/components/SalesforceBadge';

type Tab = 'profile' | 'orders' | 'service' | 'insights' | 'marketing';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'Orders' },
  { id: 'service', label: 'Service' },
  { id: 'insights', label: 'Insights' },
  { id: 'marketing', label: 'Marketing' },
];

export default function Customer360() {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customers.find(c => c.id === customerId);
  const [tab, setTab] = useState<Tab>('insights');

  if (!customer) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 text-center">
        <h1 className="font-display text-3xl">Customer not found</h1>
        <Link to="/customers" className="cg-link mt-4 inline-block">
          ← Back to customers
        </Link>
      </div>
    );
  }

  const customerOrders = orders.filter(o => o.customerId === customer.id);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8">
      <Link to="/customers" className="cg-link text-xs uppercase tracking-[0.16em]">
        ← Customers
      </Link>

      {/* Header */}
      <header className="mt-4 cg-fade-up">
        <div className="flex flex-wrap items-start gap-6">
          <Avatar firstName={customer.firstName} lastName={customer.lastName} hue={customer.avatarHue} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span
                className="text-[10px] uppercase tracking-[0.22em] font-semibold"
                style={{ color: 'var(--cg-clay)' }}
              >
                {customer.loyaltyTier} member · joined {customer.joinedYear}
              </span>
              <SalesforceBadge recordId={customer.salesforceContactId} sobject="Contact" />
            </div>
            <h1 className="font-display text-5xl" style={{ color: 'var(--cg-ink)' }}>
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: 'var(--cg-muted)' }}>
              <span>{customer.email}</span>
              <span>{customer.phone}</span>
              <span>
                {customer.city}, {customer.state} · prefers {customer.preferredStore}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-right">
            <Stat label="Lifetime" value={`$${customer.lifetimeValue.toLocaleString()}`} />
            <Stat label="NPS" value={`${customer.npsScore}/10`} />
            <Stat label="Return rate" value={`${Math.round(customer.returnRate * 100)}%`} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav
        className="mt-10 flex gap-1 border-b"
        style={{ borderColor: 'var(--cg-line)' }}
      >
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative px-4 py-3 text-sm font-medium transition-colors"
              style={{ color: active ? 'var(--cg-ink)' : 'var(--cg-muted)' }}
            >
              {t.label}
              {active && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-0.5"
                  style={{ background: 'var(--cg-ink)' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <section className="mt-8">
        {tab === 'insights' && <InsightsTab customer={customer} />}
        {tab === 'profile' && <ProfileTab customer={customer} />}
        {tab === 'orders' && <OrdersTab orders={customerOrders} />}
        {tab === 'service' && <ServiceTab />}
        {tab === 'marketing' && <MarketingTab customer={customer} />}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: 'var(--cg-muted)' }}
      >
        {label}
      </div>
      <div className="font-display text-2xl mt-1" style={{ color: 'var(--cg-ink)' }}>
        {value}
      </div>
    </div>
  );
}

function InsightsTab({ customer }: { customer: (typeof customers)[number] }) {
  const cards = [
    {
      kind: 'AI drafted email',
      title: 'Welcome-back note · Resort 26',
      preview: `Hi ${customer.firstName} — we set aside a Capri Crochet Set in your size; the SoHo studio can hold it through Sunday.`,
      action: 'Review & send',
    },
    {
      kind: 'Churn risk',
      title: `${customer.signals.churnRisk} churn risk`,
      preview:
        customer.signals.churnRisk === 'High'
          ? `${customer.firstName} hasn't engaged in 96+ days. Win-back offer recommended within 7 days.`
          : `Engagement steady. No outreach needed this week.`,
      action: 'View signals',
    },
    {
      kind: 'Upsell signal',
      title: customer.signals.upsellAffinity,
      preview: `Customers with ${customer.firstName}'s pattern buy this within 14 days (model confidence 0.82).`,
      action: 'Create look',
    },
    {
      kind: 'Inventory',
      title: customer.signals.backInStock ?? 'Wishlist quiet',
      preview: customer.signals.backInStock
        ? `Back in stock at ${customer.preferredStore} this morning. Hold for 48h?`
        : 'No wishlist items have changed availability in the last 7 days.',
      action: customer.signals.backInStock ? 'Reserve & notify' : '—',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {cards.map((c, i) => (
        <article
          key={c.kind}
          className="cg-ai-card p-6 rounded-lg cg-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between">
            <AgentforcePill>{c.kind}</AgentforcePill>
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--cg-muted)' }}
            >
              Refreshed 9:42 AM
            </span>
          </div>
          <h3 className="font-display text-2xl mt-4" style={{ color: 'var(--cg-ink)' }}>
            {c.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--cg-ink-soft)' }}>
            {c.preview}
          </p>
          {c.action !== '—' && (
            <button
              className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1.5"
              style={{ color: 'var(--cg-clay)' }}
            >
              {c.action} ›
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

function ProfileTab({ customer }: { customer: (typeof customers)[number] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="cg-card p-6">
        <h3 className="font-display text-xl mb-4">Preferences</h3>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt style={{ color: 'var(--cg-muted)' }}>Top category</dt>
          <dd style={{ color: 'var(--cg-ink)' }}>{customer.topCategory}</dd>
          <dt style={{ color: 'var(--cg-muted)' }}>Preferred store</dt>
          <dd style={{ color: 'var(--cg-ink)' }}>{customer.preferredStore}</dd>
          <dt style={{ color: 'var(--cg-muted)' }}>Marketing consent</dt>
          <dd style={{ color: 'var(--cg-ink)' }}>{customer.marketingConsent ? 'Opt-in' : 'Opt-out'}</dd>
          <dt style={{ color: 'var(--cg-muted)' }}>Last touch</dt>
          <dd style={{ color: 'var(--cg-ink)' }}>{customer.signals.lastTouch}</dd>
        </dl>
      </div>
      <div className="cg-card p-6">
        <h3 className="font-display text-xl mb-4">Loyalty</h3>
        <div className="font-display text-4xl" style={{ color: 'var(--cg-ink)' }}>
          {customer.loyaltyTier}
        </div>
        <div className="mt-2 text-sm" style={{ color: 'var(--cg-muted)' }}>
          ${customer.lifetimeValue.toLocaleString()} lifetime · {Math.round(customer.returnRate * 100)}% return rate ·
          NPS {customer.npsScore}/10
        </div>
        <div className="mt-6 cg-divider" />
        <div className="mt-4 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--cg-muted)' }}>
          Joined {customer.joinedYear}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }: { orders: typeof import('@/data/demoData').orders }) {
  if (!orders.length) {
    return <div style={{ color: 'var(--cg-muted)' }}>No orders yet.</div>;
  }
  return (
    <div className="cg-card divide-y" style={{ borderColor: 'var(--cg-line)' }}>
      {orders.map(o => (
        <div key={o.id} className="p-5 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-medium" style={{ color: 'var(--cg-ink)' }}>
              {o.orderNumber}
            </div>
            <div className="text-xs" style={{ color: 'var(--cg-muted)' }}>
              {o.date} · {o.channel} · {o.items.length} item{o.items.length === 1 ? '' : 's'}
            </div>
            <ul className="mt-2 text-sm space-y-0.5" style={{ color: 'var(--cg-ink-soft)' }}>
              {o.items.map(it => (
                <li key={it.sku}>
                  · {it.name} <span style={{ color: 'var(--cg-muted)' }}>({it.qty}× ${it.price})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl" style={{ color: 'var(--cg-ink)' }}>
              ${o.total.toLocaleString()}
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.14em] mt-1"
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
      ))}
    </div>
  );
}

function ServiceTab() {
  return (
    <div className="cg-card p-6 text-sm" style={{ color: 'var(--cg-muted)' }}>
      No open service cases. Recent: shipping inquiry (resolved · Mar 28) · sizing question (resolved · Feb 11).
    </div>
  );
}

function MarketingTab({ customer }: { customer: (typeof customers)[number] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[
        { name: 'Resort 26 Pre-Launch', status: 'Opened · 2d ago' },
        { name: 'Loyalty Newsletter', status: 'Opened · 9d ago' },
        { name: 'New Dresses', status: 'Clicked · 14d ago' },
      ].map((c, i) => (
        <div key={c.name} className="cg-card p-5 cg-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--cg-muted)' }}>
            Segment · {customer.topCategory}
          </div>
          <div className="font-display text-lg mt-2" style={{ color: 'var(--cg-ink)' }}>
            {c.name}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--cg-muted)' }}>
            {c.status}
          </div>
        </div>
      ))}
    </div>
  );
}
