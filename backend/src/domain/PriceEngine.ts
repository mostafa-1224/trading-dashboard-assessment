import { PricePoint } from './types';

const VOLATILITY = 0.005; // 0.5% max fluctuation per tick

export class PriceEngine {
	private prices: Map<string, number>;

	constructor(seeds: Record<string, number>) {
		this.prices = new Map(Object.entries(seeds));
	}

	tick(ticker: string): PricePoint {
		const current = this.prices.get(ticker);
		if (current === undefined) {
			throw new Error(`Unknown ticker: ${ticker}`);
		}
		const delta = current * VOLATILITY * (Math.random() * 2 - 1);
		const next = Math.max(0.01, current + delta);
		this.prices.set(ticker, next);
		return { ticker, price: next, timestamp: Date.now() };
	}

	getCurrentPrice(ticker: string): number | undefined {
		return this.prices.get(ticker);
	}

	getTickers(): string[] {
		return [...this.prices.keys()];
	}

	hasTicker(ticker: string): boolean {
		return this.prices.has(ticker);
	}
}
