export interface PricePoint {
	ticker: string;
	price: number;
	timestamp: number;
}

export interface TickerSummary {
	ticker: string;
	currentPrice: number;
	previousPrice: number;
}

export interface TickerInfo {
	ticker: string;
	name: string;
	sector: string;
	assetClass: string;
	exchange: string;
	description: string;
	seedPrice: number;
}

export type ClientMessage =
	| { type: 'subscribe'; tickers: string[] }
	| { type: 'unsubscribe'; tickers: string[] };

export type ServerMessage =
	| { type: 'price_update'; data: PricePoint }
	| { type: 'subscribed'; tickers: string[] }
	| { type: 'error'; message: string };
