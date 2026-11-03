import '../login/style.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="login-page">
      <form className="login-form forgot-form" onSubmit={handleSubmit}>
        <h1>Forgot password</h1>
        {sent ? (
          <p>If the email exists, a reset link has been sent.</p>
        ) : (
          <>
            <div className="login-field">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <button type="submit">Send reset link</button>
          </>
        )}
        <Link to="/" className="login-forgot">Back to login</Link>
      </form>
    </main>
  );
}
