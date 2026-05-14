import { apiRequest } from './client';

export function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return apiRequest(`/transactions${query ? `?${query}` : ''}`);
}

export function createTransaction(payload) {
  return apiRequest('/transactions', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateTransaction(id, payload) {
  return apiRequest(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteTransaction(id) {
  return apiRequest(`/transactions/${id}`, { method: 'DELETE' });
}
