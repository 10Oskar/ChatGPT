import { describe, expect, it } from 'vitest';

describe('tms event mock', () => {
  it('includes shipment id', () => {
    const payload = { shipmentId: 'shp-1', status: 'IN_TRANSIT' };
    expect(payload.shipmentId).toBeDefined();
  });
});
