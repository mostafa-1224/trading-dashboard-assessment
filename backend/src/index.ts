import http from 'http';
import { PORT, SEED_PRICES, TICK_INTERVAL_MS } from './config';
import { PriceEngine } from './domain/PriceEngine';
import { MarketDataService } from './services/MarketDataService';
import { InMemoryStore } from './storage/InMemoryStore';
import { WebSocketServer } from './websocket/WebSocketServer';
import { createApp } from './app';

const store = new InMemoryStore();
const engine = new PriceEngine(SEED_PRICES);
const marketService = new MarketDataService(engine, store, TICK_INTERVAL_MS);

const app = createApp(marketService);
const server = http.createServer(app);

new WebSocketServer(server, marketService);
marketService.start();

server.listen(PORT, () => {
	console.log(`Backend running on port ${PORT}`);
	console.log(`Tracking tickers: ${marketService.getTickers().join(', ')}`);
});

process.on('SIGTERM', () => {
	marketService.stop();
	server.close(() => process.exit(0));
});
