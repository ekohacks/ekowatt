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

  // 7,000 W gives 3,500 Wh a slot: 3,500 Wh needs one slot, 7,000 Wh needs two.
  const at = (time: string) => `2026-11-24T${time}`;

  it('leaves out a slot that starts exactly at the deadline', () => {
    const slots = [
      { start: at('06:30'), kobo: 200, supplied: true },
      { start: at('07:00'), kobo: 50, supplied: true },
    ];
    expect(planCharge(slots, 3500, 7000, at('07:00'))).toEqual([at('06:30')]);
  });

  it('returns time order even when the cheapest slot is the latest', () => {
    // By price the pick is 03:00 then 02:00; only a sort by start after picking gives time order.
    const slots = [
      { start: at('01:00'), kobo: 300, supplied: true },
      { start: at('02:00'), kobo: 100, supplied: true },
      { start: at('03:00'), kobo: 50, supplied: true },
    ];
    expect(planCharge(slots, 7000, 7000, at('07:00'))).toEqual([at('02:00'), at('03:00')]);
  });

  it('takes the earlier slot when prices tie', () => {
    const slots = [
      { start: at('03:00'), kobo: 100, supplied: true },
      { start: at('01:00'), kobo: 100, supplied: true },
    ];
    expect(planCharge(slots, 3500, 7000, at('07:00'))).toEqual([at('01:00')]);
  });
});
