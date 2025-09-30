import Fastify from 'fastify';
import { prisma, OrderStatus } from '@sdt/database';

const app = Fastify();

app.post('/ingest/sap/idoc', async (request, reply) => {
  const payload = request.body as {
    confirmationNumber: string;
    customerName: string;
    supplierName: string;
    lines: Array<{ sku: string; quantity: number; description: string; requiredDate: string }>;
  };
  let market = await prisma.market.findFirst();
  if (!market) {
    market = await prisma.market.create({ data: { code: 'GLOBAL', name: 'Global' } });
  }

  const customer = await prisma.customer.upsert({
    where: { name: payload.customerName },
    update: {},
    create: { name: payload.customerName, marketId: market.id }
  });
  const supplier = await prisma.supplier.upsert({
    where: { name: payload.supplierName },
    update: {},
    create: { name: payload.supplierName }
  });
  const order = await prisma.order.upsert({
    where: { confirmationNumber: payload.confirmationNumber },
    update: {},
    create: {
      confirmationNumber: payload.confirmationNumber,
      customerId: customer.id,
      supplierId: supplier.id,
      status: OrderStatus.CONFIRMED,
      orderLines: {
        create: payload.lines.map((line) => ({
          sku: line.sku,
          description: line.description,
          quantity: line.quantity,
          requiredDate: new Date(line.requiredDate)
        }))
      }
    }
  });
  await prisma.shipmentOutbox.create({
    data: {
      eventType: 'order.ingested',
      payload: { orderId: order.id, confirmationNumber: order.confirmationNumber }
    }
  });
  reply.code(201);
  return { orderId: order.id };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3100, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
