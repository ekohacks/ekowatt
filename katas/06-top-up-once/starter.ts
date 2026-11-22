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
  const seen = new Set<string>();
  const balances = new Map<string, number>();

  const apply = (topUp: TopUp): boolean => {
    if (seen.has(topUp.paymentId)) {
      return false;
    }
    seen.add(topUp.paymentId);
    balances.set(topUp.account, (balances.get(topUp.account) ?? 0) + topUp.kobo);
    return true;
  };

  return {
    apply,
    balance(account: string): number {
      return balances.get(account) ?? 0;
    },
  };
}
