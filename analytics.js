import { dayKey, startOfWeek } from './format';

const isValid = (o) => o.status !== 'Cancelled';

export function totals(orders) {
  const valid = orders.filter(isValid);
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  return {
    revenue,
    orderCount: orders.length,
    validCount: valid.length,
    avg: valid.length ? revenue / valid.length : 0,
  };
}

export function revenueByDay(orders, days = 14) {
  const map = new Map();
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const row = {
      key,
      label: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      revenue: 0,
      orders: 0,
    };
    map.set(key, row);
    out.push(row);
  }
  orders.forEach((o) => {
    const row = map.get(dayKey(o.createdAt));
    if (!row) return;
    row.orders += 1;
    if (isValid(o)) row.revenue += o.total;
  });
  return out;
}

export function revenueByWeek(orders, weeks = 8) {
  const out = [];
  const map = new Map();
  const thisWeek = startOfWeek(new Date());
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(thisWeek);
    d.setDate(d.getDate() - i * 7);
    const key = dayKey(d);
    const row = { key, label: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), revenue: 0, orders: 0 };
    map.set(key, row);
    out.push(row);
  }
  orders.forEach((o) => {
    const row = map.get(dayKey(startOfWeek(o.createdAt)));
    if (!row) return;
    row.orders += 1;
    if (isValid(o)) row.revenue += o.total;
  });
  return out;
}

export function revenueByMonth(orders, months = 6) {
  const out = [];
  const map = new Map();
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const row = { key, label: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }), revenue: 0, orders: 0 };
    map.set(key, row);
    out.push(row);
  }
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const row = map.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (!row) return;
    row.orders += 1;
    if (isValid(o)) row.revenue += o.total;
  });
  return out;
}

export function statusDistribution(orders) {
  const map = {};
  orders.forEach((o) => {
    map[o.status] = (map[o.status] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function channelDistribution(orders) {
  const map = {};
  orders.forEach((o) => {
    map[o.channel || 'Website'] = (map[o.channel || 'Website'] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function bestSellers(orders, limit = 5) {
  const map = new Map();
  orders.filter(isValid).forEach((o) => {
    o.items.forEach((it) => {
      const cur = map.get(it.productId) || { productId: it.productId, name: it.name, quantity: 0, revenue: 0 };
      cur.quantity += it.quantity;
      cur.revenue += it.price * it.quantity;
      map.set(it.productId, cur);
    });
  });
  return [...map.values()].sort((a, b) => b.quantity - a.quantity).slice(0, limit);
}

export function categoryRevenue(orders, products, categories) {
  const prodCat = new Map(products.map((p) => [p.id, p.category]));
  const catName = new Map(categories.map((c) => [c.id, c.name]));
  const map = new Map();
  orders.filter(isValid).forEach((o) => {
    o.items.forEach((it) => {
      const name = catName.get(prodCat.get(it.productId)) || 'Other';
      map.set(name, (map.get(name) || 0) + it.price * it.quantity);
    });
  });
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function periodRevenue(orders) {
  const now = new Date();
  const todayKey = dayKey(now);
  const weekStart = startOfWeek(now).getTime();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  let day = 0;
  let week = 0;
  let month = 0;
  orders.filter(isValid).forEach((o) => {
    const t = new Date(o.createdAt).getTime();
    if (dayKey(o.createdAt) === todayKey) day += o.total;
    if (t >= weekStart) week += o.total;
    if (t >= monthStart) month += o.total;
  });
  return { day, week, month };
}
