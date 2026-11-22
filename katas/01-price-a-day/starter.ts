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

export function priceReadings(readings: readonly Reading[], tariff: Tariff): number {
  const days = new Set(readings.map((reading) => reading.start.slice(0,10))).size;
  const readingsMapped = readings.map((reading) => {
    const date = new Date(reading.start);
    const hour = date.getUTCHours();
    const isNight = hour < 6;
    return isNight? reading.wh * tariff.nightKoboPerKWh : reading.wh * tariff.dayKoboPerKWh;
  })
  const sum = readingsMapped.reduce((acc, reading) => {
    return reading + acc;
  }, 0);
  return Math.floor(sum/1000 + days * tariff.dailyChargeKobo)
}
