import { describe, expect, it } from 'vitest';
import { priceReadings } from './starter.ts';

const tariff = { dayKoboPerKWh: 20950, nightKoboPerKWh: 12000, dailyChargeKobo: 5000 };

describe('priceReadings', () => {
  it('costs nothing with no readings', () => {
    expect(priceReadings([], tariff)).toBe(0);
  });

  it('prices a day reading and adds the daily charge once', () => {
    // 370 Wh, not 1000: at exactly 1 kWh a charge per kWh and a charge per day give the same number.
    // 370 x 20950 = 7,751,500 thousandths of a kobo, so 7,751 kobo.
    expect(priceReadings([{ start: '2026-11-23T12:00:00Z', wh: 370 }], tariff)).toBe(7751 + 5000);
  });

  it('uses the night price before 06:00 and the day price from 06:00', () => {
    const readings = [
      { start: '2026-11-23T05:30:00Z', wh: 1000 },
      { start: '2026-11-23T06:00:00Z', wh: 1000 },
    ];
    expect(priceReadings(readings, tariff)).toBe(12000 + 20950 + 5000);
  });

  it('rounds down once, at the end, not per reading', () => {
    const readings = [
      { start: '2026-11-23T12:00:00Z', wh: 370 },
      { start: '2026-11-23T12:30:00Z', wh: 370 },
    ];
    // 370 x 20950 = 7,751,500 thousandths each; two make 15,503,000, so 15,503 kobo.
    expect(priceReadings(readings, tariff)).toBe(15503 + 5000);
  });

  it('counts the same day of different months as different days', () => {
    const readings = [
      { start: '2026-11-23T12:00:00Z', wh: 0 },
      { start: '2026-12-23T12:00:00Z', wh: 0 },
    ];
    expect(priceReadings(readings, tariff)).toBe(10000);
  });

  it('counts two days a week apart as two days', () => {
    const readings = [
      { start: '2026-11-23T12:00:00Z', wh: 0 },
      { start: '2026-11-30T12:00:00Z', wh: 0 },
    ];
    expect(priceReadings(readings, tariff)).toBe(10000);
  });

  it('adds the daily charge for each day with readings', () => {
    const readings = [
      { start: '2026-11-23T12:00:00Z', wh: 0 },
      { start: '2026-11-24T12:00:00Z', wh: 0 },
    ];
    expect(priceReadings(readings, tariff)).toBe(10000);
  });
});
