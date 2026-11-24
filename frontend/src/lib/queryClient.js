import { QueryClient } from '@tanstack/react-query';

// TanStack Query keeps server data (pet, profile, friends...) cached,
// refetches it when needed and exposes isLoading / error to components.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // data counts as fresh for 30 s
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Retrying cannot fix these: not logged in, forbidden, not found
        const status = error?.response?.status;
        if ([401, 403, 404].includes(status)) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false, // never repeat a POST/PATCH/DELETE automatically
    },
  },
});
