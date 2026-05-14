import { apiRequest, setToken } from './client';

export async function registerUser(payload) {
  const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  setToken(data.access_token);
  return data;
}

export async function loginUser(payload) {
  const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  setToken(data.access_token);
  return data;
}

export function getMe() {
  return apiRequest('/auth/me');
}
