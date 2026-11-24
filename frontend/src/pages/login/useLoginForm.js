import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../../hooks/useAuthActions';
import { getApiError } from '../../services/api';
import {
  getServerFormErrors,
  validateLogin,
  validateRegister,
} from './validation';

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export function useLoginForm(initialMode) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const isLogin = mode === 'login';

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isPending = loginMutation.isPending || registerMutation.isPending;

  function selectMode(nextMode) {
    setMode(nextMode);
    setFieldErrors({});
    setFormError('');
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));

    setFieldErrors((previous) => ({ ...previous, [name]: undefined }));
    setFormError('');
  }

  function showServerError(error, submittedValues) {
    const { message, fields } = getApiError(error);
    const feedback = getServerFormErrors(fields, submittedValues, message);
    setFieldErrors(feedback.fieldErrors);
    setFormError(feedback.formError);
  }

  function navigateAfterLogin() {
    const from = location.state?.from;
    const destination = from
      ? `${from.pathname}${from.search || ''}${from.hash || ''}`
      : '/dashboard';

    navigate(destination, { replace: true });
  }

  function signIn() {
    loginMutation.mutate(
      { username: form.username.trim(), password: form.password },
      { onSuccess: navigateAfterLogin, onError: showServerError },
    );
  }

  function registerAccount() {
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

  function submitForm(event) {
    event.preventDefault();
    if (isPending) return;

    const clientErrors = isLogin ? validateLogin(form) : validateRegister(form);
    setFieldErrors(clientErrors);
    setFormError('');

    if (Object.keys(clientErrors).length > 0) return;

    if (isLogin) {
      signIn();
    } else {
      registerAccount();
    }
  }

  return {
    isLogin,
    form,
    fieldErrors,
    formError,
    isPending,
    selectMode,
    updateField,
    submitForm,
  };
}
