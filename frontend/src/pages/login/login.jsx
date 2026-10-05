import './style.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate('/dashboard');
    }

    return (
        <main className="login-page">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>

            <button type="submit">Login</button>
          </form>
        </main>
    );
}