import { Link } from 'react-router';
import { customers } from '@/data/demoData';
import Avatar from '@/components/Avatar';

export default function Customers() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
      <div className="flex items-end justify-between mb-8 cg-fade-up">
        <div>
          <div
            className="text-xs uppercase tracking-[0.22em]"
            style={{ color: 'var(--cg-muted)' }}
          >
            Customer Book
          </div>
          <h1 className="font-display text-4xl mt-2" style={{ color: 'var(--cg-ink)' }}>
            Customers
          </h1>
        </div>
        <div className="text-sm" style={{ color: 'var(--cg-muted)' }}>
          {customers.length} active · sorted by lifetime value
        </div>
      </div>

      <div className="cg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead
            className="text-left text-[10px] uppercase tracking-[0.18em]"
            style={{ background: 'var(--cg-bg)', color: 'var(--cg-muted)' }}
          >
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Tier</th>
              <th className="px-5 py-3">LTV</th>
              <th className="px-5 py-3">Top category</th>
              <th className="px-5 py-3">Last purchase</th>
              <th className="px-5 py-3">Signal</th>
            </tr>
          </thead>
          <tbody>
            {[...customers]
              .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
              .map((c, i) => (
                <tr
                  key={c.id}
                  className="border-t cg-fade-up"
                  style={{ borderColor: 'var(--cg-line)', animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-5 py-4">
                    <Link to={`/customers/${c.id}`} className="flex items-center gap-3 group">
                      <Avatar firstName={c.firstName} lastName={c.lastName} hue={c.avatarHue} size="md" />
                      <div>
                        <div
                          className="font-medium group-hover:underline"
                          style={{ color: 'var(--cg-ink)' }}
                        >
                          {c.firstName} {c.lastName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--cg-muted)' }}>
                          {c.city}, {c.state}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="cg-pill"
                      style={{
                        background:
                          c.loyaltyTier === 'Platinum'
                            ? '#1a1a1a'
                            : c.loyaltyTier === 'Gold'
                              ? 'var(--cg-accent)'
                              : c.loyaltyTier === 'Silver'
                                ? '#d6d2cc'
                                : '#e8d2b8',
                        color: c.loyaltyTier === 'Platinum' || c.loyaltyTier === 'Gold' ? '#fff' : '#3a3a3a',
                        border: 'none',
                      }}
                    >
                      {c.loyaltyTier}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium" style={{ color: 'var(--cg-ink)' }}>
                    ${c.lifetimeValue.toLocaleString()}
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--cg-ink-soft)' }}>
                    {c.topCategory}
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--cg-muted)' }}>
                    {c.lastPurchaseDate}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          c.signals.churnRisk === 'High'
                            ? 'var(--cg-clay)'
                            : c.signals.churnRisk === 'Medium'
                              ? 'var(--cg-muted)'
                              : 'var(--cg-sage)',
                      }}
                    >
                      ● {c.signals.churnRisk} churn risk
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
