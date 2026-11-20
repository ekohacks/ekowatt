// Charging readings in order under ADR 0006: energy in whole watt hours, prices in whole kobo
// per kWh, every charge rounded down, and the remainder carried into the next charge.

export const WATT_HOURS_PER_KWH = 1000;

export interface Charge {
  readonly wh: number;
  readonly kobo: number;
  /** What is left after rounding down, in thousandths of a kobo, carried into the next charge. */
  readonly carriedRemainder: number;
}

export function chargeReadings(
  _whs: readonly number[],
  _koboPerKWh: number,
  _carriedIn = 0,
): Charge[] {
  return [];
}
