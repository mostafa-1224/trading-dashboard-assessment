export interface MockUser {
	username: string;
	displayName: string;
	password: string; // plain-text for mock purposes only — never do this in production
}

export const MOCK_USERS: MockUser[] = [
	{ username: 'admin', displayName: 'Admin', password: 'password123' },
	{ username: 'trader', displayName: 'Trader Joe', password: 'trade456' },
];

export function findUser(username: string, password: string): MockUser | null {
	return MOCK_USERS.find((u) => u.username === username && u.password === password) ?? null;
}
