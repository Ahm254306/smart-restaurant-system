import { Plus, Star } from 'lucide-react';
import ProductImage from './ProductImage';
import { useStore } from '../hooks/useStore';
import { useToast } from '../hooks/useToast';
import { formatMoney } from '../utils/format';

export default function ProductCard({ product }) {
  const { addToCart, settings, categories } = useStore();
  const toast = useToast();
  const cat = categories.find((c) => c.id === product.category);

  const add = () => {
    addToCart(product.id, 1);
    toast(`${product.name} added to cart`);
  };

  return (
    <article className="card group flex animate-slide-up flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage product={product} />
        {product.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            <Star className="h-3 w-3 fill-brand-500 text-brand-500" /> Popular
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/55">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-800">Unavailable</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {cat && <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{cat.name}</p>}
        <h3 className="mt-1 text-base font-bold leading-snug">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-extrabold text-ink-900">{formatMoney(product.price, settings.currency)}</span>
          <button
            onClick={add}
            disabled={!product.available}
            className="btn-primary btn-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
