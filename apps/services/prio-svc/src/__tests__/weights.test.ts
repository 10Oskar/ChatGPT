import { describe, expect, it } from 'vitest';
import YAML from 'yaml';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('weights config', () => {
  it('parses SAC weights', () => {
    const raw = readFileSync(join(__dirname, '..', 'weights.sac.yml'), 'utf-8');
    const parsed = YAML.parse(raw);
    expect(parsed.role).toBe('SAC');
    expect(Object.keys(parsed.criteria)).toContain('ContractTier');
  });
});
