import { useDashboardContext } from '../context/DashboardContext';
import { useHistory } from './useMarketData';

export function usePriceChart() {
	const { selectedTicker } = useDashboardContext();
	const { data: history = [], isPending } = useHistory(selectedTicker);

	const prices = history.map((p) => p.price);
	const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
	const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
	const yPadding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.01;

	return {
		data: history,
		ticker: selectedTicker ?? '',
		loading: isPending,
		yDomain: [minPrice - yPadding, maxPrice + yPadding] as [number, number],
	};
}
