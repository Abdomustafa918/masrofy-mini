import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './Status';

export default function ProtectedRoute() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <main className="dashboard-shell min-h-screen p-6"><LoadingState label={t('app.states.loading')} /></main>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
