import { Router } from 'express';
import { login } from './authController';

export function createAuthRouter(): Router {
	const router = Router();
	router.post('/login', login);
	return router;
}
