// Readings arrive twice, late and out of order. Keep one reading per meter and
// half hour: the one with the highest revision, whatever order they arrived in.
// Return them sorted by start, then meter.

export interface Reading {
  readonly meterId: string;
  readonly start: string;
  readonly wh: number;
  readonly revision: number;
}

export function latestReadings(arrived: readonly Reading[]): Reading[] {
  let kept = new Map<string, Reading>();
  for (const reading of arrived) {
    const readindsKey = `${reading.meterId}|${reading.start}`;
    const existing = kept.get(readindsKey);
    kept = kept.set(readindsKey, existing && existing.revision > reading.revision ? existing : reading);
  }
  return [...kept.values()].sort((a,b)=> a.start.localeCompare(b.start) || a.meterId.localeCompare(b.meterId));
}
