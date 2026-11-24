import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Panel from '../../components/ui/Panel.jsx';
import '../login/style.css';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="login-page">
      <Panel as="form" className="login-form" onSubmit={handleSubmit}>
        <h1>Forgot password</h1>
        {sent ? (
          <p>If the email exists, a reset link has been sent.</p>
        ) : (
          <>
            <FormField type="email" id="email" label="Email:" required />
            <Button type="submit">Send reset link</Button>
          </>
        )}
        <Link to="/" className="login-forgot">
          Back to login
        </Link>
      </Panel>
    </main>
  );
}
