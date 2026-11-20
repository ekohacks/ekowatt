// Readings arrive twice, late and out of order. Keep one reading per meter and
// half hour: the one with the highest revision, whatever order they arrived in.
// Return them sorted by start, then meter.

export interface Reading {
  readonly meterId: string;
  readonly start: string;
  readonly wh: number;
  readonly revision: number;
}

export function latestReadings(_arrived: readonly Reading[]): Reading[] {
  throw new Error('not done yet');
}
