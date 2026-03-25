import { useState, useCallback } from 'react';
import { PriceAlert, AlertDirection } from '../types/alert';
import { PricePoint } from '../types/market';
import { useToastContext } from '../context/ToastContext';

const STORAGE_KEY = 'price_alerts';

function load(): PriceAlert[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as PriceAlert[]) : [];
	} catch {
		return [];
	}
}

function save(alerts: PriceAlert[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

function toastMessage(alert: PriceAlert, price: number): string {
	const arrow = alert.direction === 'above' ? '↑' : '↓';
	const threshold = alert.threshold.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	});
	const current = price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	});
	return `${alert.ticker} ${arrow} ${threshold} — now ${current}`;
}

export function useAlerts() {
	const { addToast } = useToastContext();
	const [alerts, setAlerts] = useState<PriceAlert[]>(load);

	const addAlert = useCallback((ticker: string, direction: AlertDirection, threshold: number) => {
		const newAlert: PriceAlert = {
			id: crypto.randomUUID(),
			ticker,
			direction,
			threshold,
			createdAt: Date.now(),
			triggered: false,
		};
		setAlerts((prev) => {
			const next = [...prev, newAlert];
			save(next);
			return next;
		});
	}, []);

	const deleteAlert = useCallback((id: string) => {
		setAlerts((prev) => {
			const next = prev.filter((a) => a.id !== id);
			save(next);
			return next;
		});
	}, []);

	const clearTriggered = useCallback(() => {
		setAlerts((prev) => {
			const next = prev.filter((a) => !a.triggered);
			save(next);
			return next;
		});
	}, []);

	const checkPrice = useCallback(
		(point: PricePoint) => {
			setAlerts((prev) => {
				const toNotify: { alert: PriceAlert; price: number }[] = [];

				const next = prev.map((alert) => {
					if (alert.triggered || alert.ticker !== point.ticker) return alert;

					const fires =
						alert.direction === 'above'
							? point.price >= alert.threshold
							: point.price <= alert.threshold;

					if (!fires) return alert;

					toNotify.push({ alert, price: point.price });
					return { ...alert, triggered: true, triggeredAt: Date.now() };
				});

				if (toNotify.length === 0) return prev;

				save(next);

				// Defer toast calls outside the state updater
				setTimeout(() => {
					toNotify.forEach(({ alert, price }) =>
						addToast(toastMessage(alert, price), 'alert'),
					);
				}, 0);

				return next;
			});
		},
		[addToast],
	);

	return { alerts, addAlert, deleteAlert, clearTriggered, checkPrice };
}
