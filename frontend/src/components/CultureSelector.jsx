import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';
import { cultures } from '../config/cultures';
import { useCulture } from '../context/CultureContext';

export default function CultureSelector() {
  const { t } = useTranslation();
  const { cultureCode, setCultureCode } = useCulture();

  return (
    <label className="flex min-w-[220px] items-center gap-3 rounded-lg border px-3 py-2 culture-panel">
      <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t('navbar.cultureLabel')}</span>
      <select
        className="w-full bg-transparent text-sm font-medium outline-none"
        aria-label={t('navbar.cultureLabel')}
        value={cultureCode}
        onChange={(event) => setCultureCode(event.target.value)}
      >
        {cultures.map((culture) => (
          <option key={culture.code} value={culture.code}>
            {culture.label || `${t(`cultures.${culture.code}.language`)} - ${t(`cultures.${culture.code}.country`)}`}
          </option>
        ))}
      </select>
    </label>
  );
}
