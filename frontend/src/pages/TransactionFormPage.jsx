import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createTransaction } from '../api/transactionsApi';
import { ErrorState } from '../components/Status';

export default function TransactionFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', type: 'expense', category: '', note: '', transaction_date: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (Number(form.amount) <= 0) {
      setError(t('app.validation.positiveAmount'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTransaction({ ...form, amount: Number(form.amount), note: form.note || null });
      navigate('/transactions');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="culture-panel rounded-lg p-5">
      <h2 className="text-xl font-semibold">{t('app.transactions.new')}</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
        {error && <div className="md:col-span-2"><ErrorState message={error} /></div>}
        <input className="rounded-lg border px-3 py-2" type="number" step="0.01" min="0.01" placeholder={t('transactions.columns.amount')} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <select className="rounded-lg border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">{t('labels.expense')}</option>
          <option value="income">{t('labels.income')}</option>
        </select>
        <input className="rounded-lg border px-3 py-2" placeholder={t('transactions.columns.category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="rounded-lg border px-3 py-2" type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} required />
        <textarea className="rounded-lg border px-3 py-2 md:col-span-2" placeholder={t('app.fields.note')} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button className="rounded-lg px-4 py-2 font-semibold text-white md:col-span-2" style={{ background: 'var(--culture-primary)' }} disabled={loading}>{loading ? t('app.states.loading') : t('app.actions.save')}</button>
      </form>
    </section>
  );
}
