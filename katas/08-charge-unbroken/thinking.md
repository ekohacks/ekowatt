# Kata 08, how to think about it

Read this before the timer starts, then close it. It builds on kata 04 and kata 07.

## The question in the domain

Some chargers, and some batteries, must charge in one unbroken block: once started, stopping costs efficiency or wears the battery. So the customer needs k half hours **next to each other**, every one supplied by the feeder, at the smallest total price under the operator’s time of use tariff.

This is where kata 04’s greedy choice breaks. With prices 100, 400, 100, 150, 150 from 01:00, the two cheapest half hours are 01:00 and 02:00, which are not next to each other. The cheapest unbroken pair is 02:00 and 02:30, at 250. Picking one half hour now changes which half hours can come with it, so the choices are no longer independent.

## The formula

```text
window(i)  =  slots i, i+1, …, i+k−1            k consecutive half hours
valid(i)   =  every slot in window(i) is supplied
total(i)   =  sum of their prices
answer     =  the valid window with the smallest total; ties to the smallest i
```

This is a **sliding window**: a frame of fixed width k that moves along the day one half hour at a time.

## How to think it through

1. **The slow way first.** For every starting point i, add up the k prices and check every slot is supplied: O(n·k). The kata’s property test does exactly this, as the obviously correct answer to compare yours with.
2. **Slide instead of re-adding.** Moving the window one step to the right loses one slot on the left and gains one on the right. So the new total is the old total, minus the slot that left, plus the slot that joined. One subtraction and one addition per step: O(n) for the whole day.
3. **Supply.** Keep a count of unsupplied slots inside the window, updated the same way as the total: add one when an unsupplied slot joins, take one away when it leaves. A window is valid when that count is 0. (Or restart the window after every unsupplied slot.)
4. **Ties to the earlier run.** Replace the best only when a total is strictly smaller. Since you slide left to right, the first cheapest run stays.
5. **None at all.** If no window was valid, throw `no unbroken run`. Also when k is larger than the number of slots.

## Worked through, k = 2

Prices from 01:00: 100, 400, 100, 150, 150, all supplied.

| Window       | Slot that left | Slot that joined | Total                 | Best so far                            |
| ------------ | -------------- | ---------------- | --------------------- | -------------------------------------- |
| 01:00, 01:30 | none           | 100, 400         | 500                   | 500 at 01:00                           |
| 01:30, 02:00 | 100            | 100              | 500 − 100 + 100 = 500 | 500 at 01:00 (a tie keeps the earlier) |
| 02:00, 02:30 | 400            | 150              | 500 − 400 + 150 = 250 | 250 at 02:00                           |
| 02:30, 03:00 | 100            | 150              | 250 − 100 + 150 = 300 | 250 at 02:00                           |

Answer: 02:00, 02:30.

## Where it is easy to go wrong

- **Greedy.** Picking the k cheapest half hours, as in kata 04, gives half hours that are not next to each other. The first test is built to catch it.
- **Off by one at the end.** The last window starts at n − k, not n − k + 1, and not n − 1.
- **Forgetting to take away the slot that left.** The total then grows forever.
- **A supply check that only looks at the slot that joined.** An unsupplied slot is still inside the window for k − 1 more steps.
- **`<=` when comparing totals.** Then a later run with the same total replaces the earlier one.

## What it costs

O(n) time with the sliding total, against O(n·k) for adding up every window again. O(1) extra space besides the answer.

## Then

Close this file, start the timer, turn AI completion off, and write it in `starter.ts`. Run `npm run katas`. When you are done, reset it with `git checkout katas/08-charge-unbroken/starter.ts`.
