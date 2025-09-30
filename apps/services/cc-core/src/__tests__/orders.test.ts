import { describe, expect, it, vi, beforeEach } from 'vitest';
import Fastify from 'fastify';
import { registerOrderRoutes } from '../modules/orders';

vi.mock('@sdt/database', () => ({
  prisma: {
    order: {
      findUnique: vi.fn()
    }
  }
}));

const prisma = (await import('@sdt/database')).prisma as unknown as {
  order: { findUnique: ReturnType<typeof vi.fn> };
};

describe('order routes', () => {
  beforeEach(() => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'order-1',
      confirmationNumber: 'OC-1001',
      orderLines: [{ id: 'line-1', quantity: 4, allocatedQuantity: 4 }],
      alerts: [],
      shipments: [],
      customer: {},
      supplier: {}
    });
  });

  it('returns perfect order flag when allocated quantities match', async () => {
    const app = Fastify();
    registerOrderRoutes(app);

    const response = await app.inject({ method: 'GET', url: '/orders/OC-1001' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.perfectOrder).toBe(true);
  });
});
