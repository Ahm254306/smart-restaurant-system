import { useRef, useState } from 'react';
import { Save, Upload, ImageOff, RotateCcw } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import ConfirmDialog from '../../components/ConfirmDialog';
import Logo from '../../components/Logo';
import { fileToResizedDataUrl } from '../../utils/image';
import { isValidEmail, isValidPhone } from '../../utils/format';

const CURRENCIES = ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'QAR'];

export default function Settings() {
  const { settings, updateSettings, resetDemoData } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(() => ({ ...settings, openingHours: settings.openingHours.map((h) => ({ ...h })) }));
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const setHour = (i, patch) => {
    setForm((f) => ({ ...f, openingHours: f.openingHours.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) }));
    if (errors.hours) setErrors((e) => ({ ...e, hours: undefined }));
  };

  const onLogo = async (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    try {
      set('logo', await fileToResizedDataUrl(file, 160, 0.9));
    } catch (err) {
      setErrors((e) => ({ ...e, logo: err.message }));
    }
  };

  const validate = () => {
    const e = {};
    if (form.restaurantName.trim().length < 2) e.restaurantName = 'Restaurant name must be at least 2 characters.';
    if (!isValidPhone(form.phone)) e.phone = 'Enter a valid contact number (10–15 digits).';
    if (!isValidPhone(form.whatsapp)) e.whatsapp = 'Enter a valid WhatsApp number with country code, e.g. 201001234567.';
    if (form.address.trim().length < 8) e.address = 'Please enter the full address.';
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!CURRENCIES.includes(form.currency)) e.currency = 'Choose a currency.';
    const fee = Number(form.deliveryFee);
    if (form.deliveryFee === '' || Number.isNaN(fee) || fee < 0) e.deliveryFee = 'Delivery fee must be 0 or more.';
    const badHour = form.openingHours.find((h) => !h.closed && (!h.open || !h.close || h.open >= h.close));
    if (badHour) e.hours = `${badHour.day}: closing time must be after opening time.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fix the highlighted fields.', 'error');
      return;
    }
    updateSettings({
      ...form,
      restaurantName: form.restaurantName.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      email: form.email.trim(),
      deliveryFee: Number(form.deliveryFee),
    });
    toast('Settings saved');
  };

  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <form noValidate onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Restaurant profile</h2>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row">
          <div className="shrink-0">
            <p className="label">Logo</p>
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-ink-50">
              {form.logo ? <img src={form.logo} alt="Logo preview" className="h-full w-full object-cover" /> : <Logo settings={{ ...form, restaurantName: '' }} />}
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" className="btn-outline btn-sm" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Upload</button>
              {form.logo && <button type="button" className="btn-ghost btn-sm" onClick={() => set('logo', '')} aria-label="Remove logo"><ImageOff className="h-4 w-4" /></button>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} aria-label="Upload logo" />
            {errors.logo && <p className="field-error">{errors.logo}</p>}
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="sname" className="label">Restaurant name *</label>
              <input id="sname" className={cls('restaurantName')} value={form.restaurantName} onChange={(e) => set('restaurantName', e.target.value)} />
              {errors.restaurantName && <p className="field-error">{errors.restaurantName}</p>}
            </div>
            <div>
              <label htmlFor="sphone" className="label">Contact number *</label>
              <input id="sphone" type="tel" className={cls('phone')} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="swa" className="label">WhatsApp number *</label>
              <input id="swa" type="tel" className={cls('whatsapp')} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="201001234567" />
              {errors.whatsapp ? <p className="field-error">{errors.whatsapp}</p> : <p className="mt-1 text-xs text-ink-400">International format, no “+” (used for WhatsApp orders).</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="semail" className="label">Email *</label>
              <input id="semail" type="email" className={cls('email')} value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="saddr" className="label">Address *</label>
              <textarea id="saddr" rows={2} className={cls('address')} value={form.address} onChange={(e) => set('address', e.target.value)} />
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Pricing</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="scur" className="label">Currency *</label>
            <select id="scur" className={cls('currency')} value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.currency && <p className="field-error">{errors.currency}</p>}
          </div>
          <div>
            <label htmlFor="sfee" className="label">Delivery fee *</label>
            <input id="sfee" type="number" min="0" step="0.5" className={cls('deliveryFee')} value={form.deliveryFee} onChange={(e) => set('deliveryFee', e.target.value)} />
            {errors.deliveryFee && <p className="field-error">{errors.deliveryFee}</p>}
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Opening hours</h2>
        <ul className="mt-4 divide-y divide-ink-100">
          {form.openingHours.map((h, i) => (
            <li key={h.day} className="flex flex-wrap items-center gap-3 py-3">
              <span className="w-28 text-sm font-semibold">{h.day}</span>
              <input type="time" className="input w-32" value={h.open} disabled={h.closed} onChange={(e) => setHour(i, { open: e.target.value })} aria-label={`${h.day} opening time`} />
              <span className="text-ink-400">to</span>
              <input type="time" className="input w-32" value={h.close} disabled={h.closed} onChange={(e) => setHour(i, { close: e.target.value })} aria-label={`${h.day} closing time`} />
              <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" checked={h.closed} onChange={(e) => setHour(i, { closed: e.target.checked })} />
                Closed
              </label>
            </li>
          ))}
        </ul>
        {errors.hours && <p className="field-error">{errors.hours}</p>}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-outline" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="h-4 w-4" /> Reset demo data
        </button>
        <button type="submit" className="btn-primary btn-lg"><Save className="h-5 w-5" /> Save settings</button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data"
        confirmLabel="Reset everything"
        message="This restores the original demo products, orders, customers and settings. Any changes you made will be lost."
        onConfirm={() => {
          resetDemoData();
          toast('Demo data restored', 'info');
          setTimeout(() => window.location.reload(), 400);
        }}
      />
    </form>
  );
}
