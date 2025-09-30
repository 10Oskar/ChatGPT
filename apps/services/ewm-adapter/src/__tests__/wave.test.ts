import { describe, expect, it } from 'vitest';

describe('wave payload', () => {
  it('contains orders array', () => {
    const payload = { facilityId: 'AMS-DC', orders: ['OC-1'] };
    expect(Array.isArray(payload.orders)).toBe(true);
  });
});
