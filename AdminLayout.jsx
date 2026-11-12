import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  Globe,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: UtensilsCrossed },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AdminLayout() {
  const { settings, orders } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const pending = orders.filter((o) => o.status === 'Pending').length;

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const current = nav.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-900 text-ink-300">
      <div className="flex h-16 items-center border-b border-ink-800 px-5">
        <Logo settings={settings} light />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-brand-500 text-white shadow-sm' : 'hover:bg-ink-800 hover:text-white'
              }`
            }
          >
            <n.icon className="h-5 w-5" />
            <span className="flex-1">{n.label}</span>
            {n.to === '/admin/orders' && pending > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-brand-700">{pending}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-ink-800 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-ink-800 hover:text-white">
          <Globe className="h-5 w-5" /> View website
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-ink-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-ink-900/60" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64 animate-pop">{sidebar}</div>
        </div>
      )}

      <div className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-ink-100 bg-white/85 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
            <h1 className="text-lg font-bold">{current?.label || 'Admin'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:inline">
              Demo mode
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                A
              </div>
              <span className="hidden text-sm font-semibold sm:inline">Admin</span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
