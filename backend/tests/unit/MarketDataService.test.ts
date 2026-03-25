import { MarketDataService } from '../../src/services/MarketDataService';
import { PriceEngine } from '../../src/domain/PriceEngine';
import { InMemoryStore } from '../../src/storage/InMemoryStore';
import { PricePoint } from '../../src/domain/types';

const SEEDS = { AAPL: 182.0, TSLA: 245.0 };

describe('MarketDataService', () => {
  let engine: PriceEngine;
  let store: InMemoryStore;
  let service: MarketDataService;

  beforeEach(() => {
    jest.useFakeTimers();
    engine = new PriceEngine({ ...SEEDS });
    store = new InMemoryStore();
    service = new MarketDataService(engine, store, 1000);
  });

  afterEach(() => {
    service.stop();
    jest.useRealTimers();
  });

  it('getTickers returns all tickers', () => {
    expect(service.getTickers()).toEqual(expect.arrayContaining(['AAPL', 'TSLA']));
  });

  it('isValidTicker returns true for known tickers', () => {
    expect(service.isValidTicker('AAPL')).toBe(true);
    expect(service.isValidTicker('UNKNOWN')).toBe(false);
  });

  it('emits price_update events after starting', () => {
    const updates: PricePoint[] = [];
    service.on('price_update', (p: PricePoint) => updates.push(p));

    service.start();
    jest.advanceTimersByTime(1000);

    expect(updates.length).toBeGreaterThan(0);
    expect(updates[0]).toHaveProperty('ticker');
    expect(updates[0]).toHaveProperty('price');
    expect(updates[0]).toHaveProperty('timestamp');
  });

  it('stores price points in history after ticking', () => {
    service.start();
    jest.advanceTimersByTime(3000);

    const history = service.getHistory('AAPL');
    expect(history.length).toBeGreaterThan(0);
  });

  it('stop prevents further updates', () => {
    const updates: PricePoint[] = [];
    service.on('price_update', (p: PricePoint) => updates.push(p));

    service.start();
    jest.advanceTimersByTime(2000);
    const countAfterStart = updates.length;

    service.stop();
    jest.advanceTimersByTime(5000);
    expect(updates.length).toBe(countAfterStart);
  });

  it('getAllSummaries returns ticker summaries after ticking', () => {
    service.start();
    jest.advanceTimersByTime(1000);

    const summaries = service.getAllSummaries();
    expect(summaries.length).toBeGreaterThan(0);
    const aapl = summaries.find((s) => s.ticker === 'AAPL');
    expect(aapl).toBeDefined();
    expect(aapl!.currentPrice).toBeGreaterThan(0);
  });
});
