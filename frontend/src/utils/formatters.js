import { cultureStorageKey, defaultCultureCode, findCulture } from '../config/cultures';

export function getSelectedCulture() {
  const storedCulture = window.localStorage.getItem(cultureStorageKey);
  return findCulture(storedCulture || defaultCultureCode);
}

export function formatCurrency(amount) {
  const culture = getSelectedCulture();
  return new Intl.NumberFormat(culture.code, {
    style: 'currency',
    currency: culture.currencyCode,
  }).format(amount);
}

export function formatDate(date) {
  const culture = getSelectedCulture();
  return new Intl.DateTimeFormat(culture.code, {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function formatNumber(value) {
  const culture = getSelectedCulture();
  return new Intl.NumberFormat(culture.code, {
    maximumFractionDigits: 2,
  }).format(value);
}
