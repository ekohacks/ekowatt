import { fc, test } from '@fast-check/vitest';
import { describe, expect, it } from 'vitest';
import { cheapestRun, type Slot } from './starter.ts';

// Consecutive half hours from 01:00, so a test only has to give prices and supply.
const day = (rows: readonly [number, boolean][]): Slot[] =>
  rows.map(([kobo, supplied], i) => ({
    start: `${String(1 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    kobo,
    supplied,
  }));

describe('cheapestRun', () => {
  it('finds the cheapest run of consecutive half hours, not the cheapest half hours', () => {
    // The two cheapest half hours, 01:00 and 02:00, are not next to each other. Greedy picks
    // them; the cheapest unbroken pair is 02:00 and 02:30, at 250.
    const slots = day([
      [100, true],
      [400, true],
      [100, true],
      [150, true],
      [150, true],
    ]);
    expect(cheapestRun(slots, 2)).toEqual(['02:00', '02:30']);
  });

  it('never runs through a half hour without supply', () => {
    const slots = day([
      [50, true],
      [50, false],
      [200, true],
      [200, true],
    ]);
    expect(cheapestRun(slots, 2)).toEqual(['02:00', '02:30']);
  });

  it('takes the earlier run when totals tie', () => {
    const slots = day([
      [100, true],
      [100, true],
      [100, true],
    ]);
    expect(cheapestRun(slots, 2)).toEqual(['01:00', '01:30']);
  });

  it('fails clearly when no unbroken run is long enough', () => {
    const slots = day([
      [100, true],
      [100, true],
      [100, false],
      [100, true],
    ]);
    expect(() => cheapestRun(slots, 3)).toThrow('no unbroken run');
  });

  describe('cheapestRun() invariants', () => {
    // The slow, obviously right answer: try every window, keep the first cheapest.
    const everyWindow = (slots: readonly Slot[], k: number): string[] | null => {
      let best: { total: number; at: number } | null = null;
      for (let at = 0; at + k <= slots.length; at++) {
        const run = slots.slice(at, at + k);
        if (!run.every((s) => s.supplied)) {
          continue;
        }
        const total = run.reduce((sum, s) => sum + s.kobo, 0);
        if (best === null || total < best.total) {
          best = { total, at };
        }
      }
      return best === null ? null : slots.slice(best.at, best.at + k).map((s) => s.start);
    };

    const rows = fc.array(fc.tuple(fc.integer({ min: 0, max: 500 }), fc.boolean()), {
      minLength: 1,
      maxLength: 12,
    });

    // On its own this law would pass for an answer as slow as the oracle. The kata is about
    // doing it in one pass; thinking.md says how.
    test.prop([rows, fc.integer({ min: 1, max: 4 })])(
      'gives the same run as trying every window',
      (r, k) => {
        const slots = day(r);
        const expected = everyWindow(slots, k);
        if (expected === null) {
          expect(() => cheapestRun(slots, k)).toThrow('no unbroken run');
        } else {
          expect(cheapestRun(slots, k)).toEqual(expected);
        }
      },
    );
  });
});
