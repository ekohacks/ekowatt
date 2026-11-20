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
  _slots: readonly Slot[],
  _whNeeded: number,
  _chargerW: number,
  _deadline: string,
): string[] {
  throw new Error('not done yet');
}
