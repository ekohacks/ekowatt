import { fc, test } from '@fast-check/vitest';
import { describe, expect, it } from 'vitest';
import { MeterReadings, type Reading } from '../src/readings.ts';

const reading = (overrides: Partial<Reading> = {}): Reading => ({
  meterId: 'meter-1',
  intervalStart: '2026-11-20T00:00:00Z',
  wh: 420,
  revision: 1,
  ...overrides,
});

describe('MeterReadings', () => {
  it('starts with no readings', () => {
    expect(MeterReadings.empty().all()).toEqual([]);
  });

  it('keeps a reading under its meter and half hour', () => {
    const readings = MeterReadings.empty().record(reading());

    expect(readings.get('meter-1', '2026-11-20T00:00:00Z')).toEqual(reading());
  });

  it('keeps one reading when the same reading arrives twice', () => {
    const readings = MeterReadings.empty().record(reading()).record(reading());

    expect(readings.all()).toEqual([reading()]);
  });

  it('keeps readings for different half hours apart', () => {
    const first = reading();
    const second = reading({ intervalStart: '2026-11-20T00:30:00Z', wh: 380 });

    const readings = MeterReadings.empty().record(first).record(second);

    expect(readings.all()).toEqual([first, second]);
  });

  it('keeps readings for different meters apart', () => {
    const mine = reading();
    const theirs = reading({ meterId: 'meter-2', wh: 1100 });

    const readings = MeterReadings.empty().record(mine).record(theirs);

    expect(readings.get('meter-1', mine.intervalStart)).toEqual(mine);
    expect(readings.get('meter-2', theirs.intervalStart)).toEqual(theirs);
  });
});

describe('MeterReadings corrections', () => {
  it('keeps the higher revision when the correction arrives later', () => {
    const original = reading();
    const corrected = reading({ wh: 450, revision: 2 });

    const readings = MeterReadings.empty().record(original).record(corrected);

    expect(readings.all()).toEqual([corrected]);
  });

  it('keeps the higher revision when the correction arrives first', () => {
    const original = reading();
    const corrected = reading({ wh: 450, revision: 2 });

    const readings = MeterReadings.empty().record(corrected).record(original);

    expect(readings.all()).toEqual([corrected]);
  });

  describe('MeterReadings invariants', () => {
    const recordAll = (rs: readonly Reading[]) =>
      rs.reduce((kept, r) => kept.record(r), MeterReadings.empty());
    const inOrder = (rs: readonly Reading[]) =>
      [...rs].sort((a, b) =>
        a.intervalStart === b.intervalStart
          ? a.meterId.localeCompare(b.meterId)
          : a.intervalStart.localeCompare(b.intervalStart),
      );

    // Two meters, two half hours, revisions 1 to 5, one reading per revision per slot, so
    // "the highest revision" is always well defined.
    const oneReading = fc.record({
      meterId: fc.constantFrom('meter-1', 'meter-2'),
      intervalStart: fc.constantFrom('2026-11-20T00:00:00Z', '2026-11-20T00:30:00Z'),
      wh: fc.integer({ min: 0, max: 2000 }),
      revision: fc.integer({ min: 1, max: 5 }),
    });
    const readings = fc.uniqueArray(oneReading, {
      selector: (r) => `${r.meterId}|${r.intervalStart}|${String(r.revision)}`,
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

    // On its own this law would pass for a store that kept nothing. The examples above rule that out.
    test.prop([arrivals])(
      'keeps the same readings whatever order they arrive in and however often one repeats',
      ([rs, shuffled, again]) => {
        expect(inOrder(recordAll([...shuffled, ...again]).all())).toEqual(
          inOrder(recordAll(rs).all()),
        );
      },
    );
  });
});
