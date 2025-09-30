import { describe, expect, it } from 'vitest';
import { runScenario, thompsonSamplingSimulator } from '..';

describe('runScenario', () => {
  it('calculates deterministic deltas', () => {
    const result = runScenario({
      id: 'scenario-1',
      name: 'Green Route',
      parameters: {
        route: 'green-route',
        safetyStockDelta: 5,
        sourcingSplit: 0.6,
        carrier: 'CarrierA',
        dcBypass: true,
        expedite: false
      }
    });

    expect(result.co2DeltaKg).toBeLessThan(0);
  });
});

describe('thompsonSamplingSimulator', () => {
  it('produces regret curve', () => {
    const points = thompsonSamplingSimulator([5, 3, 6, 2]);
    expect(points.at(-1)?.iteration).toBe(4);
  });
});
