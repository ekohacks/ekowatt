import { fc, test } from '@fast-check/vitest';
import { describe, expect, it } from 'vitest';
import { runOutAt, type Charge } from './starter.ts';

// Consecutive half hours from 01:00, so a test only has to give the charges.
const day = (kobo: readonly number[]): Charge[] =>
  kobo.map((k, i) => ({
    start: `${String(1 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    kobo: k,
  }));

describe('runOutAt', () => {
  it('finds the half hour the credit ran out, not the last half hour', () => {
    // 300, 600, 900, 1,200 after four half hours: the fourth, at 02:30, takes it past 1,000.
    expect(runOutAt(1000, day([300, 300, 300, 300, 300]))).toBe('02:30');
  });

  it('counts a balance of exactly zero as run out', () => {
    // 900 of credit, and the third half hour brings the total to exactly 900.
    expect(runOutAt(900, day([300, 300, 300, 300]))).toBe('02:00');
  });

  it('adds the charges up instead of looking at one at a time', () => {
    // No single charge is as large as the credit; their running total is, at 02:30.
    expect(runOutAt(1000, day([50, 800, 50, 200]))).toBe('02:30');
  });

  it('returns null when the credit lasts', () => {
    expect(runOutAt(1000, day([200, 200]))).toBeNull();
  });

  describe('runOutAt() invariants', () => {
    const credit = fc.integer({ min: 1, max: 2000 });
    const charges = fc.array(fc.integer({ min: 0, max: 500 }), { maxLength: 12 });

    // The law that defines the answer: before the half hour it names, the credit still held;
    // at it, the charges have used the credit up. With no such half hour, null.
    test.prop([credit, charges])(
      'names the first half hour at which the charges add up to the credit',
      (c, kobo) => {
        const slots = day(kobo);
        const at = runOutAt(c, slots);
        const total = (n: number) => kobo.slice(0, n).reduce((sum, k) => sum + k, 0);
        if (at === null) {
          expect(total(kobo.length)).toBeLessThan(c);
        } else {
          const i = slots.findIndex((s) => s.start === at);
          expect(i).toBeGreaterThanOrEqual(0);
          expect(total(i)).toBeLessThan(c);
          expect(total(i + 1)).toBeGreaterThanOrEqual(c);
        }
      },
    );
  });
});
