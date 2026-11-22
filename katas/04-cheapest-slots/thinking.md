# Kata 04, how to think about it

Read this before the timer starts, then close it.

## The question in the domain

A battery needs a number of half hours of charging, and each half hour has a price. Charging in the cheapest ones saves the customer money. When two cost the same, take the earlier, so the plan is the same every time and the battery is ready sooner. If there are fewer slots than needed, say so plainly.

## The formula

```text
if slotsNeeded > number of prices   →  "not enough time"
ranked    =  prices sorted by kobo, then by start
chosen    =  the first slotsNeeded of ranked
result    =  the starts of chosen, sorted by start
```

This is **greedy selection of the k smallest**: take the cheapest, then the next cheapest, and never go back.

## How to think it through

1. **Check there is enough time first,** and throw `not enough time` before doing anything else.
2. **Sort a copy by price, with start as the tie breaker.** Compare `kobo`; when equal, compare `start`. That one comparator handles "ties to the earlier".
3. **Take the first k.**
4. **Sort those k again, by start.** The answer is asked for in time order, not price order.

## Where it is easy to go wrong

- **Forgetting the second sort.** The first test returns `02:00` then `03:00`; the price order would give the same here only by luck.
- **No tie breaker.** `sort` with only `kobo` leaves equal prices in whatever order they came, and the tie test sends the later slot first.
- **Mutating the input.** Sort a copy.

## What it costs

O(n log n) for the sort, O(n) space. A heap of size k does it in O(n log k), faster when k is small against n; with 48 slots a day, sorting is simpler.
