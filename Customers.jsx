import { useMemo, useState } from 'react';
import { Search, Eye, Users, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatMoney, formatDate, formatDateTime } from '../../utils/format';

export default function Customers() {
  const { customersWithStats, settings } = useStore();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const cur = settings.currency;

  const selected = customersWithStats.find((c) => c.id === selectedId) || null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...customersWithStats].sort((a, b) => b.totalSpent - a.totalSpent);
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    );
  }, [customersWithStats, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">{customersWithStats.length} customers · sorted by total spending</p>
      </div>
      <div className="card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type="search" className="input pl-10" placeholder="Search by name or phone…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search customers" />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" text="Try a different name or phone number." action={<button className="btn-outline" onClick={() => setQuery('')}>Clear search</button>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Phone</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total spent</th>
                  <th className="hidden px-4 py-3 md:table-cell">Last order</th>
                  <th className="px-4 py-3 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {visible.map((c) => (
                  <tr key={c.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">{c.name[0]}</span>
                        <div className="min-w-0">
                          <p className="truncate font-bold">{c.name}</p>
                          <p className="text-xs text-ink-400 sm:hidden">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-ink-600 sm:table-cell">{c.phone}</td>
                    <td className="px-4 py-3 font-semibold">{c.totalOrders}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{formatMoney(c.totalSpent, cur)}</td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-ink-600 md:table-cell">{c.lastOrderAt ? formatDate(c.lastOrderAt) : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn-outline btn-sm" onClick={() => setSelectedId(c.id)}>
                        <Eye className="h-4 w-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelectedId(null)} title={selected ? selected.name : ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-ink-50 p-4"><p className="text-xs font-semibold uppercase text-ink-400">Total orders</p><p className="mt-1 text-2xl font-extrabold">{selected.totalOrders}</p></div>
              <div className="rounded-2xl bg-ink-50 p-4"><p className="text-xs font-semibold uppercase text-ink-400">Total spent</p><p className="mt-1 text-2xl font-extrabold">{formatMoney(selected.totalSpent, cur)}</p></div>
              <div className="rounded-2xl bg-ink-50 p-4"><p className="text-xs font-semibold uppercase text-ink-400">Customer since</p><p className="mt-1 text-lg font-extrabold">{formatDate(selected.createdAt)}</p></div>
            </div>
            <div className="space-y-1.5 text-sm text-ink-600">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-400" /> {selected.phone}</p>
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" /> {selected.address}</p>
            </div>
            <div>
              <h4 className="mb-2 font-bold">Order history</h4>
              {selected.orders.length === 0 ? (
                <p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-500">This customer hasn’t placed any orders yet.</p>
              ) : (
                <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100">
                  {selected.orders.map((o) => (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-bold">{o.number}</p>
                        <p className="truncate text-xs text-ink-400">{formatDateTime(o.createdAt)} · {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={o.status} />
                        <span className="font-bold">{formatMoney(o.total, cur)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
