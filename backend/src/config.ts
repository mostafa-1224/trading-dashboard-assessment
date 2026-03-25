export const PORT = parseInt(process.env.PORT ?? '3001', 10);

export const TICK_INTERVAL_MS = parseInt(process.env.TICK_INTERVAL_MS ?? '1000', 10);

export const SEED_PRICES: Record<string, number> = {
	AAPL: 182.0,
	TSLA: 245.0,
	MSFT: 415.0,
	GOOGL: 175.0,
	AMZN: 195.0,
	NVDA: 875.0,
	META: 520.0,
	'BTC-USD': 65000.0,
	'ETH-USD': 3500.0,
	GOLD: 2350.0,
	'EUR-USD': 1.085,
};

export const TICKER_INFO: Record<
	string,
	{
		name: string;
		sector: string;
		assetClass: string;
		exchange: string;
		description: string;
	}
> = {
	AAPL: {
		name: 'Apple Inc.',
		sector: 'Technology',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description:
			'Designs and manufactures consumer electronics, software, and online services.',
	},
	TSLA: {
		name: 'Tesla Inc.',
		sector: 'Consumer Discretionary',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description:
			'Designs, develops, and manufactures electric vehicles and energy storage systems.',
	},
	MSFT: {
		name: 'Microsoft Corporation',
		sector: 'Technology',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description:
			'Develops and licenses software, cloud services, and hardware products globally.',
	},
	GOOGL: {
		name: 'Alphabet Inc.',
		sector: 'Communication Services',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description: 'Parent company of Google offering search, advertising, and cloud services.',
	},
	AMZN: {
		name: 'Amazon.com Inc.',
		sector: 'Consumer Discretionary',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description:
			'Operates e-commerce, cloud computing (AWS), digital streaming, and AI services.',
	},
	NVDA: {
		name: 'NVIDIA Corporation',
		sector: 'Technology',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description:
			'Designs graphics processing units and system-on-chip units for gaming and AI.',
	},
	META: {
		name: 'Meta Platforms Inc.',
		sector: 'Communication Services',
		assetClass: 'Equity',
		exchange: 'NASDAQ',
		description: 'Operates social media platforms including Facebook, Instagram, and WhatsApp.',
	},
	'BTC-USD': {
		name: 'Bitcoin',
		sector: 'Cryptocurrency',
		assetClass: 'Crypto',
		exchange: 'Crypto',
		description:
			'Decentralised digital currency operating on a peer-to-peer blockchain network.',
	},
	'ETH-USD': {
		name: 'Ethereum',
		sector: 'Cryptocurrency',
		assetClass: 'Crypto',
		exchange: 'Crypto',
		description:
			'Blockchain platform supporting smart contracts and decentralised applications.',
	},
	GOLD: {
		name: 'Gold Spot (USD/oz)',
		sector: 'Commodities',
		assetClass: 'Commodity',
		exchange: 'COMEX',
		description: 'Spot price of gold in US dollars per troy ounce, a key safe-haven asset.',
	},
	'EUR-USD': {
		name: 'Euro / US Dollar',
		sector: 'Forex',
		assetClass: 'FX',
		exchange: 'FX',
		description:
			'Exchange rate between the Euro and the US Dollar, the most traded currency pair.',
	},
};

export const VALID_TICKERS = Object.keys(SEED_PRICES);
