# Kata 06, how to think about it

Read this before the timer starts, then close it.

## The question in the domain

A customer tops up with mobile money. The payment provider then sends a callback saying the payment succeeded, and it can send it more than once, late, or after a retry. If every callback credited the account, one payment would buy units twice. Each payment has an id, and the rule is that a payment id is credited once and only once (decision 3: one token per top up).

## The formula

```text
apply(t)     =  if t.paymentId has been seen → false, and nothing changes
                otherwise → remember t.paymentId, add t.kobo to t.account, true
balance(a)   =  the kobo credited to a, or 0 if none
```

This is an **idempotent consumer**: a set of seen ids in front of the effect, so at least once delivery gives exactly once effects.

## How to think it through

1. **Two pieces of state.** A `Set` of payment ids already applied, and a `Map` from account to balance.
2. **Check before acting.** Look up the payment id first. Seen: return false and change nothing. New: record the id, then credit.
3. **An account nobody has topped up has a balance of 0,** without needing an entry.
4. **Keep accounts apart.** The balance is per account; the seen set is per payment.

## Where it is easy to go wrong

- **Keying the seen set by account, or by amount.** Two different top ups of the same amount to the same account are two payments.
- **Crediting before recording the id,** or recording it only on some paths.
- **Returning `undefined` for an unknown account** where the test wants 0.

## What it costs

O(1) per call on average. O(p) space for p payments seen: the set grows forever unless old ids are allowed to expire, which a real system has to decide and the kata does not.
