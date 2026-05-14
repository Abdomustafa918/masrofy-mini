import { useTranslation } from 'react-i18next';
import CultureSelector from '../components/CultureSelector';
import { useAuth } from '../context/AuthContext';
import { useCulture } from '../context/CultureContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { culture } = useCulture();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="culture-panel rounded-lg p-5">
        <p className="text-sm font-medium text-muted-culture">{t('app.nav.settings')}</p>
        <h2 className="mt-2 text-xl font-semibold">{t('app.settings.profile')}</h2>
        <dl className="mt-5 grid gap-4">
          <div><dt className="text-sm text-muted-culture">{t('app.fields.fullName')}</dt><dd className="font-medium">{user?.full_name}</dd></div>
          <div><dt className="text-sm text-muted-culture">{t('app.fields.email')}</dt><dd className="font-medium">{user?.email}</dd></div>
        </dl>
      </section>
      <section className="culture-panel rounded-lg p-5">
        <h2 className="text-xl font-semibold">{t('app.settings.culture')}</h2>
        <div className="mt-5"><CultureSelector /></div>
        <div className="surface-soft mt-5 rounded-lg p-4">
          <p className="text-sm text-muted-culture">{t(`cultures.${culture.code}.language`)} - {t(`cultures.${culture.code}.country`)}</p>
          <p className="mt-2 font-semibold">{formatDate(new Date())}</p>
          <p className="mt-1 font-semibold">{formatCurrency(1200)}</p>
        </div>
      </section>
    </div>
  );
}
