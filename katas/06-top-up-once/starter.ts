// Mobile money callbacks can arrive more than once. Credit each top up to its
// account exactly once, keyed by the payment id. `apply` returns true when it
// credited and false for a repeat. Amounts are whole kobo.

export interface TopUp {
  readonly paymentId: string;
  readonly account: string;
  readonly kobo: number;
}

export interface Accounts {
  apply(topUp: TopUp): boolean;
  balance(account: string): number;
}

export function createAccounts(): Accounts {
  throw new Error('not done yet');
}
