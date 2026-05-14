import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CultureSelector from '../components/CultureSelector';
import { ErrorState } from '../components/Status';
import { useAuth } from '../context/AuthContext';
import { useCulture } from '../context/CultureContext';

function AuthShell({ children, title, subtitle }) {
  const { t } = useTranslation();
  return (
    <main className="dashboard-shell flex min-h-screen items-center justify-center px-4 py-8">
      <section className="culture-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-culture">{t('navbar.brand')}</p>
            <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-culture">{subtitle}</p>
          </div>
        </div>
        <CultureSelector />
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}

export function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title={t('app.auth.loginTitle')} subtitle={t('app.auth.loginSubtitle')}>
      <form onSubmit={submit} className="space-y-4">
        {error && <ErrorState message={error} />}
        <input className="w-full rounded-lg border bg-white px-3 py-2" type="email" placeholder={t('app.fields.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-lg border bg-white px-3 py-2" type="password" placeholder={t('app.fields.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full rounded-lg px-4 py-2 font-semibold text-white" style={{ background: 'var(--culture-primary)' }} disabled={loading}>
          {loading ? t('app.states.loading') : t('app.auth.login')}
        </button>
        <p className="text-center text-sm text-muted-culture">
          {t('app.auth.needAccount')} <Link className="font-semibold" to="/register">{t('app.auth.register')}</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const { cultureCode } = useCulture();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        preferred_culture: cultureCode || 'en-US',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title={t('app.auth.registerTitle')} subtitle={t('app.auth.registerSubtitle')}>
      <form onSubmit={submit} className="space-y-4">
        {error && <ErrorState message={error} />}
        <input className="w-full rounded-lg border bg-white px-3 py-2" placeholder={t('app.fields.fullName')} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input className="w-full rounded-lg border bg-white px-3 py-2" type="email" placeholder={t('app.fields.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-lg border bg-white px-3 py-2" type="password" minLength={8} placeholder={t('app.fields.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full rounded-lg px-4 py-2 font-semibold text-white" style={{ background: 'var(--culture-primary)' }} disabled={loading}>
          {loading ? t('app.states.loading') : t('app.auth.createAccount')}
        </button>
        <p className="text-center text-sm text-muted-culture">
          {t('app.auth.haveAccount')} <Link className="font-semibold" to="/login">{t('app.auth.login')}</Link>
        </p>
      </form>
    </AuthShell>
  );
}
