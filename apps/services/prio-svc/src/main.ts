import Fastify from 'fastify';
import YAML from 'yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '@sdt/database';
import { thompsonSamplingSimulator } from '@sdt/simulation';

interface WeightConfig {
  role: string;
  criteria: Record<string, number>;
}

const loadWeights = (role: string): WeightConfig => {
  const candidate = join(process.cwd(), 'src', `weights.${role.toLowerCase()}.yml`);
  const fallback = join(process.cwd(), 'src', 'weights.sac.yml');
  const file = (() => {
    try {
      return readFileSync(candidate, 'utf-8');
    } catch (err) {
      return readFileSync(fallback, 'utf-8');
    }
  })();
  return YAML.parse(file) as WeightConfig;
};

const calculateScores = (weights: WeightConfig, data: Array<Record<string, number>>) => {
  return data.map((row) => {
    const score = Object.entries(weights.criteria).reduce((acc, [key, weight]) => acc + (row[key] ?? 0) * weight, 0);
    return { score, features: row };
  });
};

const app = Fastify();

app.get('/priorities/:role', async (request) => {
  const { role } = request.params as { role: string };
  const weights = loadWeights(role);
  const orders = await prisma.order.findMany({
    include: { customer: true, orderLines: true }
  });
  const dataset = orders.map((order) => ({
    ContractTier: order.customer.name.includes('Aero') ? 1 : 0.6,
    Criticality: order.orderLines.some((line) => line.sku.includes('TB')) ? 1 : 0.5,
    DelayIterations: Math.random(),
    AgingDays: Math.random() * 10,
    EtaDelta: Math.random() * 6,
    CustomerSegment: order.customer.name.includes('Regional') ? 0.4 : 0.8,
    ExpediteCost: Math.random() * 1000,
    Co2Delta: Math.random() * 50
  }));
  const scores = calculateScores(weights, dataset);
  const ranked = scores
    .map((score, index) => ({
      order: orders[index],
      score: score.score,
      explanation: Object.entries(weights.criteria).map(([key, weight]) => ({
        key,
        weight,
        contribution: (dataset[index][key] ?? 0) * weight
      }))
    }))
    .sort((a, b) => b.score - a.score);

  return { role, ranked };
});

app.get('/bandit/simulator', async () => {
  const rewards = Array.from({ length: 20 }, () => Math.random() * 10);
  return { regrets: thompsonSamplingSimulator(rewards) };
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
