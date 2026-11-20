import { fc, test } from '@fast-check/vitest';
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

  it('keeps the higher revision when it arrives later', () => {
    const original = { meterId: 'm1', start: '2026-11-23T00:00:00Z', wh: 400, revision: 1 };
    const corrected = { ...original, wh: 450, revision: 2 };
    expect(latestReadings([original, corrected])).toEqual([corrected]);
  });

  it('sorts by start, then meter', () => {
    const late = { meterId: 'm1', start: '2026-11-23T00:30:00Z', wh: 1, revision: 1 };
    const early2 = { meterId: 'm2', start: '2026-11-23T00:00:00Z', wh: 2, revision: 1 };
    const early1 = { meterId: 'm1', start: '2026-11-23T00:00:00Z', wh: 3, revision: 1 };
    expect(latestReadings([late, early2, early1])).toEqual([early1, early2, late]);
  });

  describe('latestReadings() invariants', () => {
    // Two meters, two half hours, revisions 1 to 5, one reading per revision per slot, so
    // "the highest revision" is always well defined.
    const reading = fc.record({
      meterId: fc.constantFrom('m1', 'm2'),
      start: fc.constantFrom('2026-11-23T00:00:00Z', '2026-11-23T00:30:00Z'),
      wh: fc.integer({ min: 0, max: 2000 }),
      revision: fc.integer({ min: 1, max: 5 }),
    });
    const readings = fc.uniqueArray(reading, {
      selector: (r) => `${r.meterId}|${r.start}|${String(r.revision)}`,
      maxLength: 8,
    });
    // The same readings, arriving in another order, with some of them delivered again.
    const arrivals = readings.chain((rs) =>
      fc.tuple(
        fc.constant(rs),
        fc.shuffledSubarray(rs, { minLength: rs.length, maxLength: rs.length }),
        fc.subarray(rs),
      ),
    );

    // On its own this law would pass for a function that always returns []. The examples above
    // are what rule that out, which is why they stay.
    test.prop([arrivals])(
      'gives the same readings whatever order they arrive in and however often one repeats',
      ([rs, shuffled, again]) => {
        expect(latestReadings([...shuffled, ...again])).toEqual(latestReadings(rs));
      },
    );
  });
});
