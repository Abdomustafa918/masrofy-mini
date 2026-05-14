import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, CircleDollarSign, Landmark, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDashboardSummary } from '../api/dashboardApi';
import { useCulture } from '../context/CultureContext';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import { ErrorState, LoadingState, EmptyState } from '../components/Status';

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <section className="culture-panel rounded-lg p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-culture">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-normal">{value}</p>
        </div>
        <span className="surface-soft flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-culture">{helper}</p>
    </section>
  );
}

function CulturePreviewCard() {
  const { t } = useTranslation();
  const { culture } = useCulture();

  return (
    <section className="culture-panel rounded-lg p-5">
      <p className="text-sm font-medium text-muted-culture">{t('preview.eyebrow')}</p>
      <h2 className="mt-2 text-xl font-semibold">{t('preview.title')}</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><dt className="text-xs uppercase text-muted-culture">{t('preview.language')}</dt><dd className="mt-1 font-medium">{t(`cultures.${culture.code}.language`)}</dd></div>
        <div><dt className="text-xs uppercase text-muted-culture">{t('preview.country')}</dt><dd className="mt-1 font-medium">{t(`cultures.${culture.code}.country`)}</dd></div>
        <div><dt className="text-xs uppercase text-muted-culture">{t('preview.currency')}</dt><dd className="mt-1 font-medium">{culture.currencyCode}</dd></div>
        <div><dt className="text-xs uppercase text-muted-culture">{t('preview.date')}</dt><dd className="mt-1 font-medium">{formatDate(new Date())}</dd></div>
      </dl>
      <div className="surface-soft mt-5 rounded-lg p-4">
        <p className="text-xs uppercase text-muted-culture">{t('preview.amount')}</p>
        <p className="mt-2 text-2xl font-semibold">{formatCurrency(2480.75)}</p>
      </div>
    </section>
  );
}

function SampleCategories() {
  const { t } = useTranslation();
  const { culture } = useCulture();
  return (
    <section className="culture-panel rounded-lg p-5">
      <p className="text-sm font-medium text-muted-culture">{t('categories.eyebrow')}</p>
      <h2 className="mt-2 text-xl font-semibold">{t('categories.title')}</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {culture.sampleCategories.map((category, index) => (
          <span key={category} className="surface-soft rounded-lg px-3 py-2 text-sm font-medium">
            {t(`categories.samples.${culture.code}.${index}`)}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label={t('app.states.loading')} />;
  if (error) return <ErrorState message={error} />;
  if (!summary) return <EmptyState message={t('app.states.empty')} />;

  const monthlyData = summary.monthly_income_vs_expenses.map((item) => ({
    ...item,
    month: t(`months.${item.month}`, { defaultValue: item.month }),
  }));

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Landmark} label={t('stats.balance')} value={formatCurrency(summary.balance)} helper={t('stats.balanceHelper')} />
        <StatCard icon={TrendingUp} label={t('stats.income')} value={formatCurrency(summary.total_income)} helper={t('stats.incomeHelper')} />
        <StatCard icon={CircleDollarSign} label={t('stats.expenses')} value={formatCurrency(summary.total_expenses)} helper={t('stats.expensesHelper')} />
        <StatCard icon={CalendarDays} label={t('stats.savings')} value={`${formatNumber(summary.savings)}%`} helper={t('stats.savingsHelper')} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CulturePreviewCard />
        <SampleCategories />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <section className="culture-panel rounded-lg p-5">
          <p className="text-sm font-medium text-muted-culture">{t('charts.cashflowEyebrow')}</p>
          <h2 className="mt-2 text-xl font-semibold">{t('charts.cashflowTitle')}</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid stroke="var(--culture-border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--culture-muted)" />
                <YAxis stroke="var(--culture-muted)" tickFormatter={(value) => formatNumber(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="income" name={t('labels.income')} stroke="var(--culture-primary)" fill="var(--culture-surfaceSoft)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" name={t('labels.expenses')} stroke="var(--culture-secondary)" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="culture-panel rounded-lg p-5">
          <p className="text-sm font-medium text-muted-culture">{t('charts.spendingEyebrow')}</p>
          <h2 className="mt-2 text-xl font-semibold">{t('charts.spendingTitle')}</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.expenses_by_category}>
                <CartesianGrid stroke="var(--culture-border)" strokeDasharray="3 3" />
                <XAxis dataKey="category" stroke="var(--culture-muted)" />
                <YAxis stroke="var(--culture-muted)" tickFormatter={(value) => formatNumber(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" name={t('labels.expenses')} fill="var(--culture-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
