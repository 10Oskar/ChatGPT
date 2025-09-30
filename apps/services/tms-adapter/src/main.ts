import Fastify from 'fastify';
import { prisma, ShipmentStatus } from '@sdt/database';

const app = Fastify();

app.post('/carrier/events', async (request) => {
  const payload = request.body as { shipmentId: string; status: string; eta?: string; location?: string };
  await prisma.shipmentEvent.create({
    data: {
      shipmentId: payload.shipmentId,
      status: (payload.status as ShipmentStatus) ?? ShipmentStatus.IN_TRANSIT,
      occurredAt: new Date(),
      location: payload.location ?? 'Unknown'
    }
  });
  return { status: 'accepted' };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3102, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
