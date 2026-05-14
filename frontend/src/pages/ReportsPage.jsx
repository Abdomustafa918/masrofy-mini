import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardSummary } from '../api/dashboardApi';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { ErrorState, LoadingState } from '../components/Status';

export default function ReportsPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!summary) return <LoadingState label={t('app.states.loading')} />;

  return (
    <section className="culture-panel rounded-lg p-5">
      <p className="text-sm font-medium text-muted-culture">{t('app.nav.reports')}</p>
      <h2 className="mt-2 text-xl font-semibold">{t('app.reports.title')}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="surface-soft rounded-lg p-4"><p className="text-sm text-muted-culture">{t('stats.income')}</p><p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.total_income)}</p></div>
        <div className="surface-soft rounded-lg p-4"><p className="text-sm text-muted-culture">{t('stats.expenses')}</p><p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.total_expenses)}</p></div>
        <div className="surface-soft rounded-lg p-4"><p className="text-sm text-muted-culture">{t('stats.savings')}</p><p className="mt-1 text-2xl font-semibold">{formatNumber(summary.savings)}%</p></div>
      </div>
    </section>
  );
}
