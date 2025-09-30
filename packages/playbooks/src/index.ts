import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';

const playbookSchema = z.object({
  id: z.string(),
  name: z.string(),
  preconditions: z.array(
    z.object({
      type: z.string(),
      value: z.union([z.string(), z.number()])
    })
  ),
  steps: z.array(
    z.object({
      description: z.string(),
      etaImpactHours: z.number(),
      costImpactUsd: z.number(),
      co2ImpactKg: z.number()
    })
  ),
  outcomes: z.object({
    customerNotice: z.boolean(),
    requiresApproval: z.boolean()
  })
});

export type Playbook = z.infer<typeof playbookSchema>;

export const loadPlaybooks = (dir = join(__dirname, 'data')): Playbook[] => {
  const files = readdirSync(dir).filter((file) => file.endsWith('.yml'));
  return files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const parsed = YAML.parse(raw);
    return playbookSchema.parse(parsed);
  });
};
