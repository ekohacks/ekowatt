# Kata 02, how to think about it

Read this before the timer starts, then close it. It gives the shape of the answer and the domain behind it, not the code.

## The question in the domain

A meter's readings reach ekowatt through a queue that delivers at least once, so the same reading can arrive twice. A reading can also be corrected later: the same meter and half hour, sent again with a new value and a higher revision. Messages arrive in any order, so the correction can land before the original. Billing must use exactly one reading per meter and half hour, the one with the highest revision, whatever the order of arrival. `src/readings.ts` does this in the product (plan step 2); the kata asks you to write it cold.

## The formula

```text
key(r)    =  (meterId, start)
kept      =  for each key, the reading with the highest revision
result    =  kept, sorted by start, then by meterId
```

## How to think it through

1. **What makes two readings the same.** Meter and half hour together. A key of `start` alone lets two meters overwrite each other.
2. **One pass into a `Map`.** For each arrival, look up its key. Keep it only if nothing is kept yet or its revision is higher than the kept one. This is **keep the max per key**.
3. **Order of arrival must not matter.** Ask what your loop does when the correction comes first. If the original then overwrites it, you wrote "last to arrive wins". If you skip anything already seen, you wrote "first to arrive wins". One test catches each.
4. **A repeat changes nothing.** The same reading twice has the same revision, so keeping the first is right.
5. **Sort at the end, by a composite key.** Compare `start`, and `meterId` only when the starts are equal. That is a total order, so the sort is the same every time. ISO UTC strings sort alphabetically in time order (ADR 0007), so plain string comparison works.

## Where it is easy to go wrong

- **A key of `start` alone.**
- **Joining strings with a separator that appears in the parts.** `-` is in meter ids and dates; `src/readings.ts` uses `|` for that reason.
- **Returning the `Map`'s insertion order.** That is the arrival order, not the order asked for.
- **Mutating the input.** It is `readonly`; sort a copy.

## The property

The same readings, shuffled and with some delivered again, must give the same output as the original list. fast-check runs many random cases and, when one fails, prints a seed and the smallest failing input. Read that counterexample before you read your code.

## What it costs

O(n) to merge n arrivals, O(k log k) to sort the k kept, O(k) space.
