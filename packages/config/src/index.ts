import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  REQUEST_LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info')
});

let cached: ReturnType<typeof schema.parse> | undefined;

export const loadConfig = () => {
  if (cached) return cached;
  loadEnv();
  cached = schema.parse(process.env);
  return cached;
};

export type AppConfig = ReturnType<typeof schema.parse>;
