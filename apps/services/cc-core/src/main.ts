import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { loadConfig } from '@sdt/config';
import { prisma } from '@sdt/database';
import { registerOrderRoutes } from './modules/orders';
import { registerPeggingRoutes } from './modules/pegging';
import { registerAlertRoutes } from './modules/alerts';
import { registerKpiRoutes } from './modules/kpis';

const config = loadConfig();

const app = Fastify({
  logger: {
    level: config.REQUEST_LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: { translateTime: 'SYS:standard' }
    }
  }
});

await app.register(cors, { origin: true });
await app.register(helmet, { global: true });
await app.register(swagger, {
  openapi: {
    info: {
      title: 'Command Centre API',
      version: '1.0.0'
    }
  }
});
await app.register(swaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  transformSpecification: (swaggerObject) => swaggerObject,
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});

app.decorateRequest('requestId', null);
app.addHook('onRequest', async (req) => {
  req.requestContext = { correlationId: req.headers['x-correlation-id'] ?? req.id };
});

app.get('/health', async () => {
  await prisma.$queryRaw`SELECT 1`;
  return { status: 'ok', timestamp: new Date().toISOString() };
});

registerOrderRoutes(app);
registerPeggingRoutes(app);
registerAlertRoutes(app);
registerKpiRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
