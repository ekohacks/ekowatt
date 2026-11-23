// A customer topped up `creditKobo`. Charges for each half hour, in whole kobo, follow in
// time order. Return the start of the half hour whose charge brought the balance to zero or
// below: the moment the units ran out. Return null if the credit lasts through every charge.

export interface Charge {
  readonly start: string;
  readonly kobo: number;
}

export function runOutAt(_creditKobo: number, _charges: readonly Charge[]): string | null {
  throw new Error('not done yet');
}
