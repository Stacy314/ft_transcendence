import './style.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthenticatedUser, setAuthenticatedUser } from '../../utils/auth.js';

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
    const isLogin = mode === 'login';

  async function handleSubmit(event) {
        event.preventDefault();

    if (isSubmitting) return;

    setError('');

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const password = formData.get('password')?.toString() || '';
    const passwordConfirmation = formData.get('confirm-password')?.toString() || '';

    if (isLogin) {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session: {
              username,
              password,
            },
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const apiError = Array.isArray(data.errors) ? data.errors.join(' ') : 'Login failed.';
          throw new Error(apiError);
        }

        setAuthenticatedUser(data.user || { username });
        navigate('/dashboard');
      } catch (submitError) {
        clearAuthenticatedUser();
        setError(submitError.message || 'Login failed.');
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            username,
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiError = Array.isArray(data.errors) ? data.errors.join(' ') : 'Registration failed.';
        throw new Error(apiError);
      }

      setAuthenticatedUser(data.user || { username, email });
      navigate('/gotchi-selection');
    } catch (submitError) {
      setError(submitError.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
    }

    return (
        <main className={`login-page ${mode}`}>
          <div className="login-buttons">
            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={isLogin ? '' : 'active'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required />
            </div>

            <div className={`login-field ${isLogin ? 'login-field-hidden' : ''}`} aria-hidden={isLogin}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required={!isLogin} disabled={isLogin} />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>

            <div className={`login-field ${isLogin ? 'login-field-hidden' : ''}`} aria-hidden={isLogin}>
              <label htmlFor="confirm-password">Confirm password:</label>
              <input type="password" id="confirm-password" name="confirm-password" required={!isLogin} disabled={isLogin} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
            {!!error && <p className="login-error" role="alert">{error}</p>}
          </form>

          {isLogin && (
            <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
          )}
        </main>
    );
}