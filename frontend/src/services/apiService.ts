import axios from 'axios';
import { API_BASE_URL } from '../config';
import { PricePoint, TickerInfo, TickerSummary } from '../types/market';
import { AuthUser } from '../types/auth';

const client = axios.create({ baseURL: API_BASE_URL });

export async function loginUser(username: string, password: string): Promise<AuthUser> {
	const res = await client.post<AuthUser>('/api/auth/login', { username, password });
	return res.data;
}

export async function fetchTickers(): Promise<TickerSummary[]> {
	const res = await client.get<TickerSummary[]>('/api/tickers');
	return res.data;
}

export async function fetchTickerInfo(): Promise<TickerInfo[]> {
	const res = await client.get<TickerInfo[]>('/api/tickers/info');
	return res.data;
}

export async function fetchHistory(ticker: string): Promise<PricePoint[]> {
	const res = await client.get<PricePoint[]>('/api/history', { params: { ticker } });
	return res.data;
}
