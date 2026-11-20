import { describe, expect, it } from 'vitest';
import { chargeReadings, type Charge } from '../src/tariff.ts';

// A Band A style price: ₦209.50 per kWh.
const PRICE = 20950;

const total = (charges: readonly Charge[]) => charges.reduce((sum, c) => sum + c.kobo, 0);

describe('chargeReadings', () => {
  it('rounds a charge down and carries the remainder', () => {
    // 370 Wh × 20950 = 7,751,500 thousandths of a kobo: 7,751 kobo, 500 carried.
    expect(chargeReadings([370], PRICE)).toEqual([{ wh: 370, kobo: 7751, carriedRemainder: 500 }]);
  });

  it('pays the carried remainder back once it makes a whole kobo', () => {
    expect(chargeReadings([370, 370], PRICE)).toEqual([
      { wh: 370, kobo: 7751, carriedRemainder: 500 },
      { wh: 370, kobo: 7752, carriedRemainder: 0 },
    ]);
  });

  it('starts from a remainder carried in from earlier readings', () => {
    expect(chargeReadings([370], PRICE, 500)).toEqual([
      { wh: 370, kobo: 7752, carriedRemainder: 0 },
    ]);
  });

  it('charges nothing for no energy and keeps the remainder', () => {
    expect(chargeReadings([0], PRICE, 300)).toEqual([{ wh: 0, kobo: 0, carriedRemainder: 300 }]);
  });

  describe('the guarantee', () => {
    // Awkward on purpose: no reading is a whole kWh, and the remainders do not line up.
    const runs: readonly (readonly number[])[] = [
      [370, 370, 370],
      [1, 2, 3, 4, 5],
      [333, 667, 999, 1001],
      [48, 96, 144, 192, 240, 288],
      [7, 1013, 0, 459, 1, 1999],
    ];

    it.each(runs.map((run) => [run]))(
      'charges add up to the exact cost rounded down once: %j',
      (whs) => {
        const exact = whs.reduce((sum, wh) => sum + wh * PRICE, 0);
        const charges = chargeReadings(whs, PRICE);

        expect(total(charges)).toBe(Math.floor(exact / 1000));
        expect(charges.at(-1)?.carriedRemainder).toBe(exact % 1000);
      },
    );

    it.each(runs.map((run) => [run]))(
      'never charges more than the energy used so far: %j',
      (whs) => {
        const charges = chargeReadings(whs, PRICE);
        // Without this, an empty list of charges would pass the loop below for the wrong reason.
        expect(charges).toHaveLength(whs.length);

        let exactSoFar = 0;
        let chargedSoFar = 0;
        charges.forEach((charge, i) => {
          exactSoFar += (whs[i] ?? 0) * PRICE;
          chargedSoFar += charge.kobo;
          expect(chargedSoFar * 1000).toBeLessThanOrEqual(exactSoFar);
        });
      },
    );
  });

  it('refuses energy or a price that is not a whole number', () => {
    expect(() => chargeReadings([0.37], PRICE)).toThrow(RangeError);
    expect(() => chargeReadings([370], 209.5)).toThrow(RangeError);
  });
});
