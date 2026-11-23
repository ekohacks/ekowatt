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

export function cheapestRun(slots: readonly Slot[], slotsNeeded: number): string[] {
  let total = 0;
  let off = 0;
  let bestTotal = Infinity;
  let bestStart: number | undefined = undefined;
  const slotLength = slots.length;
  for (let i = 0; i < slotLength; i++) {
    total = total + slots[i].kobo;
    if (!slots[i].supplied) {
      off = off + 1;
    }
    if (i >= slotsNeeded) {
      total = total - slots[i - slotsNeeded].kobo;
      if (!slots[i - slotsNeeded].supplied) {
        off = off - 1;
      }
    }
    if (i >= slotsNeeded - 1 && off === 0 && total < bestTotal) {
      bestTotal = total;
      bestStart = i - slotsNeeded + 1;
    }
  }
  if (bestStart === undefined) {
    throw new Error('no unbroken run');
  }
  return slots.slice(bestStart, bestStart + slotsNeeded).map((s) => s.start);
}
