import { FastifyInstance } from 'fastify';
import { prisma } from '@sdt/database';

export const registerOrderRoutes = (app: FastifyInstance) => {
  app.get('/orders/:confirmationNumber', {
    schema: {
      summary: 'Retrieve unified order lifecycle by confirmation number',
      params: {
        type: 'object',
        properties: {
          confirmationNumber: { type: 'string' }
        },
        required: ['confirmationNumber']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            order: { type: 'object' },
            perfectOrder: { type: 'boolean' },
            alerts: { type: 'array', items: { type: 'object' } },
            shipments: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  }, async (request) => {
    const { confirmationNumber } = request.params as { confirmationNumber: string };
    const order = await prisma.order.findUnique({
      where: { confirmationNumber },
      include: {
        customer: true,
        supplier: true,
        orderLines: { include: { pegAllocations: true } },
        shipments: { include: { events: true, carrier: true, facility: true } },
        alerts: true
      }
    });

    if (!order) {
      return { order: null, perfectOrder: false, alerts: [], shipments: [] };
    }

    const perfectOrder = order.orderLines.every((line) => line.allocatedQuantity >= line.quantity);
    return {
      order,
      perfectOrder,
      alerts: order.alerts,
      shipments: order.shipments
    };
  });
};
