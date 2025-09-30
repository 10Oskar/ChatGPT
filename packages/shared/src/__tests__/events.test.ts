import { describe, expect, it } from 'vitest';
import { domainEventSchema } from '../events/domain-events';

describe('domainEventSchema', () => {
  it('validates order events', () => {
    const result = domainEventSchema.safeParse({
      id: 'evt-1',
      type: 'order.ingested',
      occurredAt: new Date().toISOString(),
      source: 'sap-adapter',
      payload: {
        orderId: 'order-1',
        externalRef: '450001',
        status: 'CONFIRMED'
      }
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid events', () => {
    const result = domainEventSchema.safeParse({
      id: 'evt-2',
      type: 'order.ingested',
      occurredAt: new Date().toISOString(),
      source: 'sap-adapter',
      payload: {
        orderId: 'order-1',
        externalRef: '450001',
        status: 'FOO'
      }
    });

    expect(result.success).toBe(false);
  });
});
