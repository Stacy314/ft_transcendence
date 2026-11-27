import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, logout, register } from '../services/auth';
import { switchUser } from './useMe';

// Login, signup and logout as TanStack Query mutations.
// Forms use isPending to disable submission and getApiError to display errors.

// After login/signup the server answers with the user, so the cache is
// updated directly: no extra GET /api/session needed.
function useSignIn(request) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request,
    onSuccess: (user) => switchUser(queryClient, user),
  });
}

export function useLogin() {
  return useSignIn(login); // ({ username, password })
}

export function useRegister() {
  return useSignIn(register); // ({ username, email, password, passwordConfirmation, name })
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    // onSettled: clear local data even if the request failed, so the UI
    // never keeps showing a user who asked to log out
    onSettled: () => {
      // Clear local data after the server confirms the session was ended.
      switchUser(queryClient, null);
      navigate('/login', { replace: true });
    },
  });
}
