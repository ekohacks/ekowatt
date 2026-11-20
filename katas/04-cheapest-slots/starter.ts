// A battery needs `slotsNeeded` half hours of charging. Pick the cheapest slots
// (whole kobo per kWh) and return their starts in time order. When prices tie,
// take the earlier slot. Throw "not enough time" if there are too few slots.

export interface Price {
  readonly start: string;
  readonly kobo: number;
}

export function cheapestSlots(_prices: readonly Price[], _slotsNeeded: number): string[] {
  throw new Error('not done yet');
}
