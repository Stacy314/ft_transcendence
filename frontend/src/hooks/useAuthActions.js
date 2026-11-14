import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, logout, register } from '../services/auth';
import { switchUser } from './useMe';

// Login, signup and logout as TanStack Query mutations.
// Forms use them like this:
//   const loginMutation = useLogin();
//   loginMutation.mutate({ username, password }, { onSuccess: () => navigate('/pet') });
//   loginMutation.isPending  → disable the button
//   loginMutation.error      → getApiError(loginMutation.error) for messages

// After login/signup the server answers with the user, so the cache is
// updated directly: no extra GET /api/session needed.
function useSignIn(request) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request,
    // Drop anything cached for a previous user, then store the new one
    onSuccess: (user) => switchUser(queryClient, user),
  });
}

export function useLogin() {
  return useSignIn(login); // ({ username, password })
}

export function useRegister() {
  return useSignIn(register); // ({ username, email, password, passwordConfirmation })
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    // Clear local data after the server confirms the session was ended.
    onSuccess: () => {
      switchUser(queryClient, null);
      navigate('/login', { replace: true });
    },
  });
}
