import { apiRequest } from './client';

export function getBudgets() {
  return apiRequest('/budgets');
}

export function getCurrentBudget() {
  return apiRequest('/budgets/current');
}

export function createBudget(payload) {
  return apiRequest('/budgets', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateBudget(id, payload) {
  return apiRequest(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteBudget(id) {
  return apiRequest(`/budgets/${id}`, { method: 'DELETE' });
}
