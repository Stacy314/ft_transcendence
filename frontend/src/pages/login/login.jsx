import './style.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const isLogin = mode === 'login';

    function handleSubmit(event) {
        event.preventDefault();
        navigate(isLogin ? '/dashboard' : '/gotchi-selection');
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

            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>

          {isLogin && (
            <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
          )}
        </main>
    );
}