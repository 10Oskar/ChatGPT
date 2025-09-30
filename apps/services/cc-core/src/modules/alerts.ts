import { FastifyInstance } from 'fastify';
import { prisma, AlertStatus } from '@sdt/database';
import { loadPlaybooks } from '@sdt/playbooks';

const playbooks = loadPlaybooks();

export const registerAlertRoutes = (app: FastifyInstance) => {
  app.get('/alerts/active', async () => {
    const alerts = await prisma.alert.findMany({
      where: { status: AlertStatus.OPEN },
      include: { order: { include: { customer: true } }, action: true }
    });
    return alerts.map((alert) => ({
      ...alert,
      playbook: playbooks.find((p) => p.id === alert.playbookId)
    }));
  });

  app.post('/alerts/:id/ack', async (request) => {
    const { id } = request.params as { id: string };
    const updated = await prisma.alert.update({
      where: { id },
      data: { status: AlertStatus.ACKNOWLEDGED }
    });
    await prisma.alertAudit.create({
      data: { alertId: id, message: 'Alert acknowledged', userId: null }
    });
    return updated;
  });

  app.post('/alerts/:id/actions', async (request) => {
    const { id } = request.params as { id: string };
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      return { error: 'Alert not found' };
    }
    const playbook = playbooks.find((p) => p.id === alert.playbookId);
    const action = await prisma.action.create({
      data: {
        alertId: id,
        name: playbook?.name ?? 'Manual Action',
        status: 'APPLIED',
        notes: playbook?.steps.map((step) => step.description).join(' -> ')
      }
    });
    await prisma.alert.update({ where: { id }, data: { status: AlertStatus.RESOLVED, actionId: action.id } });
    await prisma.alertAudit.create({
      data: { alertId: id, message: `Action ${action.name} applied`, userId: null }
    });
    return { alertId: id, action, playbook };
  });
};
