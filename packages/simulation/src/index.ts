import { z } from 'zod';

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  parameters: z.object({
    route: z.string(),
    safetyStockDelta: z.number(),
    sourcingSplit: z.number(),
    carrier: z.string(),
    dcBypass: z.boolean(),
    expedite: z.boolean()
  })
});

export type Scenario = z.infer<typeof scenarioSchema>;

export interface SimulationResult {
  timeDeltaHours: number;
  costDeltaUsd: number;
  co2DeltaKg: number;
  riskDelta: number;
}

export const runScenario = (scenario: Scenario): SimulationResult => {
  const { parameters } = scenario;
  const timeDeltaHours = parameters.dcBypass ? -12 : parameters.expedite ? -6 : 4;
  const costDeltaUsd = parameters.expedite ? 800 : parameters.safetyStockDelta * 50;
  const co2DeltaKg = parameters.route.includes('green') ? -120 : 40;
  const riskDelta = parameters.safetyStockDelta > 0 ? -0.2 : 0.1;
  return { timeDeltaHours, costDeltaUsd, co2DeltaKg, riskDelta };
};

export interface RegretPoint {
  iteration: number;
  cumulativeRegret: number;
}

export const thompsonSamplingSimulator = (rewards: number[]): RegretPoint[] => {
  let cumulativeBest = 0;
  let cumulativeActual = 0;
  const points: RegretPoint[] = [];
  rewards.forEach((reward, index) => {
    cumulativeActual += reward;
    cumulativeBest += Math.max(...rewards.slice(0, index + 1));
    points.push({ iteration: index + 1, cumulativeRegret: cumulativeBest - cumulativeActual });
  });
  return points;
};
