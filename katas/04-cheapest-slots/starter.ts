// A battery needs `slotsNeeded` half hours of charging. Pick the cheapest slots
// (whole kobo per kWh) and return their starts in time order. When prices tie,
// take the earlier slot. Throw "not enough time" if there are too few slots.

export interface Price {
  readonly start: string;
  readonly kobo: number;
}

export function cheapestSlots(prices: readonly Price[], slotsNeeded: number): string[] {
  const pricesLength = prices.length;
  if (pricesLength < slotsNeeded) {
    throw new Error('not enough time');
  }
  return [...prices]
    .sort((a, b) => {
      return a.kobo - b.kobo || a.start.localeCompare(b.start);
    })
    .slice(0, slotsNeeded)
    .map((p) => p.start)
    .sort((a, b) => a.localeCompare(b));
}
