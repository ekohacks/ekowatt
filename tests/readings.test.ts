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
