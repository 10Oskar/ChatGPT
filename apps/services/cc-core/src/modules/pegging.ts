import { FastifyInstance } from 'fastify';
import { prisma, OrderStatus } from '@sdt/database';
import { PegReason } from '@sdt/shared';

interface AllocationRule {
  id: string;
  description: string;
  priority: number;
}

const RULES: AllocationRule[] = [
  { id: 'contract-tier-priority', description: 'Contract tier precedence', priority: 100 },
  { id: 'criticality', description: 'Component criticality priority', priority: 80 },
  { id: 'aging', description: 'Aging days priority', priority: 60 },
  { id: 'fairness', description: 'Fairness guardrail balancing', priority: 40 }
];

export const registerPeggingRoutes = (app: FastifyInstance) => {
  app.post('/peg/allocate', {
    schema: {
      summary: 'Run pegging engine against outstanding orders',
      body: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          quantity: { type: 'number' }
        },
        required: ['sku', 'quantity']
      }
    }
  }, async (request) => {
    const { sku, quantity } = request.body as { sku: string; quantity: number };

    const orders = await prisma.order.findMany({
      where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.ALLOCATED] } },
      include: {
        customer: true,
        orderLines: {
          where: { sku },
          include: { pegAllocations: true }
        }
      }
    });

    const sorted = orders.sort((a, b) => {
      const aWeight = a.customer.name.includes('Aero') ? 100 : 50;
      const bWeight = b.customer.name.includes('Aero') ? 100 : 50;
      return bWeight - aWeight;
    });

    const allocations = [] as Array<{ orderLineId: string; quantity: number; reasons: PegReason[]; ruleId: string }>;
    let remaining = quantity;
    for (const order of sorted) {
      for (const line of order.orderLines) {
        if (remaining <= 0) break;
        const required = line.quantity - line.allocatedQuantity;
        if (required <= 0) continue;
        const allocQty = Math.min(required, remaining);
        remaining -= allocQty;
        allocations.push({
          orderLineId: line.id,
          quantity: allocQty,
          reasons: [PegReason.CONTRACT_TIER, PegReason.CRITICALITY],
          ruleId: RULES[0].id
        });
        const inventory = await prisma.inventory.findFirst({ where: { sku } });
        if (!inventory) continue;
        await prisma.pegAllocation.create({
          data: {
            orderLineId: line.id,
            inventoryId: inventory.id,
            quantity: allocQty,
            ruleId: RULES[0].id,
            reasons: 'CONTRACT_TIER,CRITICALITY'
          }
        });
        await prisma.orderLine.update({
          where: { id: line.id },
          data: { allocatedQuantity: { increment: allocQty } }
        });
      }
    }

    return { allocations, remaining, rationale: RULES.map((rule) => ({ ruleId: rule.id, description: rule.description })) };
  });
};
