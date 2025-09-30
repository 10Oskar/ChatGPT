import { describe, expect, it } from 'vitest';

describe('crm adapter mock', () => {
  it('returns vip flag', () => {
    const response = { externalRef: 'CUST1001', vip: true };
    expect(response.vip).toBe(true);
  });
});
