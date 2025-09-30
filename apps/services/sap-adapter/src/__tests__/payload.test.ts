import { describe, expect, it } from 'vitest';

describe('sap payload mock', () => {
  it('matches expected structure', () => {
    const payload = {
      confirmationNumber: 'OC-TEST',
      customerName: 'Test Airline',
      supplierName: 'Supplier',
      lines: [{ sku: 'SKU-1', quantity: 1, description: 'Part', requiredDate: new Date().toISOString() }]
    };
    expect(payload.lines[0]).toHaveProperty('sku');
  });
});
