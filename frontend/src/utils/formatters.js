import { cultureStorageKey, defaultCultureCode, findCulture } from '../config/cultures';

export function getSelectedCulture() {
  const storedCulture = window.localStorage.getItem(cultureStorageKey);
  return findCulture(storedCulture || defaultCultureCode);
}

export function formatCurrency(amount) {
  const culture = getSelectedCulture();
  const formatter = new Intl.NumberFormat(culture.numberFormat || culture.locale || culture.code, {
    style: 'currency',
    currency: culture.currency || culture.currencyCode,
  });

  if ((culture.currency || culture.currencyCode) === 'JPY') {
    return formatter.formatToParts(amount).map((part) => (
      part.type === 'currency' ? culture.currencySymbol : part.value
    )).join('');
  }

  return formatter.format(amount);
}

export function formatDate(date) {
  const culture = getSelectedCulture();
  const value = new Date(date);

  if (culture.dateFormat === 'YYYY/MM/DD') {
    return new Intl.DateTimeFormat(culture.locale || culture.code, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value);
  }

  return new Intl.DateTimeFormat(culture.locale || culture.code, {
    dateStyle: 'medium',
  }).format(value);
}

export function formatNumber(value) {
  const culture = getSelectedCulture();
  return new Intl.NumberFormat(culture.numberFormat || culture.locale || culture.code, {
    maximumFractionDigits: 2,
  }).format(value);
}
