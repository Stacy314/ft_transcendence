import { getAuthenticatedUser } from './auth.js';

function buildUserKey(user) {
  const identifier = user?.id || user?.username;
  return identifier ? `gotchi:${identifier}` : null;
}

export function loadCurrentUserGotchi() {
  const key = buildUserKey(getAuthenticatedUser());
  if (!key) return {};

  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

export function saveCurrentUserGotchi(gotchi) {
  const key = buildUserKey(getAuthenticatedUser());
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(gotchi || {}));
}