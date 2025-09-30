import { describe, expect, it } from 'vitest';
import { loadConfig } from '..';

describe('loadConfig', () => {
  it('loads environment with defaults', () => {
    process.env.DATABASE_URL = 'https://example.com';
    process.env.REDIS_URL = 'https://example.com/redis';
    process.env.JWT_SECRET = 'supersecret';
    process.env.REQUEST_LOG_LEVEL = 'info';

    const cfg = loadConfig();
    expect(cfg.NODE_ENV).toBe('development');
  });
});
