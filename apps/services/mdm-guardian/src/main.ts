import Fastify from 'fastify';
import { prisma } from '@sdt/database';
import { findIssues } from './detector';

const app = Fastify();

app.get('/scan', async () => {
  const lines = await prisma.orderLine.findMany({});
  const issueIds = findIssues(lines.map((line) => ({ id: line.id, externalRef: line.externalRef ?? null })));
  const created: string[] = [];
  for (const id of issueIds) {
    const issue = await prisma.masterDataIssue.create({
      data: {
        entityType: 'OrderLine',
        entityId: id,
        field: 'HS_CODE',
        description: 'Missing HS code for customs clearance',
        status: 'OPEN'
      }
    });
    created.push(issue.id);
  }
  return { scanned: lines.length, issues: created };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3004, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
