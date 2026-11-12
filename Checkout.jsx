import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import { formatMoney, isValidPhone } from '../../utils/format';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../../utils/whatsapp';
import EmptyState from '../../components/EmptyState';

const initial = { name: '', phone: '', address: '', notes: '' };

export default function Checkout() {
  const { cartLines, cartSubtotal, settings, placeOrder } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const cur = settings.currency;
  const fee = Number(settings.deliveryFee) || 0;
  const total = cartSubtotal + fee;

  if (cartLines.length === 0) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          text="Add a few dishes to your cart first."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name (at least 2 characters).';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid phone number (10–15 digits).';
    if (form.address.trim().length < 8) e.address = 'Please enter a full delivery address (at least 8 characters).';
    if (form.notes.length > 300) e.notes = 'Notes must be 300 characters or fewer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const change = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = (channel) => {
    if (!validate()) {
      toast('Please fix the highlighted fields.', 'error');
      return;
    }
    const customer = { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() };
    const items = cartLines.map(({ productId, name, price, quantity }) => ({ productId, name, price, quantity }));
    const order = placeOrder({ customer, items, notes: form.notes.trim(), channel });

    if (channel === 'WhatsApp') {
      const message = buildWhatsAppMessage({
        settings,
        items,
        customer,
        notes: form.notes,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        orderNumber: order.number,
      });
      window.open(buildWhatsAppUrl(settings.whatsapp, message), '_blank', 'noopener,noreferrer');
    }
    toast(`Order ${order.number} placed successfully`);
    navigate(`/order/${order.id}`, { replace: true, state: { channel } });
  };

  const field = (name) => `input ${errors[name] ? 'input-error' : ''}`;

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
      <p className="mt-1 text-ink-500">Tell us where to deliver and confirm your order.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <form
          noValidate
          className="card space-y-5 p-6 lg:col-span-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit('Website');
          }}
        >
          <h2 className="text-lg font-extrabold">Delivery details</h2>

          <div>
            <label htmlFor="name" className="label">Full name *</label>
            <input id="name" className={field('name')} value={form.name} onChange={change('name')} placeholder="e.g. Omar Hassan" autoComplete="name" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="label">Phone number *</label>
            <input id="phone" type="tel" className={field('phone')} value={form.phone} onChange={change('phone')} placeholder="e.g. 01012345678" autoComplete="tel" />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="label">Delivery address *</label>
            <textarea id="address" rows={3} className={field('address')} value={form.address} onChange={change('address')} placeholder="Street, building, floor, apartment, landmark" autoComplete="street-address" />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="label">Order notes <span className="font-normal text-ink-400">(optional)</span></label>
            <textarea id="notes" rows={2} className={field('notes')} value={form.notes} onChange={change('notes')} placeholder="Allergies, extra sauce, delivery instructions…" />
            <div className="mt-1 flex justify-between">
              {errors.notes ? <p className="field-error">{errors.notes}</p> : <span />}
              <span className="text-xs text-ink-400">{form.notes.length}/300</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" className="btn-primary btn-lg flex-1">
              <CheckCircle2 className="h-5 w-5" /> Confirm order
            </button>
            <button type="button" className="btn-whatsapp btn-lg flex-1" onClick={() => submit('WhatsApp')}>
              <MessageCircle className="h-5 w-5" /> Order via WhatsApp
            </button>
          </div>
          <p className="text-xs text-ink-400">
            WhatsApp ordering saves your order here and opens WhatsApp with a ready-made message addressed to the restaurant.
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="card sticky top-24 p-6">
            <h2 className="text-lg font-extrabold">Order summary</h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {cartLines.map((l) => (
                <li key={l.productId} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{l.name}</span>
                    <span className="text-ink-400">{l.quantity} × {formatMoney(l.price, cur)}</span>
                  </span>
                  <span className="shrink-0 font-semibold">{formatMoney(l.price * l.quantity, cur)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-semibold">{formatMoney(cartSubtotal, cur)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Delivery fee</dt><dd className="font-semibold">{formatMoney(fee, cur)}</dd></div>
              <div className="flex justify-between pt-2 text-base"><dt className="font-bold">Total</dt><dd className="text-xl font-extrabold text-brand-600">{formatMoney(total, cur)}</dd></div>
            </dl>
            <Link to="/cart" className="btn-ghost mt-4 w-full">Edit cart</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
