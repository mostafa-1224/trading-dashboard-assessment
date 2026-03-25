import { InMemoryStore } from '../../src/storage/InMemoryStore';
import { PricePoint } from '../../src/domain/types';

function makePoint(ticker: string, price: number, timestamp = Date.now()): PricePoint {
  return { ticker, price, timestamp };
}

describe('InMemoryStore', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('returns empty history for unknown ticker', () => {
    expect(store.getHistory('AAPL')).toEqual([]);
  });

  it('returns undefined for unknown current price', () => {
    expect(store.getCurrent('AAPL')).toBeUndefined();
  });

  it('stores and retrieves the current price', () => {
    const point = makePoint('AAPL', 182.0);
    store.push(point);
    expect(store.getCurrent('AAPL')).toEqual(point);
  });

  it('stores a price point in history', () => {
    const point = makePoint('AAPL', 182.0);
    store.push(point);
    expect(store.getHistory('AAPL')).toEqual([point]);
  });

  it('accumulates history over multiple pushes', () => {
    store.push(makePoint('AAPL', 100));
    store.push(makePoint('AAPL', 101));
    store.push(makePoint('AAPL', 102));
    expect(store.getHistory('AAPL')).toHaveLength(3);
  });

  it('caps history at 100 entries', () => {
    for (let i = 0; i < 120; i++) {
      store.push(makePoint('AAPL', 100 + i));
    }
    const history = store.getHistory('AAPL');
    expect(history).toHaveLength(100);
    expect(history[0].price).toBe(120);  // oldest kept = index 20
    expect(history[99].price).toBe(219); // newest = index 119
  });

  it('tracks previous price correctly', () => {
    store.push(makePoint('AAPL', 182.0));
    store.push(makePoint('AAPL', 185.0));
    const summaries = store.getAllSummaries();
    const aapl = summaries.find((s) => s.ticker === 'AAPL')!;
    expect(aapl.currentPrice).toBe(185.0);
    expect(aapl.previousPrice).toBe(182.0);
  });

  it('previousPrice equals currentPrice on first push', () => {
    store.push(makePoint('AAPL', 182.0));
    const summaries = store.getAllSummaries();
    const aapl = summaries.find((s) => s.ticker === 'AAPL')!;
    expect(aapl.previousPrice).toBe(182.0);
    expect(aapl.currentPrice).toBe(182.0);
  });

  it('getAllSummaries returns one entry per ticker', () => {
    store.push(makePoint('AAPL', 182.0));
    store.push(makePoint('TSLA', 245.0));
    store.push(makePoint('AAPL', 183.0));
    const summaries = store.getAllSummaries();
    expect(summaries).toHaveLength(2);
  });

  it('histories are independent per ticker', () => {
    store.push(makePoint('AAPL', 182.0));
    store.push(makePoint('TSLA', 245.0));
    expect(store.getHistory('AAPL')).toHaveLength(1);
    expect(store.getHistory('TSLA')).toHaveLength(1);
  });

  it('getHistory returns a copy, not the internal array', () => {
    store.push(makePoint('AAPL', 182.0));
    const history = store.getHistory('AAPL');
    history.push(makePoint('AAPL', 999.0));
    expect(store.getHistory('AAPL')).toHaveLength(1);
  });
});
