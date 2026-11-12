import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import ProductImage from '../../components/ProductImage';
import EmptyState from '../../components/EmptyState';
import { formatMoney } from '../../utils/format';

export default function Cart() {
  const { cartLines, cartSubtotal, setCartQty, removeFromCart, clearCart, settings } = useStore();
  const navigate = useNavigate();
  const cur = settings.currency;
  const fee = Number(settings.deliveryFee) || 0;

  if (cartLines.length === 0) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          text="Looks like you haven’t added anything yet. Explore the menu and find something delicious."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Shopping cart</h1>
          <p className="mt-1 text-ink-500">{cartLines.length} {cartLines.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button className="btn-ghost btn-sm text-red-600 hover:bg-red-50" onClick={clearCart}>
          <Trash2 className="h-4 w-4" /> Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {cartLines.map((l) => (
            <li key={l.productId} className="card flex animate-slide-up gap-4 p-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                <ProductImage product={l.product} emojiSize="text-4xl" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{l.name}</h3>
                    <p className="text-sm text-ink-500">{formatMoney(l.price, cur)} each</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(l.productId)}
                    aria-label={`Remove ${l.name}`}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-xl border border-ink-200">
                    <button
                      className="p-2 text-ink-600 hover:bg-ink-100 disabled:opacity-40"
                      onClick={() => setCartQty(l.productId, l.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-bold" aria-live="polite">
                      {l.quantity}
                    </span>
                    <button
                      className="p-2 text-ink-600 hover:bg-ink-100"
                      onClick={() => setCartQty(l.productId, l.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-extrabold">{formatMoney(l.price * l.quantity, cur)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <h2 className="text-lg font-extrabold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-semibold">{formatMoney(cartSubtotal, cur)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Delivery fee</dt>
                <dd className="font-semibold">{formatMoney(fee, cur)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-4 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="text-xl font-extrabold text-brand-600">{formatMoney(cartSubtotal + fee, cur)}</dd>
              </div>
            </dl>
            <button className="btn-primary btn-lg mt-6 w-full" onClick={() => navigate('/checkout')}>
              Proceed to checkout <ArrowRight className="h-5 w-5" />
            </button>
            <Link to="/menu" className="btn-ghost mt-2 w-full">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
