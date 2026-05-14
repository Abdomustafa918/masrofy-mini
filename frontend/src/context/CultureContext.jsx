import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  cultureStorageKey,
  defaultCultureCode,
  findCulture,
} from '../config/cultures';
import { updateUserCulture } from '../api/userApi';

const CultureContext = createContext(null);

function applyTheme(culture) {
  const root = document.documentElement;
  root.lang = culture.code;
  root.dir = culture.direction;
  root.dataset.dashboardStyle = culture.dashboardStyle;

  Object.entries(culture.theme).forEach(([token, value]) => {
    root.style.setProperty(`--culture-${token}`, value);
  });
}

export function CultureProvider({ children }) {
  const { i18n } = useTranslation();
  const [cultureCode, setCultureCodeState] = useState(() => (
    window.localStorage.getItem(cultureStorageKey) || defaultCultureCode
  ));
  const culture = useMemo(() => findCulture(cultureCode), [cultureCode]);

  useEffect(() => {
    window.localStorage.setItem(cultureStorageKey, culture.code);
    applyTheme(culture);
    i18n.changeLanguage(culture.code);
  }, [culture, i18n]);

  const setCultureCode = async (nextCultureCode, options = { persistRemote: true }) => {
    const nextCulture = findCulture(nextCultureCode);
    setCultureCodeState(nextCulture.code);
    if (options.persistRemote && window.localStorage.getItem('masrofy.token')) {
      try {
        await updateUserCulture(nextCulture.code);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const value = useMemo(() => ({
    culture,
    cultureCode: culture.code,
    setCultureCode,
  }), [culture]);

  return (
    <CultureContext.Provider value={value}>
      {children}
    </CultureContext.Provider>
  );
}

export function useCulture() {
  const context = useContext(CultureContext);
  if (!context) {
    throw new Error('useCulture must be used inside CultureProvider');
  }
  return context;
}
