import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Shared HTTP client for every request to the Rails API.
//
// Authentication is a server-side session stored in an httpOnly cookie
// (_tamagotchi_session). The browser sends it automatically; JavaScript never
// sees it. Requests that change data must also carry a CSRF token, which Rails
// gives us from GET /api/csrf.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send the session cookie
  headers: { Accept: 'application/json' },
});

// ---------- CSRF ----------

const SAFE_METHODS = ['get', 'head', 'options'];
let csrfToken = null;
let csrfRequest = null; // shared promise, so parallel requests fetch the token once

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = api
      .get('/csrf')
      .then(({ data }) => {
        csrfToken = data.csrf_token;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

// Rails ties the CSRF token to the session. Login, signup and logout call
// reset_session on the server, so the old token must be thrown away.
export function resetCsrfToken() {
  csrfToken = null;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (!SAFE_METHODS.includes(method)) {
    config.headers['X-CSRF-Token'] = await getCsrfToken();
  }
  return config;
});

// ---------- 401 handling ----------

// What to do when the session has expired. Defaults to a full page redirect;
// the router can replace it with a soft navigate():
//   setUnauthorizedHandler(() => navigate('/login', { replace: true }))
const PUBLIC_PATHS = ['/', '/login', '/signup', '/privacy', '/terms'];

let onUnauthorized = () => {
  if (!PUBLIC_PATHS.includes(window.location.pathname)) {
    window.location.assign('/login');
  }
};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// A 422 is either a validation error ({ errors: ... }) or a rejected CSRF
// token (anything else). Only the second one is worth retrying.
function isCsrfFailure(error) {
  const data = error.response?.data;
  return (
    error.response?.status === 422 &&
    !(data && typeof data === 'object' && 'errors' in data)
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;

    // Stale CSRF token (e.g. the session was reset in another tab):
    // fetch a fresh one and retry the request once.
    if (config && isCsrfFailure(error) && !config._csrfRetried) {
      config._csrfRetried = true;
      resetCsrfToken();
      return api(config);
    }

    // GET /session answering 401 just means "nobody is logged in";
    // getCurrentUser() handles that, so it is not an expired session.
    const isSessionCheck =
      config?.url === '/session' && config?.method === 'get';

    if (status === 401 && !isSessionCheck) {
      resetCsrfToken();
      useAuthStore.getState().clearUser();
      onUnauthorized();
    }

    return Promise.reject(error);
  },
);

// ---------- Errors for the UI ----------

// Turns any API error into something a form can show:
//   { message: 'Invalid username or password', fields: { email: ['...'] } }
export function getApiError(error) {
  const data = error?.response?.data;
  if (!error?.response) {
    return {
      message: 'Cannot reach the server. Check your connection.',
      fields: {},
    };
  }
  if (data && typeof data === 'object') {
    if (data.errors && typeof data.errors === 'object') {
      return {
        message: 'Please fix the highlighted fields.',
        fields: data.errors,
      };
    }
    if (typeof data.error === 'string') {
      return { message: data.error, fields: {} };
    }
  }
  return { message: 'Something went wrong. Please try again.', fields: {} };
}
