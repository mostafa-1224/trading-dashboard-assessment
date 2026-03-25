import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { PricePoint, TickerSummary } from '../types/market';
import { useTickers } from './useMarketData';
import { useWebSocket } from './useWebSocket';
import { useAlertsContext } from '../context/AlertsContext';
import { queryKeys } from '../lib/queryKeys';
import { MAX_CHART_POINTS } from '../config';

export function useDashboard() {
	const queryClient = useQueryClient();
	const { checkPrice } = useAlertsContext();
	const [searchParams] = useSearchParams();
	const [selectedTicker, setSelectedTicker] = useState<string | null>(searchParams.get('ticker'));
	const [livePoint, setLivePoint] = useState<PricePoint | null>(null);

	const { data: tickers = [] } = useTickers();

	// Auto-select the first ticker once the list arrives
	useEffect(() => {
		if (tickers.length > 0 && selectedTicker === null) {
			setSelectedTicker(tickers[0].ticker);
		}
	}, [tickers, selectedTicker]);

	useEffect(() => {
		setLivePoint(null);
	}, [selectedTicker]);

	const handlePriceUpdate = useCallback(
		(point: PricePoint) => {
			if (point.ticker === selectedTicker) {
				setLivePoint(point);
			}

			checkPrice(point);

			// Patch the tickers cache in place so the sidebar stays current without a refetch
			queryClient.setQueryData<TickerSummary[]>(queryKeys.tickers(), (old) =>
				old?.map((t) =>
					t.ticker === point.ticker
						? { ...t, previousPrice: t.currentPrice, currentPrice: point.price }
						: t,
				),
			);

			// Append to the history cache and cap it to avoid unbounded growth
			if (point.ticker === selectedTicker) {
				queryClient.setQueryData<PricePoint[]>(queryKeys.history(point.ticker), (old) => {
					const next = [...(old ?? []), point];
					return next.length > MAX_CHART_POINTS ? next.slice(-MAX_CHART_POINTS) : next;
				});
			}
		},
		[selectedTicker, queryClient, checkPrice],
	);

	const { connected } = useWebSocket({
		ticker: selectedTicker,
		onPriceUpdate: handlePriceUpdate,
	});

	return {
		selectedTicker,
		setSelectedTicker,
		livePoint,
		connected,
	};
}
