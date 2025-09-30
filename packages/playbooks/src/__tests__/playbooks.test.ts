import { describe, expect, it } from 'vitest';
import { loadPlaybooks } from '..';

describe('loadPlaybooks', () => {
  it('loads all playbooks and enforces schema', () => {
    const playbooks = loadPlaybooks();
    expect(playbooks.length).toBeGreaterThanOrEqual(8);
    expect(playbooks[0]).toHaveProperty('steps');
  });
});
