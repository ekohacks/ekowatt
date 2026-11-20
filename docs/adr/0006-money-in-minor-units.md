# ADR 0006: Who keeps the half kobo

Status: Agreed, 20 November 2026.

## Context

A prepaid customer is charged for every half hour of electricity they use. A charge is energy times price: 0.37 kWh at ₦209.50 per kWh is ₦77.515. Two problems hide in that sum.

**Floats cannot hold most decimals exactly.** In JavaScript `0.1 + 0.2` is `0.30000000000000004`. One bill does not show it. A ledger summing thousands of half hourly charges drifts, and then the balance no longer matches the sum of its entries and nobody can explain a bill to the kobo.

**Someone keeps the fraction.** ₦77.515 is 7,751.5 kobo. The charge has to be a whole kobo, so 7,751 or 7,752. A meter is charged 48 times a day. A rule that leans one way, applied that often across every meter, moves real money.

## Options

1. **Half up.** 7,751.5 becomes 7,752. Easy for a person to check by hand. Every exact half goes to the supplier.
2. **Banker's rounding (half to even).** 7,751.5 becomes 7,752 and 7,752.5 becomes 7,752. No bias over volume, but it surprises anyone checking a single charge by hand.
3. **Round down and carry the remainder.** 7,751.5 becomes 7,751, and the half kobo is carried into the next charge. Nothing is lost; fractions build up until they make a whole kobo.

## Decision

Option 3.

- **Money** is an integer number of kobo (the minor unit; cents elsewhere).
- **Energy** is an integer number of watt hours. Meters report to the watt hour, so 0.37 kWh is `370`.
- **Prices** are integer kobo per kWh.
- A charge works in thousandths of a kobo, all integers:

```text
exact     = energyWh × priceKoboPerKWh + carried      370 × 20950 + 0 = 7,751,500
charge    = floor(exact / 1000)                       7,751 kobo
carried   = exact mod 1000                            500, into the next half hour
```

- The rounding lives in one named function, and each ledger entry records the remainder it carried, so any charge can be explained.

## Why not half up

Half up was the first proposal, because it is the easiest to check by hand. That is convenience for the supplier and the regulator, not fairness to the customer. It was challenged with one question: why should the customer pay for that? For a product meant for prepaid customers who watch every unit, it should not.

## Consequences

- The charges for a meter always add up to its exact cost, rounded down once. The customer never pays for energy they did not use.
- The supplier gives up less than one kobo per meter, across the life of the meter.
- Each meter holds one more number: the carried remainder.
- The tests state the guarantee directly: for any run of readings, the sum of the charges equals the floor of the exact total.
