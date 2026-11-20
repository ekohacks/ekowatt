# Why order should not matter in katas 01 and 02

Readings and payments arrive twice, late and out of order. Katas 01 and 02 both ask for an answer that does not depend on any of that. This note explains why that works when it works, using three properties from algebra, and shows where a computer quietly breaks them.

## Three properties

For an operation that combines two things into one, written here as `⊕`:

| Property        | Law                         | What it buys you                                                                       |
| --------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| **Associative** | `(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)` | Grouping does not matter, so you can combine in batches, in parallel, or one at a time |
| **Commutative** | `a ⊕ b = b ⊕ a`             | Arrival order does not matter                                                          |
| **Idempotent**  | `a ⊕ a = a`                 | Duplicates do not matter                                                               |

An operation with all three is called a **semilattice**. Combine any pile of inputs with it, in any order, with any repeats, and you get the same answer. That is exactly what a system with at least once, unordered delivery needs.

## Kata 01, why the sum must be in integers

Kata 01 adds up the cost of each half hour. Addition on whole numbers is associative and commutative, so the order of the readings cannot change the total.

Addition on floating point numbers, the kind JavaScript uses for every `number`, is **not associative**. Each addition rounds its result to the nearest value the format can hold, and the rounding depends on what was added first.

```js
0.1 + 0.2 + 0.3; // 0.6000000000000001
0.1 + (0.2 + 0.3); // 0.6
```

With prices, the same five charges for one meter, priced in naira as floats and summed forwards and then backwards:

```js
const charges = [0.37, 0.48, 1.013, 0.007, 0.459].map((kWh) => kWh * 209.5);
charges.reduce((s, v) => s + v, 0); // 487.9255
[...charges].reverse().reduce((s, v) => s + v, 0); // 487.92549999999994
```

Same readings, two different totals, decided by arrival order. The gap is tiny, but `===` says they are not equal, so a ledger that checks a stored balance against a recomputed sum reports a mismatch, and any rounding rule applied near a boundary can tip the result by a kobo. That is the drift ADR 0006 exists to stop. In whole watt hours and kobo per kWh, every product and every sum is an integer, addition is associative and commutative again, and the order of the readings stops mattering.

**The limit of the fix.** JavaScript integers are exact only up to `Number.MAX_SAFE_INTEGER`, 9,007,199,254,740,991. ekowatt sums in thousandths of a kobo, so one sum stays exact up to about 9 × 10¹² kobo, roughly ₦90 billion. That is far beyond one meter's bill, and it is the number to remember if the same code ever totals a whole distribution company. Past it, `BigInt` is the native answer.

**The daily charge is idempotent on purpose.** Counting days with a `Set` makes adding the same day twice change nothing, `S ∪ {d} ∪ {d} = S ∪ {d}`. Set union is a semilattice, which is why the `Set` was right and why every key bug in kata 01 (`getUTCDate`, `getUTCDay`) was a broken idea of "the same day", not a broken union.

## Kata 02, why the highest revision wins and nothing else does

Kata 02 keeps one reading per meter and half hour. The rule decides what happens when two readings for the same slot meet.

| Rule                                          | Associative | Commutative | Idempotent | Order independent |
| --------------------------------------------- | ----------- | ----------- | ---------- | ----------------- |
| **Highest revision wins** (`max` by revision) | yes         | yes         | yes        | **yes**           |
| Last to arrive wins (overwrite)               | yes         | **no**      | yes        | no                |
| First to arrive wins (never replace)          | yes         | **no**      | yes        | no                |

Only `max` has all three, so only "highest revision wins" gives the same answer whatever order the readings arrive in. The other two depend on arrival, which is exactly what the kata's tests exposed. The test that sends the correction first catches "last to arrive wins". The test that sends it second catches "first to arrive wins". Until the second test existed, a rule that is not commutative passed, because the tests only tried one order.

In distributed systems this structure is called a **last writer wins register**, and it is one of the simplest **conflict free replicated data types** (CRDTs). The "last writer" is decided by the revision, not by the clock of whoever received it. That matters, because two machines' clocks disagree and a revision number does not.

**One condition.** `max` is only a fair rule if two different readings never share a revision for the same slot. If they can, the merge needs a tie breaker that is also order independent, such as the larger `wh` or a reading id, or the answer depends on arrival again.

## Sorting needs a total order

The kata's output is sorted by start, then meter. A comparator for `sort` must describe a **total order**, in which any two items compare as before, after or equal, consistently. Comparing `start` first and `meterId` only on a tie does that.

It works on the strings themselves because of decision 10. ISO 8601 timestamps in UTC with the same layout sort alphabetically in the same order as they happen in time. Mix in a timestamp with an offset (`+01:00`) or without seconds, and the alphabetical order no longer matches the clock.

One more detail. `localeCompare` compares as a human language would, with rules that can vary by locale. For machine identifiers like ISO timestamps and meter ids, a plain code unit comparison (`a < b ? -1 : a > b ? 1 : 0`) is exact and faster. Both give the same answer on these inputs.

## Cost

| Kata | Work                                                  | Cost                                                  |
| ---- | ----------------------------------------------------- | ----------------------------------------------------- |
| 01   | One pass to price and sum; a `Set` insert per reading | O(n) time, O(d) space for d days                      |
| 02   | One pass into a `Map`; then a sort                    | O(n) to merge, O(k log k) to sort k slots, O(k) space |

`Map` and `Set` lookups are O(1) on average, which is what makes one pass enough.

## Testing the laws directly

The examples in the kata tests pick one order and check one answer. The laws above suggest a stronger test. Shuffle the input, duplicate random items, and check the answer does not change. That is **property based testing**, where a library generates many inputs and checks that a property holds for all of them. It would have caught "first to arrive wins" without anyone thinking to write the second order by hand. Adding such a library is a design decision, so it is proposed separately rather than added here.

## Further reading

- David Goldberg, "What Every Computer Scientist Should Know About Floating-Point Arithmetic", ACM Computing Surveys, 1991.
- Marc Shapiro, Nuno Preguiça, Carlos Baquero and Marek Zawirski, "Conflict-free Replicated Data Types", 2011.
- MDN, `Number.MAX_SAFE_INTEGER` and `String.prototype.localeCompare`.
