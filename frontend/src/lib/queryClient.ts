import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000,
			gcTime: 5 * 60 * 1000,
			retry: 2,
			retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
			// WS keeps prices live - no need to refetch just because the tab regains focus
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
		},
	},
});
