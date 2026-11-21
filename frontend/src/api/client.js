export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (method !== 'GET') {
    // Sessions rotate after authentication, so obtain a fresh token for each mutation.
    const csrf = await apiRequest('/csrf');
    headers['X-CSRF-Token'] = csrf.csrf_token;
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Please try again.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errors = data?.errors ? Object.values(data.errors).flat().join('. ') : data?.error;
    const error = new Error(errors || `Request failed (${response.status}). Please try again.`);
    error.status = response.status;
    throw error;
  }
  return data;
}
