// A day has 48 half hours. Given the readings for one meter and one UTC day,
// return the start of every half hour with no reading, in ISO form
// (for example "2026-11-23T01:30:00.000Z"), in order.

export interface Reading {
  readonly start: string;
  readonly wh: number;
}

export function missingHalfHours(day: string, readings: readonly Reading[]): string[] {
  const present = new Set(readings.map(reading => new Date(reading.start).toISOString()));
  const midnight = Date.parse(day + 'T00:00:00Z');
  const missing: string[] = [];
  for (let i = 0; i < 48; i++) {
    const slot = new Date(midnight + i * 1_800_000);
    if (!present.has(slot.toISOString())) {
      missing.push(slot.toISOString());
    }
  }
  return missing

}
