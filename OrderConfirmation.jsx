import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Home, SearchX, Printer } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatMoney, formatDateTime } from '../../utils/format';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../../utils/whatsapp';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders, settings } = useStore();
  const order = orders.find((o) => o.id === id);
  const cur = settings.currency;

  if (!order) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon={SearchX}
          title="Order not found"
          text="We couldn’t find that order. It may have been cleared from this browser."
          action={<Link to="/menu" className="btn-primary">Back to menu</Link>}
        />
      </div>
    );
  }

  const waUrl = buildWhatsAppUrl(
    settings.whatsapp,
    buildWhatsAppMessage({
      settings,
      items: order.items,
      customer: order.customer,
      notes: order.notes,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      orderNumber: order.number,
    })
  );

  return (
    <div className="container-page max-w-3xl py-10">
      <div className="animate-slide-up text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Thank you, {order.customer.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-ink-500">
          Your order has been received. We’ll start preparing it right away and call you if we need anything.
        </p>
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-brand-50 px-5 py-3">
          <span className="text-sm text-ink-600">Order number</span>
          <span className="font-display text-xl font-extrabold text-brand-700">{order.number}</span>
        </div>
      </div>

      <div className="card mt-8 divide-y divide-ink-100">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Placed</p>
            <p className="text-sm font-semibold">{formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Channel</p>
            <p className="text-sm font-semibold">{order.channel}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Status</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="p-5">
          <h2 className="mb-3 font-bold">Items</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-3">
                <span>{it.quantity} × {it.name}</span>
                <span className="font-semibold">{formatMoney(it.price * it.quantity, cur)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-semibold">{formatMoney(order.subtotal, cur)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Delivery fee</dt><dd className="font-semibold">{formatMoney(order.deliveryFee, cur)}</dd></div>
            <div className="flex justify-between text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-brand-600">{formatMoney(order.total, cur)}</dd></div>
          </dl>
        </div>

        <div className="grid gap-4 p-5 text-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-1 font-bold">Delivery to</h2>
            <p className="text-ink-600">{order.customer.name}</p>
            <p className="text-ink-600">{order.customer.phone}</p>
            <p className="text-ink-600">{order.customer.address}</p>
          </div>
          <div>
            <h2 className="mb-1 font-bold">Notes</h2>
            <p className="text-ink-600">{order.notes || 'No notes.'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Back to home</Link>
        <Link to="/menu" className="btn-outline">Order more</Link>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <MessageCircle className="h-4 w-4" /> Send details via WhatsApp
        </a>
        <button className="btn-ghost" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</button>
      </div>
    </div>
  );
}
