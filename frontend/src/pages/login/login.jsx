import './style.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../../hooks/useAuthActions';
import { getApiError } from '../../services/api';
import {
  serverFieldErrors,
  validateLogin,
  validateRegister,
} from './validation';

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

// One field: label, input, and its error message (linked for screen readers)
function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hidden,
  autoComplete,
}) {
  const errorId = `${id}-error`;
  return (
    <div
      className={`login-field ${hidden ? 'login-field-hidden' : ''}`}
      aria-hidden={hidden}
    >
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={hidden}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="login-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Login({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const isLogin = mode === 'login';

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isPending = loginMutation.isPending || registerMutation.isPending;

  function switchMode(nextMode) {
    setMode(nextMode);
    setErrors({});
    setFormError('');
  }

  // Updates one field and hides its old error as soon as the user edits it
  function handleChange(event) {
    const field = event.target.name;
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
  }

  function showServerError(error) {
    const { message, fields } = getApiError(error);
    const fieldErrors = serverFieldErrors(fields);
    setErrors(fieldErrors);
    // A general message only when no field shows the problem itself
    setFormError(Object.keys(fieldErrors).length ? '' : message);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const clientErrors = isLogin ? validateLogin(form) : validateRegister(form);
    setErrors(clientErrors);
    setFormError('');
    if (Object.keys(clientErrors).length > 0) return; // nothing is sent

    if (isLogin) {
      loginMutation.mutate(
        { username: form.username.trim(), password: form.password },
        {
          // Back to the page that sent the user here (expired session), else dashboard
          onSuccess: () => {
            const from = location.state?.from;
            navigate(from ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/dashboard', {
              replace: true,
            });
          },
          onError: showServerError,
        },
      );
    } else {
      registerMutation.mutate(
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          passwordConfirmation: form.passwordConfirmation,
        },
        {
          onSuccess: () => navigate('/gotchi-selection', { replace: true }),
          onError: showServerError,
        },
      );
    }
  }

  let submitLabel = isLogin ? 'Login' : 'Register';
  if (isPending) submitLabel = isLogin ? 'Logging in…' : 'Creating account…';

  return (
    <main className={`login-page ${mode}`}>
      <div className="login-buttons">
        <button
          type="button"
          className={isLogin ? 'active' : ''}
          onClick={() => switchMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={isLogin ? '' : 'active'}
          onClick={() => switchMode('register')}
        >
          Register
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <Field
          id="username"
          label="Username:"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        <Field
          id="email"
          label="Email:"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          hidden={isLogin}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password:"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
        />
        <Field
          id="passwordConfirmation"
          label="Confirm password:"
          type="password"
          value={form.passwordConfirmation}
          onChange={handleChange}
          error={errors.passwordConfirmation}
          hidden={isLogin}
          autoComplete="new-password"
        />

        {formError && (
          <p className="login-alert" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" disabled={isPending}>
          {submitLabel}
        </button>
      </form>

      {isLogin && (
        <Link to="/forgot-password" className="login-forgot">
          Forgot password?
        </Link>
      )}
    </main>
  );
}
