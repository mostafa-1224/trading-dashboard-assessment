import { useState, useCallback, useEffect, FormEvent } from 'react';
import { useAlertsContext } from '../context/AlertsContext';
import { useTickers } from './useMarketData';
import { AlertDirection } from '../types/alert';

export function useAlertsPanel() {
	const { alerts, addAlert, deleteAlert, clearTriggered } = useAlertsContext();
	const { data: tickers = [] } = useTickers();

	const [ticker, setTicker] = useState('');
	const [direction, setDirection] = useState<AlertDirection>('above');
	const [threshold, setThreshold] = useState('');
	const [formError, setFormError] = useState<string | null>(null);

	// Default to the first available ticker once the list loads
	useEffect(() => {
		if (tickers.length > 0 && !ticker) {
			setTicker(tickers[0].ticker);
		}
	}, [tickers, ticker]);

	const handleSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			const price = parseFloat(threshold);
			if (isNaN(price) || price <= 0) {
				setFormError('Enter a valid positive price.');
				return;
			}
			addAlert(ticker, direction, price);
			setThreshold('');
			setFormError(null);
		},
		[ticker, direction, threshold, addAlert],
	);

	const activeAlerts = alerts.filter((a) => !a.triggered);
	const triggeredAlerts = alerts.filter((a) => a.triggered);

	return {
		tickerOptions: tickers.map((t) => t.ticker),
		ticker,
		setTicker,
		direction,
		setDirection,
		threshold,
		setThreshold,
		formError,
		handleSubmit,
		activeAlerts,
		triggeredAlerts,
		deleteAlert,
		clearTriggered,
	};
}
