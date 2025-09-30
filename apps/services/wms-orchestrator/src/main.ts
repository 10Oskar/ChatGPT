import Fastify from 'fastify';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@sdt/database';
import { sortSequence } from './logic';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const queue = new Queue('pick-wave', { connection });

const app = Fastify();

app.get('/resequence/:facilityId', async (request) => {
  const { facilityId } = request.params as { facilityId: string };
  const orders = await prisma.order.findMany({
    where: { shipments: { some: { facilityId } } },
    include: { orderLines: true, shipments: true }
  });
  const sequence = sortSequence(
    orders.map((order) => ({
      id: order.id,
      criticality: order.orderLines.some((line) => line.quantity >= 5) ? 1 : 0,
      eta: order.shipments[0]?.eta ?? new Date()
    }))
  );

  await queue.add('resequence', { facilityId, sequence });
  return { facilityId, sequence };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
