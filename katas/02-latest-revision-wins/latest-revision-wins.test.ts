import { describe, expect, it } from 'vitest';
import { latestReadings } from './starter.ts';

describe('latestReadings', () => {
  it('keeps a reading delivered twice once', () => {
    const r = { meterId: 'm1', start: '2026-11-23T00:00:00Z', wh: 400, revision: 1 };
    expect(latestReadings([r, r])).toEqual([r]);
  });

  it('keeps the higher revision even when it arrives first', () => {
    const corrected = { meterId: 'm1', start: '2026-11-23T00:00:00Z', wh: 450, revision: 2 };
    const original = { ...corrected, wh: 400, revision: 1 };
    expect(latestReadings([corrected, original])).toEqual([corrected]);
  });

  it('sorts by start, then meter', () => {
    const late = { meterId: 'm1', start: '2026-11-23T00:30:00Z', wh: 1, revision: 1 };
    const early2 = { meterId: 'm2', start: '2026-11-23T00:00:00Z', wh: 2, revision: 1 };
    const early1 = { meterId: 'm1', start: '2026-11-23T00:00:00Z', wh: 3, revision: 1 };
    expect(latestReadings([late, early2, early1])).toEqual([early1, early2, late]);
  });
});
