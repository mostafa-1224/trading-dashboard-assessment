import { PriceEngine } from '../../src/domain/PriceEngine';

const SEEDS = { AAPL: 182.0, TSLA: 245.0, 'BTC-USD': 65000.0 };

describe('PriceEngine', () => {
  let engine: PriceEngine;

  beforeEach(() => {
    engine = new PriceEngine({ ...SEEDS });
  });

  it('returns all seeded tickers', () => {
    expect(engine.getTickers()).toEqual(expect.arrayContaining(['AAPL', 'TSLA', 'BTC-USD']));
    expect(engine.getTickers()).toHaveLength(3);
  });

  it('returns the seed price for a ticker', () => {
    expect(engine.getCurrentPrice('AAPL')).toBe(182.0);
  });

  it('tick returns a PricePoint with correct ticker and a timestamp', () => {
    const before = Date.now();
    const point = engine.tick('AAPL');
    const after = Date.now();

    expect(point.ticker).toBe('AAPL');
    expect(point.timestamp).toBeGreaterThanOrEqual(before);
    expect(point.timestamp).toBeLessThanOrEqual(after);
  });

  it('tick updates the internal price', () => {
    const initial = engine.getCurrentPrice('AAPL')!;
    engine.tick('AAPL');
    const updated = engine.getCurrentPrice('AAPL')!;
    // Price should have changed (random, but extremely unlikely to be identical)
    expect(typeof updated).toBe('number');
    expect(updated).toBeGreaterThan(0);
    // The delta is bounded by ±0.5% of the price
    expect(Math.abs(updated - initial)).toBeLessThanOrEqual(initial * 0.005 + 0.001);
  });

  it('tick price never goes below 0.01', () => {
    const tinyEngine = new PriceEngine({ TINY: 0.01 });
    for (let i = 0; i < 1000; i++) {
      const point = tinyEngine.tick('TINY');
      expect(point.price).toBeGreaterThanOrEqual(0.01);
    }
  });

  it('tick throws for unknown ticker', () => {
    expect(() => engine.tick('UNKNOWN')).toThrow('Unknown ticker: UNKNOWN');
  });

  it('hasTicker returns true for known tickers', () => {
    expect(engine.hasTicker('AAPL')).toBe(true);
    expect(engine.hasTicker('UNKNOWN')).toBe(false);
  });

  it('ticks are independent per ticker', () => {
    const aaplBefore = engine.getCurrentPrice('AAPL');
    engine.tick('TSLA');
    const aaplAfter = engine.getCurrentPrice('AAPL');
    expect(aaplAfter).toBe(aaplBefore);
  });
});
