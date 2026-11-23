// A battery or a car needs `whNeeded` by `deadline`. The charger delivers `chargerW`
// watts, so one half hour adds chargerW / 2 watt hours. Only slots that start
// before the deadline and while the feeder supplies power can be used. Pick the
// cheapest (ties to the earlier slot), return their starts in time order, and
// throw "cannot charge in time" if it cannot be done.

export interface Slot {
  readonly start: string;
  readonly kobo: number;
  readonly supplied: boolean;
}

export function planCharge(
  slots: readonly Slot[],
  whNeeded: number,
  chargerW: number,
  deadline: string,
): string[] {
  const perSlot = chargerW / 2;
  const k = Math.ceil(whNeeded / perSlot);
  const usables = slots.filter((slot) => {
    return slot.supplied && slot.start < deadline
  })
  const usablesLen = usables.length;
  if (usablesLen < k) {
    throw new Error('cannot charge in time')
  }
  return usables.sort((a, b) => {
    return a.kobo - b.kobo || a.start.localeCompare(b.start);
  })
    .slice(0, k)
    .map((p) => p.start)
    .sort((a, b) => a.localeCompare(b));
}
