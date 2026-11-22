# Kata 07, how to think about it

Read this before the timer starts, then close it. It builds on kata 04.

## The question in the domain

A battery or a car needs a certain amount of energy by a deadline. The charger delivers a fixed power, and the feeder only supplies electricity in some hours (decision 3: supply bands). So a slot can be used only if it starts before the deadline and the feeder is on. Among those, charge in the cheapest, ties to the earlier, and say plainly when it cannot be done in time.

## The formula

```text
perSlotWh  =  chargerW / 2                       a half hour at chargerW watts
k          =  ceil(whNeeded / perSlotWh)         slots needed, rounded up
usable     =  slots with start before deadline and supplied
if k > number of usable  →  "cannot charge in time"
result     =  kata 04 on usable with k
```

This is a **filter, then greedy selection of the k smallest**.

## How to think it through

1. **Work out the energy per slot.** Watts for half an hour is watts divided by 2, in watt hours. 7,000 W gives 3,500 Wh a slot.
2. **Round the number of slots up.** 3,501 Wh needs two slots, because one gives only 3,500. One test checks exactly that.
3. **Filter before choosing.** Drop slots at or after the deadline and slots where the feeder is off. The cheapest slot in the first test is one the feeder does not supply.
4. **Then it is kata 04:** sort by price then start, take k, sort by start.
5. **Throw `cannot charge in time`** when fewer than k usable slots remain.

## Where it is easy to go wrong

- **Rounding down,** or dividing with floats and comparing exactly.
- **Choosing first and filtering after.** The cheapest slot overall may be unusable.
- **Parsing these starts with `new Date`.** The kata's starts, such as `2026-11-23T18:00`, have no offset, and JavaScript reads a date and time without an offset as local time (ADR 0007). They share one layout, so compare the strings as they are: alphabetical order is time order.
- **`<=` against the deadline.** A slot must start before it.

## What it costs

O(n) to filter, O(n log n) to sort, O(n) space. Made harder, this becomes a **sliding window** (charging that must run unbroken) and then a **knapsack** (a charger whose power varies by slot).
