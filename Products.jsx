import { useMemo, useRef, useState } from 'react';
import { Plus, Search, Pencil, Trash2, UtensilsCrossed, Upload, ImageOff, Star } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import ProductImage from '../../components/ProductImage';
import { formatMoney } from '../../utils/format';
import { fileToResizedDataUrl } from '../../utils/image';

const EMOJIS = ['🍔', '🍕', '🍖', '🥗', '🍰', '🥤', '🍟', '🍗', '🥩', '🍢', '🐟', '🦐', '🍝', '🌮', '🌯', '🥙', '🍜', '🍲', '🍣', '🥪', '🍩', '🍦', '☕', '🍊'];
const COLORS = ['#f97316', '#dc2626', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#78350f', '#475569'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  emoji: '🍽️',
  color: '#f97316',
  image: '',
  available: true,
  featured: false,
};

function ProductForm({ initial, categories, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    else if (form.name.trim().length > 60) e.name = 'Name must be 60 characters or fewer.';
    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price)) e.price = 'Enter a valid price.';
    else if (price <= 0) e.price = 'Price must be greater than 0.';
    else if (price > 100000) e.price = 'Price is too high.';
    if (!form.category) e.category = 'Choose a category.';
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.';
    else if (form.description.length > 220) e.description = 'Description must be 220 characters or fewer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFile = async (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const url = await fileToResizedDataUrl(file);
      set('image', url);
      setErrors((e) => ({ ...e, image: undefined }));
    } catch (err) {
      setErrors((e) => ({ ...e, image: err.message }));
    } finally {
      setUploading(false);
    }
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Math.round(Number(form.price) * 100) / 100,
    });
  };

  const preview = { ...form, name: form.name || 'Preview' };

  return (
    <form id="product-form" noValidate onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="label">Product image</p>
          <div className="group aspect-square overflow-hidden rounded-2xl border border-ink-200">
            <ProductImage product={preview} emojiSize="text-7xl" />
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-outline btn-sm flex-1" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
            {form.image && (
              <button type="button" className="btn-ghost btn-sm" onClick={() => set('image', '')}>
                <ImageOff className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} aria-label="Upload product image" />
          {errors.image && <p className="field-error">{errors.image}</p>}
        </div>

        <div className="space-y-4 sm:col-span-3">
          <div>
            <label htmlFor="pname" className="label">Name *</label>
            <input id="pname" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Spicy Chicken Wrap" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pprice" className="label">Price *</label>
              <input id="pprice" type="number" min="0" step="0.5" inputMode="decimal" className={`input ${errors.price ? 'input-error' : ''}`} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0.00" />
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="pcat" className="label">Category *</label>
              <select id="pcat" className={`input ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="pdesc" className="label">Description *</label>
            <textarea id="pdesc" rows={3} className={`input ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the dish, ingredients and taste…" />
            <div className="mt-1 flex justify-between">
              {errors.description ? <p className="field-error">{errors.description}</p> : <span />}
              <span className="text-xs text-ink-400">{form.description.length}/220</span>
            </div>
          </div>
        </div>
      </div>

      {!form.image && (
        <div className="rounded-2xl bg-ink-50 p-4">
          <p className="label">Or pick an illustration</p>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map((em) => (
              <button
                type="button"
                key={em}
                onClick={() => set('emoji', em)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition ${form.emoji === em ? 'bg-brand-500 ring-2 ring-brand-300' : 'bg-white hover:bg-ink-100'}`}
                aria-label={`Use ${em}`}
                aria-pressed={form.emoji === em}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set('color', c)}
                className={`h-7 w-7 rounded-full ring-offset-2 transition ${form.color === c ? 'ring-2 ring-ink-800' : ''}`}
                style={{ background: c }}
                aria-label={`Color ${c}`}
                aria-pressed={form.color === c}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" className="h-5 w-5 rounded border-ink-300 text-brand-500 focus:ring-brand-400" checked={form.available} onChange={(e) => set('available', e.target.checked)} />
          <span className="text-sm font-semibold">Available for ordering</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" className="h-5 w-5 rounded border-ink-300 text-brand-500 focus:ring-brand-400" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          <span className="text-sm font-semibold">Featured on homepage</span>
        </label>
      </div>
    </form>
  );
}

export default function Products() {
  const { products, categories, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [toDelete, setToDelete] = useState(null);
  const cur = settings.currency;

  const catName = (id) => categories.find((c) => c.id === id)?.name || '—';

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (availability === 'available' && !p.available) return false;
      if (availability === 'unavailable' && p.available) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  }, [products, query, category, availability]);

  const save = (data) => {
    if (editing === 'new') {
      addProduct(data);
      toast(`“${data.name}” added to the menu`);
    } else {
      updateProduct(editing.id, data);
      toast(`“${data.name}” updated`);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">{products.length} products across {categories.length} categories</p>
        <button className="btn-primary" onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type="search" className="input pl-10" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
        </div>
        <select className="input md:w-48" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="input md:w-44" value={availability} onChange={(e) => setAvailability(e.target.value)} aria-label="Filter by availability">
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No products match"
          text="Try changing your search or filters, or add a new product."
          action={<button className="btn-outline" onClick={() => { setQuery(''); setCategory('all'); setAvailability('all'); }}>Reset filters</button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {visible.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                          <ProductImage product={p} emojiSize="text-2xl" />
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-bold">
                            {p.name}
                            {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
                          </p>
                          <p className="truncate text-xs text-ink-400 sm:hidden">{catName(p.category)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{catName(p.category)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatMoney(p.price, cur)}</td>
                    <td className="px-4 py-3">
                      <button
                        role="switch"
                        aria-checked={p.available}
                        aria-label={`Toggle availability of ${p.name}`}
                        onClick={() => {
                          updateProduct(p.id, { available: !p.available });
                          toast(`${p.name} is now ${p.available ? 'unavailable' : 'available'}`, 'info');
                        }}
                        className={`relative h-6 w-11 rounded-full transition ${p.available ? 'bg-emerald-500' : 'bg-ink-300'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${p.available ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600" onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add product' : 'Edit product'}
        size="lg"
        footer={
          <>
            <button className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary" type="submit" form="product-form">
              {editing === 'new' ? 'Add product' : 'Save changes'}
            </button>
          </>
        }
      >
        {editing && (
          <ProductForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? { ...emptyForm, category: '' } : { ...emptyForm, ...editing, price: String(editing.price) }}
            categories={categories}
            onSubmit={save}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete product"
        message={toDelete ? `Are you sure you want to delete “${toDelete.name}”? Past orders will keep their history. This cannot be undone.` : ''}
        onConfirm={() => {
          deleteProduct(toDelete.id);
          toast(`“${toDelete.name}” deleted`, 'info');
        }}
      />
    </div>
  );
}
