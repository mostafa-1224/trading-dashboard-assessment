import { useDashboardContext } from '../context/DashboardContext';
import { useTickers } from './useMarketData';

export function useTickerList() {
	const { selectedTicker, setSelectedTicker } = useDashboardContext();
	const { data: tickers = [], isPending, isError } = useTickers();

	return {
		tickers,
		selectedTicker,
		onSelect: setSelectedTicker,
		isPending,
		isError,
	};
}
