# Kata 09, how to think about it

Read this before the timer starts, then close it.

## The question in the domain

A prepaid customer topped up, and later their power cut out: the meter stops supply when the credit reaches zero. They ask the support agent "why did my units run out?". Before the agent can explain why, the core has to say **when**: which half hour’s charge used up the last of the credit. Decision 8 says the agent never works that number out itself; this function does, and the agent quotes it.

## The formula

```text
spent(i)  =  charge(0) + charge(1) + … + charge(i)       the running total, a prefix sum
answer    =  the first i where spent(i) ≥ credit          its start time
             null if no such i
```

`spent` is a **prefix sum**: the total of everything up to and including half hour i.

## How to think it through

1. **Walk the half hours in order, carrying the running total.** Each step adds one charge. This is a fold, like kata 01.
2. **Stop at the first half hour where the total reaches the credit.** Reaching it exactly counts: a balance of zero is no credit left, and the meter cuts out.
3. **If the walk ends first, the credit lasted.** Return null.

## Worked through

Credit 1,000 kobo. Charges from 01:00: 50, 800, 50, 200.

| Half hour | Charge | Spent so far | Reached 1,000? |
| --------- | ------ | ------------ | -------------- |
| 01:00     | 50     | 50           | no             |
| 01:30     | 800    | 850          | no             |
| 02:00     | 50     | 900          | no             |
| 02:30     | 200    | 1,100        | yes: 02:30     |

The expensive half hour at 01:30 did not end it on its own. The running total did, one hour later.

## Where it is easy to go wrong

- **`>` instead of `≥`.** Then a balance of exactly zero counts as still having credit. One test spends the credit to the kobo.
- **Comparing one charge with the credit.** No single charge has to be as large as the credit; it is the total that matters. One test is built for this.
- **Returning the last half hour, or the one after.** The answer is the half hour whose charge crossed the line, not where the list ends.
- **Floats.** Everything is whole kobo, so the running total is exact (ADR 0006).

## Many questions at once

If the agent asks about many credits against the same day, add up the prefix sums once. Because charges are never negative, the prefix sums only go up, so the first one that reaches a given credit can be found by **binary search** in O(log n) per question.

## What it costs

O(n) time and O(1) space for one question. With prefix sums kept: O(n) once, then O(log n) per question.

## Then

Close this file, start the timer, turn AI completion off, and write it in `starter.ts`. Run `npm run katas`. When you are done, reset it with `git checkout katas/09-when-units-ran-out/starter.ts`.
