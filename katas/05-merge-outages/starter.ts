// Outages are reported as [start, end) ranges in minutes, in any order, and
// they overlap. Merge them into the fewest ranges, sorted by start. Ranges that
// touch (one ends where the next starts) merge too.

export type Range = readonly [number, number];

export function mergeOutages(ranges: readonly Range[]): Range[] {
  if(ranges.length === 0) {
    return [];
  }
  const sorted = [...ranges].sort((a,b) => a[0] - b[0])
  let current: [number, number] = [sorted[0][0], sorted[0][1]];
  const merged = [];
  for(const range of sorted) {
    if(range[0] <= current[1]) {
      current[1] = Math.max(current[1], range[1]);
    } else {
      merged.push(current);
      current = [range[0], range[1]];
    }
  }

  merged.push(current);
  return merged;
}
