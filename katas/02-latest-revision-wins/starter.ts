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
  const held = new Map<string, Reading>();
  for (const r of arrived) {
    const key = `${r.meterId}-${r.start}`;
    const existing = held.get(key);
    if (!existing || existing.revision < r.revision) {
      held.set(key, r);
    }
  }
  return [...held.values()].sort(
    (a, b) =>
      a.start.localeCompare(b.start) || a.meterId.localeCompare(b.meterId),
  );
}
