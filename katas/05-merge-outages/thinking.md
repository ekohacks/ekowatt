# Kata 05, how to think about it

Read this before the timer starts, then close it.

## The question in the domain

When a feeder loses power, outages are reported from several places, in any order, and they overlap. To tell a customer how long they were without power, or to stop charging for those hours, ekowatt needs the outages merged into the fewest ranges. A range is `[start, end)` in minutes: it includes its start and stops just before its end, so `[5, 8)` and `[8, 9)` touch and become `[5, 9)`.

## The formula

```text
sorted    =  ranges sorted by start
merged    =  walk sorted once:
               if the range starts at or before the current end, extend the current end
               to the larger of the two ends;
               otherwise close the current range and start a new one
```

This is **merge intervals: sort, then sweep**.

## How to think it through

1. **Sort a copy by start.** After that, anything that can merge with the current range comes right after it.
2. **Carry one current range.** Start with the first.
3. **For each next range, ask one question.** Does it start at or before the current end? Then they overlap or touch, and the current end becomes the larger of the two ends. If not, the current range is finished: push it and start again from this one.
4. **Push the last current range** after the loop.

## Where it is easy to go wrong

- **`<` where you need `<=`.** Touching ranges merge here, so a start equal to the current end counts.
- **Taking the new range's end without the larger of the two.** `[1, 10)` then `[2, 3)` must stay `[1, 10)`; one test checks that.
- **Not sorting first.** The sweep only works on sorted input.
- **The empty list.** Nothing in, nothing out, and no first range to start from.

## What it costs

O(n log n) for the sort, then one O(n) sweep. O(n) space for the result.
