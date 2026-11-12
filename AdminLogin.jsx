import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import Logo from '../../components/Logo';
import { isValidEmail } from '../../utils/format';

export default function AdminLogin() {
  const { isAdmin, login } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const redirectTo = location.state?.from || '/admin';
  if (isAdmin) return <Navigate to={redirectTo} replace />;

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.email.trim()) err.email = 'Email is required.';
    else if (!isValidEmail(form.email.trim())) err.email = 'Enter a valid email address.';
    if (!form.password) err.password = 'Password is required.';
    if (!err.email && !err.password && !login(form.email, form.password)) {
      err.form = 'Invalid email or password.';
    }
    setErrors(err);
    if (Object.keys(err).length === 0) navigate(redirectTo, { replace: true });
  };

  const fill = () => {
    setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setErrors({});
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 p-4">
      <div className="w-full max-w-md animate-pop">
        <div className="mb-6 flex justify-center">
          <Logo settings={settings} light size="lg" />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-pop sm:p-8">
          <h1 className="text-2xl font-extrabold">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Manage your products, orders and customers.</p>

          <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Demo authentication only</p>
              <p className="mt-0.5 text-amber-800">
                This login is for demonstration and is <strong>not production-grade security</strong>. Credentials are checked in the browser.
              </p>
              <p className="mt-2 font-mono text-xs">
                {DEMO_CREDENTIALS.email}
                <br />
                {DEMO_CREDENTIALS.password}
              </p>
              <button type="button" onClick={fill} className="mt-2 text-xs font-bold text-amber-900 underline underline-offset-2">
                Fill demo credentials
              </button>
            </div>
          </div>

          <form noValidate onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@restaurant.com"
                />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>
            {errors.form && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                {errors.form}
              </p>
            )}
            <button type="submit" className="btn-primary btn-lg w-full">Sign in</button>
          </form>
        </div>
        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-ink-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </div>
  );
}
