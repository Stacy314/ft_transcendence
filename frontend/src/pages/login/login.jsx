import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import FormError from '../../components/ui/FormError.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Panel from '../../components/ui/Panel.jsx';
import { useLoginForm } from './useLoginForm';
import './style.css';

function LoginModeSwitch({ isLogin, disabled, onSelectMode }) {
  return (
    <div
      className="login-mode-switch relative z-1 grid grid-cols-[1fr_1fr] justify-self-start"
      role="group"
      aria-label="Authentication mode"
    >
      <Button
        variant="tab"
        aria-pressed={isLogin}
        disabled={disabled}
        onClick={() => onSelectMode('login')}
      >
        Login
      </Button>
      <Button
        variant="tab"
        aria-pressed={!isLogin}
        disabled={disabled}
        onClick={() => onSelectMode('register')}
      >
        Register
      </Button>
    </div>
  );
}

function LoginFormFields({ isLogin, form, fieldErrors, readOnly, onChange }) {
  return (
    <>
      <FormField
        id="username"
        label="Username:"
        value={form.username}
        onChange={onChange}
        error={fieldErrors.username}
        readOnly={readOnly}
        autoComplete="username"
      />
      <FormField
        id="email"
        label="Email:"
        type="email"
        value={form.email}
        onChange={onChange}
        error={fieldErrors.email}
        readOnly={readOnly}
        hidden={isLogin}
        autoComplete="email"
      />
      <FormField
        id="password"
        label="Password:"
        type="password"
        value={form.password}
        onChange={onChange}
        error={fieldErrors.password}
        readOnly={readOnly}
        autoComplete={isLogin ? 'current-password' : 'new-password'}
      />
      <FormField
        id="passwordConfirmation"
        label="Confirm password:"
        type="password"
        value={form.passwordConfirmation}
        onChange={onChange}
        error={fieldErrors.passwordConfirmation}
        readOnly={readOnly}
        hidden={isLogin}
        autoComplete="new-password"
      />
    </>
  );
}

function getSubmitLabel(isLogin, isPending) {
  if (isLogin) return isPending ? 'Logging in…' : 'Login';

  return isPending ? 'Creating account…' : 'Register';
}

export default function Login({ initialMode = 'login' }) {
  const {
    isLogin,
    form,
    fieldErrors,
    formError,
    isPending,
    selectMode,
    updateField,
    submitForm,
  } = useLoginForm(initialMode);

  return (
    <main className="login-page">
      <LoginModeSwitch
        isLogin={isLogin}
        disabled={isPending}
        onSelectMode={selectMode}
      />

      <Panel
        as="form"
        variant="tabbed"
        className="login-form"
        onSubmit={submitForm}
        noValidate
      >
        <LoginFormFields
          isLogin={isLogin}
          form={form}
          fieldErrors={fieldErrors}
          readOnly={isPending}
          onChange={updateField}
        />

        {formError && <FormError>{formError}</FormError>}

        <Button type="submit" busy={isPending}>
          {getSubmitLabel(isLogin, isPending)}
        </Button>
      </Panel>

      {isLogin && (
        <Link to="/forgot-password" className="login-forgot">
          Forgot password?
        </Link>
      )}
    </main>
  );
}
