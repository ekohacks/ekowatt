# Kata 01, how to think about it

Read this before the timer starts, then close it. It gives the shape of the answer and the domain behind it, not the code.

## The question in the domain

A prepaid customer used electricity through one or more days. Their meter reported how much energy each half hour used. The supplier needs to know what that costs, in kobo, so the ledger can draw it from the customer's credit.

Two things make up the cost.

- **Energy.** Each half hour's energy times its price. The price depends on when the half hour started: the night price from 00:00 up to 06:00, the day price from 06:00. In the kata the hours are UTC. In the product they are the customer's local hours (ADR 0007).
- **A daily charge.** A fixed amount for each calendar day the customer had supply, charged once per day however many readings that day has.

The money rule from ADR 0006 holds throughout. Money is whole kobo, energy is whole watt hours, prices are whole kobo per kWh, nothing is a float, and the customer is never charged for energy they did not use.

## The units, before anything else

Watt hours times kobo per kilowatt hour gives kobo per thousand:

```text
wh × koboPerKWh  =  thousandths of a kobo
```

because a kWh is 1,000 Wh. Take one half hour that used 370 Wh, which is 0.37 kWh, priced at 20950 kobo per kWh (₦209.50 per kWh, the Band A style day price used across ekowatt). It costs 370 × 20950 = 7,751,500 thousandths of a kobo, which is 7,751.5 kobo. Keep everything in thousandths, as integers, until the very end. That one choice is what makes "round down once" possible.

## The formula

For readings r with energy wh(r) and start time t(r):

```text
price(r)  =  night   if the UTC hour of t(r) is before 6
             day     otherwise

days      =  the set of distinct UTC calendar days among the t(r)

total     =  floor( Σ wh(r) × price(r)  /  1000 )  +  dailyCharge × |days|
```

Σ is the sum over every reading, floor rounds down, and |days| is how many distinct days there are.

The daily charge is already whole kobo, so it can be added after the floor or inside it as dailyCharge × 1000; the answer is the same.

## How to think it through

1. **What comes in, what goes out.** A list of readings and a tariff in. One integer out. No readings means no energy and no days, so 0.
2. **One pass.** Every reading contributes to two things at once: the running sum of thousandths, and the set of days seen. This is a **fold**, walking the list once and carrying values along. Nothing needs sorting.
3. **Classify each reading.** Night or day is a question about the UTC hour of its start. Use the UTC methods; the repo's lint rule fails the local ones, and the reason is ADR 0007.
4. **Count days with a set.** A day is counted once however many readings fall in it, which is what a `Set` gives you. The question to answer carefully is what the set's key is. It has to name one calendar day and nothing else.
5. **Round once, at the end.** Divide the sum of thousandths by 1,000 and round down, once. Rounding each reading separately loses a fraction every time, and the fractions add up to whole kobo.

## Where it is easy to go wrong

- **A day key that is too short.** The day of the month alone makes 23 November and 23 December one day. The day of the week makes 23 and 30 November one day. Two of the tests exist to catch exactly these.
- **The 06:00 boundary.** 05:30 is night, 06:00 is day. "Before 6" is strict.
- **Rounding per reading.** It looks harmless, but each reading drops its fraction, so the total comes out below the exact cost rounded once. The supplier loses a kobo every few readings, and the bill no longer matches the formula.
- **Floats.** `wh / 1000 * price` goes through a fraction and can come back as 7751.499999. Multiply first, divide once.
- **Local time.** `getHours()` answers in the machine's zone, so the same test passes in London and fails in Lagos.

## A worked example, not one of the tests

Tariff: day 20950, night 12000, daily charge 5000. Readings:

| Start (UTC)       | Wh  | Price | Thousandths of a kobo |
| ----------------- | --- | ----- | --------------------- |
| 1 December, 02:00 | 250 | night | 3,000,000             |
| 1 December, 18:00 | 333 | day   | 6,976,350             |
| 1 December, 18:30 | 333 | day   | 6,976,350             |
| 2 December, 09:00 | 333 | day   | 6,976,350             |

The sum is 23,929,050 thousandths. Rounded down once, 23,929 kobo. Two distinct days, so 2 × 5000 = 10,000. Total 33,929 kobo.

Rounded per reading instead, the energy comes to 3,000 + 6,976 × 3 = 23,928, one kobo less. Each day reading leaves 0.35 of a kobo behind, and three of them make 1.05, a whole kobo the per reading version throws away. Here that kobo is the supplier's; in ADR 0006 the same mistake made over thousands of readings is why the remainder is carried.

## What it costs

One pass over n readings, O(n) time. The set holds one key per day, O(d) space for d days. See the table in `katas/README.md`.

## Then

Close this file, start the timer, turn AI completion off, and write it in `starter.ts`. Run `npm run katas`. When you are done, reset it with `git checkout katas/01-price-a-day/starter.ts`.
