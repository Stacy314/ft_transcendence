import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, logout, register } from '../services/auth';
import { switchUser } from './useMe';

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
  return useSignIn(login);
}

export function useRegister() {
  return useSignIn(register);
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      switchUser(queryClient, null);
      navigate('/login', { replace: true });
    },
  });
}
