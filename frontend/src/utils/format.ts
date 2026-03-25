const FX_TICKERS = new Set(['EUR-USD']);
const CRYPTO_TICKERS = new Set(['BTC-USD', 'ETH-USD']);

export function formatPrice(price: number, ticker: string): string {
	if (FX_TICKERS.has(ticker)) {
		return price.toLocaleString('en-US', {
			minimumFractionDigits: 4,
			maximumFractionDigits: 4,
		});
	}
	if (CRYPTO_TICKERS.has(ticker)) {
		return price.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 2,
		});
	}
	return price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function formatChartPrice(price: number): string {
	if (price >= 1000) {
		return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
	}
	return `$${price.toFixed(2)}`;
}

export function formatTime(timestamp: number): string {
	return new Date(timestamp).toLocaleTimeString();
}

export function formatChartTime(timestamp: number): string {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}
