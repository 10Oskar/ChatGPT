import Fastify from 'fastify';
import { prisma } from '@sdt/database';

const app = Fastify();

app.get('/customers/:externalRef', async (request) => {
  const { externalRef } = request.params as { externalRef: string };
  const customer = await prisma.customer.findFirst({ where: { externalRef } });
  return { externalRef, vip: customer?.name?.includes('Aero') ?? false };
});

app.post('/customers/:externalRef/status', async (request) => {
  const { externalRef } = request.params as { externalRef: string };
  const payload = request.body as { status: string };
  await prisma.alertOutbox.create({ data: { eventType: 'crm.status', payload: { externalRef, status: payload.status } } });
  return { ok: true };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3103, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
