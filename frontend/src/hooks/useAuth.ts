import { useState, useCallback } from 'react';
import { loginUser } from '../services/apiService';
import { AuthUser } from '../types/auth';

export type { AuthUser };

const STORAGE_KEY = 'auth_user';

export type LoginResult = { ok: true } | { ok: false; error: string };

function loadPersistedUser(): AuthUser | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as AuthUser) : null;
	} catch {
		return null;
	}
}

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(loadPersistedUser);

	const login = useCallback(async (username: string, password: string): Promise<LoginResult> => {
		try {
			const authUser = await loginUser(username.trim(), password);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
			setUser(authUser);
			return { ok: true };
		} catch (err: unknown) {
			const message =
				(err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
				'Invalid username or password.';
			return { ok: false, error: message };
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem(STORAGE_KEY);
		setUser(null);
	}, []);

	return { user, login, logout };
}
