import cors from 'cors';
import express, { Express } from 'express';
import { MarketDataService } from './services/MarketDataService';
import { createMarketRouter } from './routes/marketRoutes';
import { createAuthRouter } from './auth/authRoutes';

export function createApp(marketService: MarketDataService): Express {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/api/auth', createAuthRouter());
	app.use('/api', createMarketRouter(marketService));

	app.get('/health', (_req, res) => {
		res.json({ status: 'ok' });
	});

	return app;
}
