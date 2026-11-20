// Outages are reported as [start, end) ranges in minutes, in any order, and
// they overlap. Merge them into the fewest ranges, sorted by start. Ranges that
// touch (one ends where the next starts) merge too.

export type Range = readonly [number, number];

export function mergeOutages(_ranges: readonly Range[]): Range[] {
  throw new Error('not done yet');
}
