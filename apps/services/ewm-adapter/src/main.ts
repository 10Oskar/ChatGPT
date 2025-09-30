import Fastify from 'fastify';
import { prisma } from '@sdt/database';

const app = Fastify();

app.post('/waves/release', async (request) => {
  const payload = request.body as { facilityId: string; orders: string[] };
  await prisma.alertOutbox.create({
    data: {
      eventType: 'ewm.waveReleased',
      payload: payload
    }
  });
  return { status: 'released', ...payload };
});

app.get('/waves/:facilityId', async (request) => {
  const { facilityId } = request.params as { facilityId: string };
  const shipments = await prisma.shipment.findMany({ where: { facilityId } });
  return { facilityId, shipments };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3101, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
