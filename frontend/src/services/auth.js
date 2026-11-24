import { api, resetCsrfToken } from './api';

// Auth endpoints of the Rails API. Every successful call returns the user
// object { id, username, email, name }.

// POST /api/registration → 201 { user } | 422 { errors: { field: [...] } }
export async function register({
  username,
  email,
  password,
  passwordConfirmation,
  name,
}) {
  const { data } = await api.post('/registration', {
    user: {
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
      name,
    },
  });
  resetCsrfToken(); // the server called reset_session
  return data.user;
}

// POST /api/session → 201 { user } | 401 { error }
export async function login({ username, password }) {
  const { data } = await api.post('/session', { username, password });
  resetCsrfToken(); // the server called reset_session
  return data.user;
}

// DELETE /api/session → 204
export async function logout() {
  try {
    await api.delete('/session');
  } finally {
    resetCsrfToken();
  }
}

// GET /api/session → 200 { user } when logged in.
// When nobody is logged in the backend answers 401 (or 200 { user: null });
// both become null here instead of an error.
export async function getCurrentUser() {
  try {
    const { data } = await api.get('/session');
    return data.user ?? null;
  } catch (error) {
    if (error.response?.status === 401) return null;
    throw error;
  }
}
