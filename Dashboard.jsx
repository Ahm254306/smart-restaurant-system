import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, UtensilsCrossed, Users, TrendingUp, ArrowRight } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { bestSellers, revenueByDay, totals } from '../../utils/analytics';
import { formatMoney, timeAgo } from '../../utils/format';

export const chartTooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
  fontSize: 12,
};

export default function Dashboard() {
  const { orders, products, customers, settings } = useStore();
  const cur = settings.currency;

  const t = useMemo(() => totals(orders), [orders]);
  const daily = useMemo(() => revenueByDay(orders, 14), [orders]);
  const top = useMemo(() => bestSellers(orders, 5), [orders]);
  const recent = orders.slice(0, 6);
  const maxQty = top[0]?.quantity || 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total revenue" value={formatMoney(t.revenue, cur)} icon={DollarSign} tone="emerald" hint="Excludes cancelled orders" />
        <StatCard label="Total orders" value={t.orderCount.toLocaleString()} icon={ShoppingCart} tone="brand" hint={`${t.validCount} not cancelled`} />
        <StatCard label="Total products" value={products.length} icon={UtensilsCrossed} tone="violet" hint={`${products.filter((p) => p.available).length} available`} />
        <StatCard label="Total customers" value={customers.length} icon={Users} tone="sky" />
        <StatCard label="Avg. order value" value={formatMoney(Math.round(t.avg), cur)} icon={TrendingUp} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold">Revenue – last 14 days</h2>
          <p className="text-sm text-ink-500">Daily revenue from non-cancelled orders</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [formatMoney(v, cur), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">Orders – last 14 days</h2>
          <p className="text-sm text-ink-500">Number of orders received per day</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} formatter={(v) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="card p-5 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Recent orders</h2>
            <Link to="/admin/orders" className="btn-ghost btn-sm">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink-100">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {o.number} · {o.customer.name}
                  </p>
                  <p className="text-xs text-ink-400">
                    {o.items.reduce((s, i) => s + i.quantity, 0)} items · {timeAgo(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="w-24 text-right text-sm font-bold">{formatMoney(o.total, cur)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 xl:col-span-2">
          <h2 className="font-bold">Best-selling products</h2>
          <p className="text-sm text-ink-500">By units sold</p>
          <ol className="mt-4 space-y-4">
            {top.map((p, i) => (
              <li key={p.productId}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <span className="truncate font-semibold">{p.name}</span>
                  </span>
                  <span className="shrink-0 text-ink-500">{p.quantity} sold</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(p.quantity / maxQty) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
