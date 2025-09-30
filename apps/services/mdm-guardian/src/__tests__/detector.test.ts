import { describe, expect, it } from 'vitest';
import { findIssues } from '../detector';

describe('findIssues', () => {
  it('identifies missing HS codes', () => {
    const issues = findIssues([
      { id: '1', externalRef: null },
      { id: '2', externalRef: 'HS-123' }
    ]);
    expect(issues).toContain('1');
    expect(issues).not.toContain('2');
  });
});
