import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_URL } from '../config';
import { ClientMessage, PricePoint, ServerMessage } from '../types/market';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500;

interface UseWebSocketOptions {
	ticker: string | null;
	onPriceUpdate: (point: PricePoint) => void;
}

interface UseWebSocketResult {
	connected: boolean;
}

export function useWebSocket({ ticker, onPriceUpdate }: UseWebSocketOptions): UseWebSocketResult {
	const [connected, setConnected] = useState(false);
	const wsRef = useRef<WebSocket | null>(null);
	const retryCount = useRef(0);
	const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const onPriceUpdateRef = useRef(onPriceUpdate);
	const tickerRef = useRef(ticker);

	// Keep refs in sync so stale closures inside WS handlers always see the latest values
	useEffect(() => {
		onPriceUpdateRef.current = onPriceUpdate;
	}, [onPriceUpdate]);

	useEffect(() => {
		tickerRef.current = ticker;
	}, [ticker]);

	const subscribe = useCallback((ws: WebSocket, t: string) => {
		if (ws.readyState === WebSocket.OPEN) {
			const msg: ClientMessage = { type: 'subscribe', tickers: [t] };
			ws.send(JSON.stringify(msg));
		}
	}, []);

	const connect = useCallback(() => {
		if (wsRef.current) {
			wsRef.current.onopen = null;
			wsRef.current.onmessage = null;
			wsRef.current.onclose = null;
			wsRef.current.onerror = null;
			wsRef.current.close();
		}

		const ws = new WebSocket(WS_URL);
		wsRef.current = ws;

		ws.onopen = () => {
			retryCount.current = 0;
			setConnected(true);
			if (tickerRef.current) {
				subscribe(ws, tickerRef.current);
			}
		};

		ws.onmessage = (event: MessageEvent) => {
			try {
				const msg = JSON.parse(event.data as string) as ServerMessage;
				if (msg.type === 'price_update') {
					onPriceUpdateRef.current(msg.data);
				}
			} catch {
				// ignore malformed frames
			}
		};

		ws.onclose = () => {
			setConnected(false);
			if (retryCount.current < MAX_RETRIES) {
				const delay = BASE_DELAY_MS * Math.pow(2, retryCount.current);
				retryCount.current += 1;
				retryTimeout.current = setTimeout(connect, delay);
			}
		};

		ws.onerror = () => {
			ws.close();
		};
	}, [subscribe]);

	useEffect(() => {
		connect();
		return () => {
			if (retryTimeout.current) clearTimeout(retryTimeout.current);
			if (wsRef.current) {
				wsRef.current.onopen = null;
				wsRef.current.onmessage = null;
				wsRef.current.onclose = null;
				wsRef.current.onerror = null;
				wsRef.current.close();
			}
		};
	}, [connect]);

	// Re-subscribe when the selected ticker changes
	useEffect(() => {
		if (ticker && wsRef.current) {
			subscribe(wsRef.current, ticker);
		}
	}, [ticker, subscribe]);

	return { connected };
}
