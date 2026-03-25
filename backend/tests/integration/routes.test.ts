import request from 'supertest';
import { PriceEngine } from '../../src/domain/PriceEngine';
import { InMemoryStore } from '../../src/storage/InMemoryStore';
import { MarketDataService } from '../../src/services/MarketDataService';
import { createApp } from '../../src/app';
import { PricePoint } from '../../src/domain/types';

const SEEDS = { AAPL: 182.0, TSLA: 245.0, 'BTC-USD': 65000.0 };

function seedStore(store: InMemoryStore): void {
  const tickers = Object.keys(SEEDS);
  for (const ticker of tickers) {
    const point: PricePoint = { ticker, price: SEEDS[ticker as keyof typeof SEEDS], timestamp: Date.now() };
    store.push(point);
  }
}

describe('GET /api/tickers', () => {
  let app: ReturnType<typeof createApp>;
  let service: MarketDataService;

  beforeEach(() => {
    const engine = new PriceEngine({ ...SEEDS });
    const store = new InMemoryStore();
    seedStore(store);
    service = new MarketDataService(engine, store);
    app = createApp(service);
  });

  it('returns 200 with ticker summaries', async () => {
    const res = await request(app).get('/api/tickers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('each summary has ticker, currentPrice, and previousPrice', async () => {
    const res = await request(app).get('/api/tickers');
    for (const item of res.body) {
      expect(item).toHaveProperty('ticker');
      expect(item).toHaveProperty('currentPrice');
      expect(item).toHaveProperty('previousPrice');
      expect(typeof item.currentPrice).toBe('number');
    }
  });
});

describe('GET /api/history', () => {
  let app: ReturnType<typeof createApp>;
  let service: MarketDataService;

  beforeEach(() => {
    const engine = new PriceEngine({ ...SEEDS });
    const store = new InMemoryStore();
    seedStore(store);
    service = new MarketDataService(engine, store);
    app = createApp(service);
  });

  it('returns 200 with an array for a valid ticker', async () => {
    const res = await request(app).get('/api/history').query({ ticker: 'AAPL' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns history points with price and timestamp fields', async () => {
    const res = await request(app).get('/api/history').query({ ticker: 'AAPL' });
    expect(res.body.length).toBeGreaterThan(0);
    const point = res.body[0];
    expect(point).toHaveProperty('ticker', 'AAPL');
    expect(point).toHaveProperty('price');
    expect(point).toHaveProperty('timestamp');
  });

  it('returns 400 when ticker is missing', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for an invalid ticker', async () => {
    const res = await request(app).get('/api/history').query({ ticker: 'INVALID' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const engine = new PriceEngine({ ...SEEDS });
    const store = new InMemoryStore();
    const service = new MarketDataService(engine, store);
    const app = createApp(service);

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
