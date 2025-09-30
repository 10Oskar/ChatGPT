import { FastifyInstance } from 'fastify';
import { prisma } from '@sdt/database';

export const registerKpiRoutes = (app: FastifyInstance) => {
  app.get('/kpis', async () => {
    const readings = await prisma.kPIReading.findMany({ orderBy: { capturedAt: 'desc' } });
    const composite = readings.reduce((acc, reading) => acc + reading.value * reading.weight, 0);
    return { readings, composite };
  });
};
