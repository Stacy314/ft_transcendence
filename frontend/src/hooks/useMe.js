import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../services/auth';
import { useAuthStore } from '../store/authStore';

export const ME_KEY = ['auth', 'me'];

// Puts the current user (or null) in both places that hold it:
// the TanStack Query cache (for components) and the Zustand store
// (for code outside React, e.g. the API client).
export function setCurrentUser(queryClient, user) {
  queryClient.setQueryData(ME_KEY, user);
  useAuthStore.getState().setUser(user);
}

// Called when the logged-in user changes (login, signup, logout, expired
// session): drops every cached query of the previous user (pet, friends...)
// and sets the new current user. The "me" query itself is updated in place,
// not removed, so components already showing it re-render immediately.
export function switchUser(queryClient, user) {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey.join('/') !== ME_KEY.join('/'),
  });
  setCurrentUser(queryClient, user);
}

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      const user = await getCurrentUser();
      useAuthStore.getState().setUser(user);
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentUser() {
  const { data, isPending } = useMe();
  return {
    user: data ?? null,
    isLoggedIn: Boolean(data),
    isLoading: isPending,
  };
}
