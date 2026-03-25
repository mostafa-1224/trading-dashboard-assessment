import { Router } from 'express';
import { MarketDataService } from '../services/MarketDataService';
import { createMarketController } from '../controllers/marketController';

export function createMarketRouter(marketService: MarketDataService): Router {
	const router = Router();
	const { getTickers, getTickersInfo, getHistory } = createMarketController(marketService);

	router.get('/tickers', getTickers);
	router.get('/tickers/info', getTickersInfo);
	router.get('/history', getHistory);

	return router;
}
