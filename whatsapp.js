import { formatMoney, digitsOnly } from './format';

export function buildWhatsAppMessage({ settings, items, customer, notes, subtotal, deliveryFee, total, orderNumber }) {
  const cur = settings.currency;
  const lines = [];
  lines.push(`*New Order – ${settings.restaurantName}*`);
  if (orderNumber) lines.push(`Order #: ${orderNumber}`);
  lines.push('');
  lines.push('*Items*');
  items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name} × ${it.quantity} = ${formatMoney(it.price * it.quantity, cur)}`);
  });
  lines.push('');
  lines.push(`Subtotal: ${formatMoney(subtotal, cur)}`);
  lines.push(`Delivery: ${formatMoney(deliveryFee, cur)}`);
  lines.push(`*Total: ${formatMoney(total, cur)}*`);
  lines.push('');
  lines.push('*Customer details*');
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push(`Address: ${customer.address}`);
  if (notes && notes.trim()) {
    lines.push(`Notes: ${notes.trim()}`);
  }
  return lines.join('\n');
}

export function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;
}
