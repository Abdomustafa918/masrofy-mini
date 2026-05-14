import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import nl from './locales/nl.json';
import { cultureStorageKey, defaultCultureCode } from './config/cultures';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: en },
      'ar-EG': { translation: ar },
      'fr-FR': { translation: fr },
      'de-DE': { translation: de },
      'nl-NL': { translation: nl },
    },
    lng: window.localStorage.getItem(cultureStorageKey) || defaultCultureCode,
    fallbackLng: defaultCultureCode,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
