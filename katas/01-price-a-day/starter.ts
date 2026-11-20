// Price one day of half hourly readings.
// Energy is in whole watt hours, prices in whole kobo per kWh (see ADR 0006).
// Readings starting from 00:00 up to (not including) 06:00 UTC use the night price,
// the rest the day price. Add the daily charge once for each calendar day (UTC)
// that has a reading. Work in thousandths of a kobo and round down once at the end.

export interface Reading {
  readonly start: string;
  readonly wh: number;
}

export interface Tariff {
  readonly dayKoboPerKWh: number;
  readonly nightKoboPerKWh: number;
  readonly dailyChargeKobo: number;
}

export function priceReadings(_readings: readonly Reading[], _tariff: Tariff): number {
  throw new Error('not done yet');
}
