import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteTransaction, getTransactions, updateTransaction } from '../api/transactionsApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EmptyState, ErrorState, LoadingState } from '../components/Status';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', from_date: '', to_date: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getTransactions(filters)
      .then(setTransactions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await deleteTransaction(id);
    load();
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    await updateTransaction(editing.id, {
      amount: Number(editing.amount),
      type: editing.type,
      category: editing.category,
      note: editing.note || null,
      transaction_date: editing.transaction_date,
    });
    setEditing(null);
    load();
  };

  return (
    <section className="culture-panel rounded-lg p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-culture">{t('transactions.eyebrow')}</p>
          <h2 className="mt-2 text-xl font-semibold">{t('transactions.title')}</h2>
        </div>
        <Link className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--culture-primary)' }} to="/transactions/new">{t('app.transactions.new')}</Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <select className="rounded-lg border px-3 py-2" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">{t('app.filters.allTypes')}</option>
          <option value="income">{t('labels.income')}</option>
          <option value="expense">{t('labels.expense')}</option>
        </select>
        <input className="rounded-lg border px-3 py-2" placeholder={t('transactions.columns.category')} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input className="rounded-lg border px-3 py-2" type="date" value={filters.from_date} onChange={(e) => setFilters({ ...filters, from_date: e.target.value })} />
        <input className="rounded-lg border px-3 py-2" type="date" value={filters.to_date} onChange={(e) => setFilters({ ...filters, to_date: e.target.value })} />
        <button className="surface-soft rounded-lg px-3 py-2 font-medium" onClick={load}>{t('app.actions.apply')}</button>
      </div>
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {editing && (
        <form onSubmit={saveEdit} className="surface-soft mt-5 grid gap-3 rounded-lg p-4 md:grid-cols-6">
          <input className="rounded-lg border px-3 py-2" type="number" step="0.01" min="0.01" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: e.target.value })} />
          <select className="rounded-lg border px-3 py-2" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
            <option value="expense">{t('labels.expense')}</option>
            <option value="income">{t('labels.income')}</option>
          </select>
          <input className="rounded-lg border px-3 py-2" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <input className="rounded-lg border px-3 py-2" type="date" value={editing.transaction_date} onChange={(e) => setEditing({ ...editing, transaction_date: e.target.value })} />
          <button className="rounded-lg px-3 py-2 font-semibold text-white" style={{ background: 'var(--culture-primary)' }}>{t('app.actions.save')}</button>
          <button type="button" className="rounded-lg border px-3 py-2 font-medium" onClick={() => setEditing(null)}>{t('app.actions.cancel')}</button>
        </form>
      )}
      {loading ? <div className="mt-4"><LoadingState label={t('app.states.loading')} /></div> : transactions.length === 0 ? <div className="mt-4"><EmptyState message={t('app.states.empty')} /></div> : (
        <div className="mt-5 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--culture-border)' }}>
          <table className="w-full border-collapse text-sm">
            <thead className="surface-soft text-start">
              <tr>
                <th className="px-4 py-3 font-medium">{t('transactions.columns.category')}</th>
                <th className="px-4 py-3 font-medium">{t('transactions.columns.type')}</th>
                <th className="px-4 py-3 font-medium">{t('transactions.columns.date')}</th>
                <th className="px-4 py-3 text-end font-medium">{t('transactions.columns.amount')}</th>
                <th className="px-4 py-3 text-end font-medium">{t('app.actions.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t" style={{ borderColor: 'var(--culture-border)' }}>
                  <td className="px-4 py-3 font-medium">{transaction.category}</td>
                  <td className="px-4 py-3 text-muted-culture">{t(`labels.${transaction.type}`)}</td>
                  <td className="px-4 py-3 text-muted-culture">{formatDate(transaction.transaction_date)}</td>
                  <td className="px-4 py-3 text-end font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditing(transaction)}>{t('app.actions.edit')}</button>
                      <button className="text-red-600" onClick={() => remove(transaction.id)}>{t('app.actions.delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
