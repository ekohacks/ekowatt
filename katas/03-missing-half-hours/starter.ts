// A day has 48 half hours. Given the readings for one meter and one UTC day,
// return the start of every half hour with no reading, in ISO form
// (for example "2026-11-23T01:30:00.000Z"), in order.

export interface Reading {
  readonly start: string;
  readonly wh: number;
}

export function missingHalfHours(_day: string, _readings: readonly Reading[]): string[] {
  throw new Error('not done yet');
}
