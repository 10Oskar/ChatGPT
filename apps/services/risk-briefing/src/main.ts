import Fastify from 'fastify';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma, AlertSeverity, AlertStatus } from '@sdt/database';

const app = Fastify();

const loadFeed = () => JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'feed.json'), 'utf-8')) as Array<{
  id: string;
  title: string;
  geography: string;
  category: string;
  severity: string;
}>;

app.get('/briefing', async () => {
  const feed = loadFeed();
  const alerts = [] as string[];
  for (const item of feed) {
    if (item.category === 'transport') {
      const alert = await prisma.alert.create({
        data: {
          type: 'ExternalRisk',
          description: item.title,
          severity: item.severity === 'high' ? AlertSeverity.CRITICAL : AlertSeverity.MEDIUM,
          status: AlertStatus.OPEN
        }
      });
      alerts.push(alert.id);
    }
  }
  return { feedCount: feed.length, alertsRaised: alerts };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3003, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
