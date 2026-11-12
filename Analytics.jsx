import { useMemo, useState } from 'react';
import { CalendarDays, CalendarRange, CalendarClock, Wallet } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import StatCard from '../../components/StatCard';
import {
  bestSellers,
  categoryRevenue,
  periodRevenue,
  revenueByDay,
  revenueByMonth,
  revenueByWeek,
  statusDistribution,
  totals,
} from '../../utils/analytics';
import { formatMoney } from '../../utils/format';
import { chartTooltipStyle } from './Dashboard';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Confirmed: '#0ea5e9',
  Preparing: '#8b5cf6',
  'Out for Delivery': '#6366f1',
  Completed: '#10b981',
  Cancelled: '#ef4444',
};
const CAT_COLORS = ['#f97316', '#334155', '#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const RANGES = [
  { id: 'daily', label: 'Daily', note: 'Last 30 days' },
  { id: 'weekly', label: 'Weekly', note: 'Last 8 weeks' },
  { id: 'monthly', label: 'Monthly', note: 'Last 6 months' },
];

export default function Analytics() {
  const { orders, products, categories, settings } = useStore();
  const cur = settings.currency;
  const [range, setRange] = useState('daily');

  const t = useMemo(() => totals(orders), [orders]);
  const period = useMemo(() => periodRevenue(orders), [orders]);
  const trend = useMemo(() => {
    if (range === 'weekly') return revenueByWeek(orders, 8);
    if (range === 'monthly') return revenueByMonth(orders, 6);
    return revenueByDay(orders, 30);
  }, [orders, range]);
  const status = useMemo(() => statusDistribution(orders), [orders]);
  const top = useMemo(() => bestSellers(orders, 8).map((p) => ({ ...p, short: p.name.length > 18 ? p.name.slice(0, 17) + '…' : p.name })), [orders]);
  const byCat = useMemo(() => categoryRevenue(orders, products, categories), [orders, products, categories]);
  const rangeTotal = trend.reduce((s, r) => s + r.revenue, 0);
  const active = RANGES.find((r) => r.id === range);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today’s revenue" value={formatMoney(period.day, cur)} icon={CalendarClock} tone="brand" />
        <StatCard label="This week" value={formatMoney(period.week, cur)} icon={CalendarDays} tone="sky" hint="Since Monday" />
        <StatCard label="This month" value={formatMoney(period.month, cur)} icon={CalendarRange} tone="violet" />
        <StatCard label="Total sales" value={formatMoney(t.revenue, cur)} icon={Wallet} tone="emerald" hint={`${t.validCount} paid orders`} />
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold">Revenue trend</h2>
            <p className="text-sm text-ink-500">
              {active.note} · <span className="font-semibold text-ink-800">{formatMoney(rangeTotal, cur)}</span> total
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-ink-100 p-1" role="tablist">
            {RANGES.map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={range === r.id}
                onClick={() => setRange(r.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${range === r.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={16} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => (n === 'revenue' ? [formatMoney(v, cur), 'Revenue'] : [v, 'Orders'])} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold">Order distribution</h2>
          <p className="text-sm text-ink-500">Orders by status</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={status} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none">
                  {status.map((s) => (
                    <Cell key={s.name} fill={STATUS_COLORS[s.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => [`${v} orders`, n]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">Revenue by category</h2>
          <p className="text-sm text-ink-500">Share of total sales</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" outerRadius="80%" paddingAngle={2} stroke="none">
                  {byCat.map((c, i) => (
                    <Cell key={c.name} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => [formatMoney(v, cur), n]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h2 className="font-bold">Best-selling products</h2>
        <p className="text-sm text-ink-500">Top 8 by units sold</p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="short" width={120} tick={{ fontSize: 11, fill: '#334155' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} formatter={(v, n, p) => [`${v} units · ${formatMoney(p.payload.revenue, cur)}`, p.payload.name]} />
              <Bar dataKey="quantity" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
