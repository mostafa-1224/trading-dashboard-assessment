import { useQuery } from '@tanstack/react-query';
import { fetchTickers, fetchTickerInfo, fetchHistory } from '../services/apiService';
import { queryKeys } from '../lib/queryKeys';

export function useTickers() {
	return useQuery({
		queryKey: queryKeys.tickers(),
		queryFn: fetchTickers,
	});
}

export function useTickerInfo() {
	return useQuery({
		queryKey: queryKeys.tickerInfo(),
		queryFn: fetchTickerInfo,
	});
}

export function useHistory(ticker: string | null) {
	return useQuery({
		queryKey: queryKeys.history(ticker ?? ''),
		queryFn: () => fetchHistory(ticker!),
		enabled: !!ticker,
	});
}
