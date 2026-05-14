import { apiRequest } from './client';

export function updateUserCulture(preferredCulture) {
  return apiRequest('/users/me/culture', {
    method: 'PUT',
    body: JSON.stringify({ preferred_culture: preferredCulture }),
  });
}
