const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const tokenStorageKey = 'masrofy.token';

function getErrorMessage(data, fallback) {
  const { detail } = data || {};

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    const passwordError = detail.find((item) => item?.loc?.includes('password'));
    if (passwordError) {
      if (passwordError.type === 'string_too_short') {
        return 'Password must be at least 8 characters';
      }
      if (passwordError.type === 'string_too_long') {
        return 'Password must be 72 bytes or fewer.';
      }
      return passwordError.msg || fallback;
    }

    const firstMessage = detail.find((item) => item?.msg)?.msg;
    if (firstMessage) {
      return firstMessage;
    }
  }

  return fallback;
}

export function getToken() {
  return window.localStorage.getItem(tokenStorageKey);
}

export function setToken(token) {
  window.localStorage.setItem(tokenStorageKey, token);
}

export function clearToken() {
  window.localStorage.removeItem(tokenStorageKey);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Server error, please try again');
  }

  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('masrofy:unauthorized'));
    throw new Error('Your session has expired. Please log in again.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fallback = response.status >= 500 ? 'Server error, please try again' : 'The request could not be completed.';
    throw new Error(getErrorMessage(data, fallback));
  }
  return data;
}
