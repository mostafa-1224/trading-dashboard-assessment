import { PricePoint, TickerSummary } from '../domain/types';

const MAX_HISTORY = 100;

export class InMemoryStore {
	private history: Map<string, PricePoint[]> = new Map();
	private current: Map<string, PricePoint> = new Map();
	private previous: Map<string, number> = new Map();

	push(point: PricePoint): void {
		const prev = this.current.get(point.ticker);
		if (prev !== undefined) {
			this.previous.set(point.ticker, prev.price);
		}

		this.current.set(point.ticker, point);

		const buf = this.history.get(point.ticker) ?? [];
		if (buf.length >= MAX_HISTORY) {
			buf.shift();
		}
		buf.push(point);
		this.history.set(point.ticker, buf);
	}

	getHistory(ticker: string): PricePoint[] {
		return [...(this.history.get(ticker) ?? [])];
	}

	getCurrent(ticker: string): PricePoint | undefined {
		return this.current.get(ticker);
	}

	getAllSummaries(): TickerSummary[] {
		return [...this.current.entries()].map(([ticker, point]) => ({
			ticker,
			currentPrice: point.price,
			previousPrice: this.previous.get(ticker) ?? point.price,
		}));
	}

	hasTicker(ticker: string): boolean {
		return this.history.has(ticker);
	}
}
