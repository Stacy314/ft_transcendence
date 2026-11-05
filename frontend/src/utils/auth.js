const AUTH_KEY = 'auth_user';

export function isAuthenticated() {
  return Boolean(localStorage.getItem(AUTH_KEY));
}

export function setAuthenticatedUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user || {}));
}

export function clearAuthenticatedUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthenticatedUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
}