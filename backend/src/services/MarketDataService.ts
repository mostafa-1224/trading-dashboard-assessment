import { EventEmitter } from 'events';
import { PriceEngine } from '../domain/PriceEngine';
import { PricePoint, TickerInfo, TickerSummary } from '../domain/types';
import { InMemoryStore } from '../storage/InMemoryStore';
import { SEED_PRICES, TICKER_INFO } from '../config';

export class MarketDataService extends EventEmitter {
	private intervals: NodeJS.Timeout[] = [];

	constructor(
		private readonly engine: PriceEngine,
		private readonly store: InMemoryStore,
		private readonly tickIntervalMs: number = 1000,
	) {
		super();
	}

	start(): void {
		for (const ticker of this.engine.getTickers()) {
			const interval = setInterval(() => {
				const point = this.engine.tick(ticker);
				this.store.push(point);
				this.emit('price_update', point);
			}, this.tickIntervalMs);
			this.intervals.push(interval);
		}
	}

	stop(): void {
		for (const interval of this.intervals) {
			clearInterval(interval);
		}
		this.intervals = [];
	}

	getHistory(ticker: string): PricePoint[] {
		return this.store.getHistory(ticker);
	}

	getAllSummaries(): TickerSummary[] {
		return this.store.getAllSummaries();
	}

	getTickers(): string[] {
		return this.engine.getTickers();
	}

	isValidTicker(ticker: string): boolean {
		return this.engine.hasTicker(ticker);
	}

	getAllTickerInfo(): TickerInfo[] {
		return this.engine.getTickers().map((ticker) => ({
			ticker,
			seedPrice: SEED_PRICES[ticker],
			...TICKER_INFO[ticker],
		}));
	}
}
