// Some chargers must run unbroken once they start. Given the half hours of a day in time
// order, one after another, find the `slotsNeeded` consecutive half hours, all supplied by
// the feeder, with the smallest total price (whole kobo per kWh). When totals tie, take the
// earlier run. Return the run's starts in time order, and throw "no unbroken run" if there
// is none.

export interface Slot {
  readonly start: string;
  readonly kobo: number;
  readonly supplied: boolean;
}

export function cheapestRun(_slots: readonly Slot[], _slotsNeeded: number): string[] {
  throw new Error('not done yet');
}
