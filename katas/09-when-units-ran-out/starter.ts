// A customer topped up `creditKobo`. Charges for each half hour, in whole kobo, follow in
// time order. Return the start of the half hour whose charge brought the balance to zero or
// below: the moment the units ran out. Return null if the credit lasts through every charge.

export interface Charge {
  readonly start: string;
  readonly kobo: number;
}

export function runOutAt(creditKobo: number, charges: readonly Charge[]): string | null {
  let spend = 0;
  for (const charge of charges) {
    spend = spend + charge.kobo;
    if(spend >= creditKobo) {
      return charge.start;
    }
  }
  return null;
}
