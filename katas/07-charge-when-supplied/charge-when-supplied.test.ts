import { describe, expect, it } from 'vitest';
import { planCharge } from './starter.ts';

const evening = [
  { start: '2026-11-23T18:00', kobo: 250, supplied: true },
  { start: '2026-11-23T18:30', kobo: 250, supplied: true },
  { start: '2026-11-23T22:00', kobo: 120, supplied: false },
  { start: '2026-11-24T01:00', kobo: 150, supplied: true },
  { start: '2026-11-24T01:30', kobo: 150, supplied: true },
  { start: '2026-11-24T08:00', kobo: 100, supplied: true },
];

describe('planCharge', () => {
  it('skips the cheapest slot when the feeder is off and slots after the deadline', () => {
    // 7,000 W gives 3,500 Wh a slot, so 6,000 Wh needs two slots.
    expect(planCharge(evening, 6000, 7000, '2026-11-24T07:00')).toEqual([
      '2026-11-24T01:00',
      '2026-11-24T01:30',
    ]);
  });

  it('rounds the number of slots up', () => {
    expect(planCharge(evening, 3501, 7000, '2026-11-24T07:00')).toHaveLength(2);
  });

  it('fails clearly when it cannot charge in time', () => {
    expect(() => planCharge(evening, 20000, 7000, '2026-11-24T07:00')).toThrow(
      'cannot charge in time',
    );
  });
});
