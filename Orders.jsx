import { useMemo, useState } from 'react';
import { Search, Eye, ClipboardList, Phone, MapPin, StickyNote, MessageCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import { ORDER_STATUSES } from '../../data/demoData';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatMoney, formatDateTime, digitsOnly } from '../../utils/format';

export default function Orders() {
  const { orders, updateOrderStatus, settings } = useStore();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const cur = settings.currency;

  const selected = orders.find((o) => o.id === selectedId) || null;

  const counts = useMemo(() => {
    const c = { all: orders.length };
    ORDER_STATUSES.forEach((s) => (c[s] = orders.filter((o) => o.status === s).length));
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false;
      if (!q) return true;
      return (
        o.number.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
      );
    });
  }, [orders, query, status]);

  const changeStatus = (order, next) => {
    if (next === order.status) return;
    updateOrderStatus(order.id, next);
    toast(`${order.number} marked as ${next}`);
  };

  const tab = (active) =>
    `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
      active ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100'
    }`;

  return (
    <div className="space-y-5">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button className={tab(status === 'all')} onClick={() => setStatus('all')}>
          All <span className="opacity-60">({counts.all})</span>
        </button>
        {ORDER_STATUSES.map((s) => (
          <button key={s} className={tab(status === s)} onClick={() => setStatus(s)}>
            {s} <span className="opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type="search" className="input pl-10" placeholder="Search by order number, customer or phone…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search orders" />
        </div>
        <select className="input md:w-52" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders found" text="No orders match your search or status filter." action={<button className="btn-outline" onClick={() => { setQuery(''); setStatus('all'); }}>Reset filters</button>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {visible.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-50/60">
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-bold">{o.number}</p>
                      <p className="text-xs text-ink-400">{o.channel}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{o.customer.name}</p>
                      <p className="text-xs text-ink-400">{o.customer.phone}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-600">{formatDateTime(o.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{formatMoney(o.total, cur)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o, e.target.value)}
                        className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs font-semibold focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        aria-label={`Status of ${o.number}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn-outline btn-sm" onClick={() => setSelectedId(o.id)}>
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

      <Modal open={!!selected} onClose={() => setSelectedId(null)} title={selected ? `Order ${selected.number}` : ''} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-ink-500">{formatDateTime(selected.createdAt)} · via {selected.channel}</p>
                <div className="mt-2"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="w-full sm:w-56">
                <label htmlFor="ostatus" className="label">Update status</label>
                <select id="ostatus" className="input" value={selected.status} onChange={(e) => changeStatus(selected, e.target.value)}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl bg-ink-50 p-4 text-sm sm:grid-cols-2">
              <div className="space-y-2">
                <p className="font-bold">{selected.customer.name}</p>
                <p className="flex items-center gap-2 text-ink-600"><Phone className="h-4 w-4 text-ink-400" /> {selected.customer.phone}</p>
                <p className="flex items-start gap-2 text-ink-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" /> {selected.customer.address}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-bold"><StickyNote className="h-4 w-4 text-ink-400" /> Notes</p>
                <p className="mt-1 text-ink-600">{selected.notes || 'No notes.'}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-bold">Items</h4>
              <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100">
                {selected.items.map((it) => (
                  <li key={it.productId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span>{it.quantity} × {it.name}</span>
                    <span className="font-semibold">{formatMoney(it.price * it.quantity, cur)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-semibold">{formatMoney(selected.subtotal, cur)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Delivery fee</dt><dd className="font-semibold">{formatMoney(selected.deliveryFee, cur)}</dd></div>
                <div className="flex justify-between border-t border-ink-100 pt-2 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-brand-600">{formatMoney(selected.total, cur)}</dd></div>
              </dl>
            </div>

            <a
              className="btn-whatsapp w-full sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${digitsOnly(selected.customer.phone.startsWith('0') ? '2' + selected.customer.phone : selected.customer.phone)}?text=${encodeURIComponent(`Hello ${selected.customer.name}, this is ${settings.restaurantName} regarding your order ${selected.number} (${selected.status}).`)}`}
            >
              <MessageCircle className="h-4 w-4" /> Message customer on WhatsApp
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
