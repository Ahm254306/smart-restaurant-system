export function formatMoney(amount, currency = 'EGP') {
  const n = Number(amount) || 0;
  const formatted = n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return `${formatted} ${currency}`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return `${formatDate(iso)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function dayKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export function uid(prefix = 'id') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

// Validation helpers
export function isValidPhone(phone) {
  const digits = String(phone).replace(/[\s\-()+]/g, '');
  return /^\d{10,15}$/.test(digits);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function digitsOnly(phone) {
  return String(phone).replace(/\D/g, '');
}
