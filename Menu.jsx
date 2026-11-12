import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, SearchX, ShoppingBag } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useDebounce } from '../../hooks/useDebounce';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';

export default function Menu() {
  const { products, categories, cartCount } = useStore();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 150);
  const category = params.get('category') || 'all';

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  }, [products, category, debounced]);

  const pill = (active) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
      active ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100'
    }`;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Our menu</h1>
        <p className="mt-2 text-ink-500">Freshly prepared and delivered hot. Add your favourites to the cart.</p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 border-b border-ink-100 bg-ink-50/90 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white/90 lg:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="input pl-10 pr-9"
              aria-label="Search dishes"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <button className={pill(category === 'all')} onClick={() => setCategory('all')}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} className={pill(category === c.id)} onClick={() => setCategory(c.id)}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 mt-6 text-sm text-ink-500">
        Showing <span className="font-semibold text-ink-800">{visible.length}</span> {visible.length === 1 ? 'dish' : 'dishes'}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No dishes found"
          text="Try a different search term or choose another category."
          action={
            <button
              className="btn-outline"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <Link
          to="/cart"
          className="btn-dark btn-lg fixed bottom-5 left-1/2 z-40 -translate-x-1/2 animate-slide-up shadow-pop sm:hidden"
        >
          <ShoppingBag className="h-5 w-5" /> View cart ({cartCount})
        </Link>
      )}
    </div>
  );
}
