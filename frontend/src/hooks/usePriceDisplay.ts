import { useRef } from 'react';
import { useDashboardContext } from '../context/DashboardContext';
import { useHistory } from './useMarketData';

export function usePriceDisplay() {
	const { selectedTicker, livePoint, connected } = useDashboardContext();
	const { data: history = [] } = useHistory(selectedTicker);

	// Capture the price at the moment history first loads — this becomes the baseline for delta %.
	// Refs avoid triggering re-renders; we reset when the ticker changes.
	const seedPriceRef = useRef<number | null>(null);
	const trackedTickerRef = useRef<string | null>(null);

	if (selectedTicker !== trackedTickerRef.current) {
		seedPriceRef.current = null;
		trackedTickerRef.current = selectedTicker;
	}

	if (seedPriceRef.current === null && history.length > 0) {
		// The last entry in the REST response is the freshest price before WS takes over
		seedPriceRef.current = history[history.length - 1].price;
	}

	const currentPrice =
		livePoint?.price ?? (history.length > 0 ? history[history.length - 1].price : null);
	const seedPrice = seedPriceRef.current;
	const delta = currentPrice != null && seedPrice != null ? currentPrice - seedPrice : null;
	const deltaPct = delta != null && seedPrice ? (delta / seedPrice) * 100 : null;

	return {
		ticker: selectedTicker,
		currentPrice,
		delta,
		deltaPct,
		lastTimestamp: livePoint?.timestamp ?? null,
		connected,
	};
}
