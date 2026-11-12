import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, X, Phone, MapPin, Mail, LayoutDashboard } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import Logo from '../components/Logo';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/cart', label: 'Cart' },
];

export default function CustomerLayout() {
  const { settings, cartCount } = useStore();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-lg">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Home">
            <Logo settings={settings} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/admin" className="btn-ghost btn-sm hidden sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
            <Link to="/cart" className="btn-primary btn-sm relative" aria-label="Open cart">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand-700">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="btn-ghost p-2 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="animate-fade-in border-t border-ink-100 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/admin" className={linkClass}>
                Admin Dashboard
              </NavLink>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 bg-ink-900 text-ink-300">
        <div className="container-page grid gap-10 py-12 md:grid-cols-3">
          <div>
            <Logo settings={settings} light />
            <p className="mt-4 max-w-xs text-sm text-ink-400">
              Fresh ingredients, bold flavours and fast delivery. Order online or through WhatsApp in under a minute.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Quick links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white" to="/">Home</Link></li>
              <li><Link className="hover:text-white" to="/menu">Menu</Link></li>
              <li><Link className="hover:text-white" to="/cart">Cart</Link></li>
              <li><Link className="hover:text-white" to="/admin/login">Admin login (demo)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.phone}</li>
              <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.email}</li>
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-800 py-5 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} {settings.restaurantName}. Demo project – all data is stored locally in your browser.
        </div>
      </footer>
    </div>
  );
}
