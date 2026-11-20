import { describe, expect, it } from 'vitest';
import { version } from '../src/index.ts';

describe('toolchain', () => {
  it('runs a test against the source', () => {
    expect(version).toBe('0.0.0');
  });
});
