import { describe, expect, it } from 'vitest';
import { cheapestSlots } from './starter.ts';

describe('cheapestSlots', () => {
  it('picks the cheapest and returns them in time order', () => {
    const prices = [
      { start: '01:00', kobo: 200 },
      { start: '02:00', kobo: 50 },
      { start: '03:00', kobo: 100 },
    ];
    expect(cheapestSlots(prices, 2)).toEqual(['02:00', '03:00']);
  });

  it('takes the earlier slot when prices tie', () => {
    const prices = [
      { start: '03:00', kobo: 100 },
      { start: '01:00', kobo: 100 },
    ];
    expect(cheapestSlots(prices, 1)).toEqual(['01:00']);
  });

  it('fails clearly when there is not enough time', () => {
    expect(() => cheapestSlots([{ start: '01:00', kobo: 1 }], 2)).toThrow('not enough time');
  });
});
