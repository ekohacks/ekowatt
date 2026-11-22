# Kata 03, how to think about it

Read this before the timer starts, then close it.

## The question in the domain

A smart meter should report 48 half hours a day. When some are missing, the system has to know which, so it can ask the meter again, estimate them, and tell the customer an explanation is "estimated" (decision 7). The kata gives one meter's readings for one UTC day and asks for the start of every half hour with no reading, in order.

## The formula

```text
expected  =  the 48 starts of the day: midnight UTC + i × 30 minutes, for i from 0 to 47
present   =  the set of reading starts, all written the same way
missing   =  expected minus present, in order
```

This is a **set difference over a generated range**.

## How to think it through

1. **Generate the 48 starts.** Midnight UTC of the day, then add 30 minutes 47 times. Half an hour is 1,800,000 milliseconds. Build them from the day in UTC, never from local time (ADR 0007).
2. **Put what is present in a `Set`.** One lookup per expected slot, O(1) each.
3. **Walk the 48 in order and keep the ones not in the set.** The output is already in time order, because you walked in time order.

## Where it is easy to go wrong

- **Two ways to write one instant.** `2026-11-23T00:00:00Z` and `2026-11-23T00:00:00.000Z` are the same moment and different strings. One test sends a reading without milliseconds. Write every start the same way before comparing: parse each into a `Date` and print it back with `toISOString()`, or compare the numbers from `Date.parse`.
- **Local midnight.** A day built with local methods starts at the wrong hour on any machine not set to UTC.
- **Expecting 48 out when nothing came in.** No readings means all 48 are missing, and one test checks exactly that.

## What it costs

O(n) for n readings. The 48 slots are a constant, so walking them adds nothing that grows with n. O(n) space for the set.
