import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createBudget, getBudgets, getCurrentBudget, updateBudget } from '../api/budgetsApi';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { EmptyState, ErrorState, LoadingState } from '../components/Status';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const today = new Date();
  const [budgets, setBudgets] = useState([]);
  const [current, setCurrent] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [budgetRows, currentBudget] = await Promise.all([getBudgets(), getCurrentBudget()]);
      setBudgets(budgetRows);
      setCurrent(currentBudget);
      setAmount(currentBudget.budget?.amount ?? '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (Number(amount) <= 0) {
      setError(t('app.validation.positiveAmount'));
      return;
    }
    const payload = { month: today.getMonth() + 1, year: today.getFullYear(), amount: Number(amount) };
    try {
      if (current?.budget?.id) await updateBudget(current.budget.id, payload);
      else await createBudget(payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingState label={t('app.states.loading')} />;

  const budgetAmount = current?.budget?.amount ?? 0;
  const spent = current?.spent ?? 0;
  const remaining = current?.remaining ?? 0;
  const progress = budgetAmount ? Math.min((spent / budgetAmount) * 100, 100) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="culture-panel rounded-lg p-5">
        <h2 className="text-xl font-semibold">{t('app.budgets.current')}</h2>
        {error && <div className="mt-4"><ErrorState message={error} /></div>}
        <div className="mt-5 space-y-4">
          <div className="surface-soft rounded-lg p-4">
            <p className="text-sm text-muted-culture">{t('app.budgets.amount')}</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(budgetAmount)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4"><p className="text-sm text-muted-culture">{t('app.budgets.spent')}</p><p className="mt-1 font-semibold">{formatCurrency(spent)}</p></div>
            <div className="rounded-lg border p-4"><p className="text-sm text-muted-culture">{t('app.budgets.remaining')}</p><p className="mt-1 font-semibold">{formatCurrency(remaining)}</p></div>
          </div>
          <div className="h-3 overflow-hidden rounded-full surface-soft">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'var(--culture-primary)' }} />
          </div>
          <p className="text-sm text-muted-culture">{formatNumber(progress)}%</p>
        </div>
        <form onSubmit={save} className="mt-6 flex gap-3">
          <input className="min-w-0 flex-1 rounded-lg border px-3 py-2" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('app.budgets.amount')} />
          <button className="rounded-lg px-4 py-2 font-semibold text-white" style={{ background: 'var(--culture-primary)' }}>{t('app.actions.save')}</button>
        </form>
      </section>

      <section className="culture-panel rounded-lg p-5">
        <h2 className="text-xl font-semibold">{t('app.budgets.history')}</h2>
        {budgets.length === 0 ? <div className="mt-4"><EmptyState message={t('app.states.empty')} /></div> : (
          <div className="mt-5 grid gap-3">
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between rounded-lg border p-4">
                <span>{budget.month}/{budget.year}</span>
                <strong>{formatCurrency(budget.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
