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
  whs: readonly number[],
  koboPerKWh: number,
  carriedIn = 0,
): Charge[] {
  if (!Number.isInteger(koboPerKWh)) {
    throw new RangeError('price must be whole kobo per kWh');
  }
  // The remainder outlives each reading: what one charge leaves behind starts the next.
  let carried = carriedIn;
  return whs.map((wh) => {
    if (!Number.isInteger(wh)) {
      throw new RangeError('energy must be whole watt hours');
    }
    const thousandthsOfKobo = wh * koboPerKWh + carried;
    carried = thousandthsOfKobo % WATT_HOURS_PER_KWH;
    return {
      wh,
      kobo: Math.floor(thousandthsOfKobo / WATT_HOURS_PER_KWH),
      carriedRemainder: carried,
    };
  });
}
