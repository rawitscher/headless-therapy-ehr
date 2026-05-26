import { Link } from 'react-router';
import { customers, orders } from '@/data/demoData';

export default function Orders() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
      <div className="cg-fade-up">
        <div
          className="text-xs uppercase tracking-[0.22em]"
          style={{ color: 'var(--cg-muted)' }}
        >
          Operations
        </div>
        <h1 className="font-display text-4xl mt-2" style={{ color: 'var(--cg-ink)' }}>
          Orders
        </h1>
      </div>

      <div className="mt-8 cg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead
            className="text-left text-[10px] uppercase tracking-[0.18em]"
            style={{ background: 'var(--cg-bg)', color: 'var(--cg-muted)' }}
          >
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...orders]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((o, i) => {
                const c = customers.find(x => x.id === o.customerId);
                return (
                  <tr
                    key={o.id}
                    className="border-t cg-fade-up"
                    style={{ borderColor: 'var(--cg-line)', animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-5 py-4 font-medium" style={{ color: 'var(--cg-ink)' }}>
                      {o.orderNumber}
                    </td>
                    <td className="px-5 py-4">
                      {c && (
                        <Link to={`/customers/${c.id}`} className="cg-link">
                          {c.firstName} {c.lastName}
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--cg-muted)' }}>
                      {o.date}
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--cg-ink-soft)' }}>
                      {o.channel}
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--cg-ink-soft)' }}>
                      {o.items.length}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold" style={{ color: 'var(--cg-ink)' }}>
                      ${o.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] uppercase tracking-[0.14em] font-semibold"
                        style={{
                          color:
                            o.status === 'Returned'
                              ? 'var(--cg-clay)'
                              : o.status === 'Processing'
                                ? 'var(--cg-muted)'
                                : 'var(--cg-sage)',
                        }}
                      >
                        ● {o.status}
                      </span>
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
