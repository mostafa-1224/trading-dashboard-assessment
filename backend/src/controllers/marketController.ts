import { Request, Response } from 'express';
import { MarketDataService } from '../services/MarketDataService';

export function createMarketController(marketService: MarketDataService) {
	function getTickers(_req: Request, res: Response): void {
		res.json(marketService.getAllSummaries());
	}

	function getTickersInfo(_req: Request, res: Response): void {
		res.json(marketService.getAllTickerInfo());
	}

	function getHistory(req: Request, res: Response): void {
		const { ticker } = req.query;

		if (!ticker || typeof ticker !== 'string') {
			res.status(400).json({ error: 'Missing required query parameter: ticker' });
			return;
		}

		if (!marketService.isValidTicker(ticker)) {
			res.status(400).json({
				error: `Invalid ticker: ${ticker}. Valid tickers: ${marketService.getTickers().join(', ')}`,
			});
			return;
		}

		res.json(marketService.getHistory(ticker));
	}

	return { getTickers, getTickersInfo, getHistory };
}
