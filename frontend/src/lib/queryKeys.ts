export const queryKeys = {
	all: ['market'] as const,

	tickers: () => [...queryKeys.all, 'tickers'] as const,
	tickerInfo: () => [...queryKeys.all, 'tickers', 'info'] as const,

	histories: () => [...queryKeys.all, 'history'] as const,
	history: (ticker: string) => [...queryKeys.histories(), ticker] as const,
} as const;
