import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, WalletCards } from 'lucide-react';
import CultureSelector from './CultureSelector';
import { useAuth } from '../context/AuthContext';

const navItems = [
  ['dashboard', '/dashboard'],
  ['transactions', '/transactions'],
  ['budgets', '/budgets'],
  ['reports', '/reports'],
  ['settings', '/settings'],
];

export default function Layout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="dashboard-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="culture-panel rounded-lg px-5 py-4">
          <nav className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <span className="surface-soft flex h-12 w-12 items-center justify-center rounded-lg">
                <WalletCards className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-culture">{t('navbar.eyebrow')}</p>
                <h1 className="text-2xl font-semibold">{t('navbar.brand')}</h1>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-wrap gap-2">
                {navItems.map(([key, path]) => (
                  <NavLink
                    key={key}
                    to={path}
                    className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'surface-soft' : 'text-muted-culture'}`}
                  >
                    {t(`app.nav.${key}`)}
                  </NavLink>
                ))}
              </div>
              <CultureSelector />
              <button type="button" onClick={onLogout} className="surface-soft flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t('app.auth.logout')}
              </button>
            </div>
          </nav>
          <p className="mt-3 text-sm text-muted-culture">{user?.full_name}</p>
        </header>
        <Outlet />
      </div>
    </main>
  );
}
