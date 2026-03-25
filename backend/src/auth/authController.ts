import { Request, Response } from 'express';
import { findUser } from './mockUsers';

export function login(req: Request, res: Response): void {
	const { username, password } = req.body as { username?: string; password?: string };

	if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
		res.status(400).json({ error: 'username and password are required.' });
		return;
	}

	const user = findUser(username.trim(), password);
	if (!user) {
		res.status(401).json({ error: 'Invalid username or password.' });
		return;
	}

	res.json({ username: user.username, displayName: user.displayName });
}
