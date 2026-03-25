import http from 'http';
import { WebSocket, WebSocketServer as WSS } from 'ws';
import { ClientMessage, PricePoint, ServerMessage } from '../domain/types';
import { MarketDataService } from '../services/MarketDataService';

interface ClientState {
	subscriptions: Set<string>;
}

export class WebSocketServer {
	private clients: Map<WebSocket, ClientState> = new Map();

	constructor(server: http.Server, marketService: MarketDataService) {
		const wss = new WSS({ server });

		wss.on('connection', (socket: WebSocket) => {
			this.clients.set(socket, { subscriptions: new Set() });

			socket.on('message', (raw: Buffer) => {
				this.handleMessage(socket, raw, marketService);
			});

			socket.on('close', () => {
				this.clients.delete(socket);
			});

			socket.on('error', () => {
				this.clients.delete(socket);
			});
		});

		marketService.on('price_update', (point: PricePoint) => {
			this.broadcast(point);
		});
	}

	private handleMessage(socket: WebSocket, raw: Buffer, marketService: MarketDataService): void {
		let msg: ClientMessage;

		try {
			msg = JSON.parse(raw.toString()) as ClientMessage;
		} catch {
			this.send(socket, { type: 'error', message: 'Invalid JSON message' });
			return;
		}

		const state = this.clients.get(socket);
		if (!state) return;

		if (msg.type === 'subscribe') {
			const validTickers: string[] = [];
			const invalidTickers: string[] = [];

			for (const ticker of msg.tickers) {
				if (marketService.isValidTicker(ticker)) {
					state.subscriptions.add(ticker);
					validTickers.push(ticker);
				} else {
					invalidTickers.push(ticker);
				}
			}

			this.send(socket, { type: 'subscribed', tickers: [...state.subscriptions] });

			if (invalidTickers.length > 0) {
				this.send(socket, {
					type: 'error',
					message: `Unknown tickers ignored: ${invalidTickers.join(', ')}`,
				});
			}
		} else if (msg.type === 'unsubscribe') {
			for (const ticker of msg.tickers) {
				state.subscriptions.delete(ticker);
			}
			this.send(socket, { type: 'subscribed', tickers: [...state.subscriptions] });
		} else {
			this.send(socket, { type: 'error', message: 'Unknown message type' });
		}
	}

	private broadcast(point: PricePoint): void {
		const message: ServerMessage = { type: 'price_update', data: point };
		const payload = JSON.stringify(message);

		for (const [socket, state] of this.clients) {
			if (socket.readyState === WebSocket.OPEN && state.subscriptions.has(point.ticker)) {
				socket.send(payload);
			}
		}
	}

	private send(socket: WebSocket, message: ServerMessage): void {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message));
		}
	}
}
