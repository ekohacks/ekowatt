import { describe, expect, it } from 'vitest';
import { missingHalfHours } from './starter.ts';

const fullDay = Array.from({ length: 48 }, (_, i) => ({
  start: new Date(Date.UTC(2026, 10, 23) + i * 1_800_000).toISOString(),
  wh: 100,
}));

describe('missingHalfHours', () => {
  it('finds nothing missing in a full day', () => {
    expect(missingHalfHours('2026-11-23', fullDay)).toEqual([]);
  });

  it('finds one gap', () => {
    const gappy = fullDay.filter((_, i) => i !== 3);
    expect(missingHalfHours('2026-11-23', gappy)).toEqual(['2026-11-23T01:30:00.000Z']);
  });

  it('finds all 48 when there are no readings', () => {
    expect(missingHalfHours('2026-11-23', [])).toHaveLength(48);
  });

  it('matches a reading written without milliseconds', () => {
    const one = [{ start: '2026-11-23T00:00:00Z', wh: 1 }];
    expect(missingHalfHours('2026-11-23', one)).not.toContain('2026-11-23T00:00:00.000Z');
  });
});
