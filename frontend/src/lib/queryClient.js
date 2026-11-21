import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
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
