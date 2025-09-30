import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('risk feed', () => {
  it('contains transport events', () => {
    const raw = readFileSync(join(__dirname, '..', 'data', 'feed.json'), 'utf-8');
    const feed = JSON.parse(raw) as Array<{ category: string }>;
    expect(feed.some((item) => item.category === 'transport')).toBe(true);
  });
});
