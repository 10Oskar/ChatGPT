import { describe, expect, it } from 'vitest';
import { sortSequence } from '../logic';

describe('sortSequence', () => {
  it('orders by criticality then eta', () => {
    const now = new Date();
    const seq = sortSequence([
      { id: 'a', criticality: 0, eta: new Date(now.getTime() + 60000) },
      { id: 'b', criticality: 1, eta: new Date(now.getTime() + 120000) },
      { id: 'c', criticality: 1, eta: new Date(now.getTime() + 30000) }
    ]);
    expect(seq[0].id).toBe('c');
    expect(seq[1].id).toBe('b');
  });
});
