import { describe, expect, it } from 'vitest';
import { createAccounts } from './starter.ts';

describe('createAccounts', () => {
  it('starts every account at zero', () => {
    expect(createAccounts().balance('a1')).toBe(0);
  });

  it('credits a top up once when its callback arrives twice', () => {
    const accounts = createAccounts();
    const topUp = { paymentId: 'p1', account: 'a1', kobo: 100000 };

    expect(accounts.apply(topUp)).toBe(true);
    expect(accounts.apply(topUp)).toBe(false);
    expect(accounts.balance('a1')).toBe(100000);
  });

  it('keeps accounts apart', () => {
    const accounts = createAccounts();
    accounts.apply({ paymentId: 'p1', account: 'a1', kobo: 100 });
    accounts.apply({ paymentId: 'p2', account: 'a2', kobo: 300 });

    expect(accounts.balance('a1')).toBe(100);
    expect(accounts.balance('a2')).toBe(300);
  });
});
