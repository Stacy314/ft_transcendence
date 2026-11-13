import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest('/session')
      .then(data => { if (active) setUser(data.user); })
      .catch(error => {
        if (active && error.status !== 401) setError(error.message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  async function login(credentials) {
    const data = await apiRequest('/session', { method: 'POST', body: credentials });
    setUser(data.user);
  }

  async function register(credentials) {
    const data = await apiRequest('/registration', { method: 'POST', body: { user: credentials } });
    setUser(data.user);
  }

  async function logout() {
    await apiRequest('/session', { method: 'DELETE' });
    setUser(null);
  }

  if (loading) return <p role="status">Checking session…</p>;
  if (error) return (
    <div role="alert">
      <p>{error}</p>
      <button onClick={() => { setError(''); setLoading(true); setAttempt(value => value + 1); }}>
        Try again
      </button>
    </div>
  );

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
