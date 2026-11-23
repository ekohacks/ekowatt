# Katas

Nine 15 minute katas from the same domain as ekowatt. Do each one cold: timer on, AI completion off, talking out loud.

1. Open the kata's `starter.ts` and replace the `throw` with your answer. If the kata has a `thinking.md`, read it first, then close it before the timer starts.
2. Run the katas with `npm run katas` (it reruns as you save).
3. When the kata's tests pass, stop the timer and note your time.
4. Reset it for next time with `git checkout katas/<kata>/starter.ts`. Never commit a `starter.ts` you have filled in; the next learner starts from it. Keep your answers on a `solutions/<your name>` branch instead.

| Kata                    | The idea                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| 01 price a day          | Night and day prices, a daily charge, whole kobo, round down once      |
| 02 latest revision wins | Duplicates and late corrections                                        |
| 03 missing half hours   | 48 slots a day, find the gaps                                          |
| 04 cheapest slots       | Pick the cheapest half hours, ties to the earlier                      |
| 05 merge outages        | Overlapping time ranges                                                |
| 06 top up once          | An idempotent mobile money callback                                    |
| 07 charge when supplied | Cheapest slots before a deadline, only while the feeder supplies power |
| 08 charge unbroken      | The cheapest run of consecutive half hours, all supplied               |
| 09 when units ran out   | The half hour a prepaid credit was used up                             |

## The algorithm behind each kata, and what it costs

Naming the shape before writing a line is half the kata. Each one below is a known algorithm or pattern, and its cost is written in Big O notation: how the work grows as the input grows, ignoring constant factors. Here n is the number of items in, k the number kept or picked, and d the number of days.

| Kata                    | Algorithm or pattern                                          | The work                                                                                                               | Time           | Space |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- | ----- |
| 01 price a day          | A fold in fixed point arithmetic, plus counting distinct keys | One pass: price each reading in thousandths of a kobo, add its UTC day to a `Set`                                      | O(n)           | O(d)  |
| 02 latest revision wins | Keep the max per key, then sort by a composite key            | One pass into a `Map` keyed by meter and half hour, then sort the k kept readings                                      | O(n + k log k) | O(k)  |
| 03 missing half hours   | Set difference over a generated range                         | Put the reading starts in a `Set`, walk the 48 slots of the day, keep the ones not in it                               | O(n)           | O(n)  |
| 04 cheapest slots       | Greedy selection of the k smallest                            | Sort by price then start, take k, sort those k by start                                                                | O(n log n)     | O(n)  |
| 05 merge outages        | Merge intervals: sort, then sweep                             | Sort by start, then one pass that extends the current range or starts a new one                                        | O(n log n)     | O(n)  |
| 06 top up once          | Idempotent consumer: a seen set in front of the effect        | A `Set` of payment ids seen and a `Map` of balances; each callback is one lookup                                       | O(1) per call  | O(p)  |
| 07 charge when supplied | Filter, then greedy selection of the k smallest, as in 04     | Keep slots before the deadline while supplied, work out k by rounding up, then as 04                                   | O(n log n)     | O(n)  |
| 08 charge unbroken      | Sliding window of fixed width                                 | Slide a window of k half hours along the day: add the one that joins, take away the one that leaves                    | O(n)           | O(1)  |
| 09 when units ran out   | Prefix sum and its first crossing                             | Add the charges in order until the running total reaches the credit; for many questions, binary search the prefix sums | O(n)           | O(1)  |

Notes on reading the table.

- `Map` and `Set` lookups are O(1) on average, which is what lets 01, 02, 03 and 06 work in one pass. A nested loop that searches a list instead would be O(n²).
- In 03 the day always has 48 slots, a constant, so walking them adds nothing that grows with n.
- In 06, p is the number of payments seen. The seen set grows forever unless old ids are allowed to expire, which is a real system's trade off and not the kata's.
- In 04 and 07, a heap of size k would pick the k smallest in O(n log k), faster when k is much smaller than n. With 48 slots a day, sorting is simpler and fast enough.
- Made harder, 07 becomes a **sliding window** (charging that must run unbroken), which is kata 08, and then a **knapsack** (a charger whose power varies by slot), which the curriculum's optimisation chapter takes on.

## Katas to come

Each comes from a part of the product (see the system design), asks one question of it, and practises a pattern the katas above do not. They are not written yet; each gets tests that a lucky answer cannot pass, an empty starter and a `thinking.md` when its turn comes.

| #   | Kata                         | Part of the product      | The question                                                                                                  | Pattern                                                          | Cost                   |
| --- | ---------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| 10  | Hours of supply, the band    | Rating, supply bands     | From a day’s merged outages, how many hours did the feeder supply, and which band does that make?             | Interval complement (builds on 05), then a threshold lookup      | O(n log n)             |
| 11  | Debt recovery                | Ledger                   | A customer owes ₦2,000. Each top up repays 20% until the debt is cleared. How much becomes units each time?   | Fold with state: the smaller of the share and what is still owed | O(n)                   |
| 12  | Lifeline tariff              | Rating                   | The first 50 kWh a month are cheaper, the next block dearer. What does this month cost, in whole kobo?        | Tiered pricing: fill each block in turn                          | O(blocks)              |
| 13  | Fill the gaps                | Gaps and estimates       | Estimate each missing half hour from the same half hour on the last 3 days that had a reading.                | Grouping by key, then a moving average                           | O(n)                   |
| 14  | Reconcile the settlement     | Payments                 | The provider’s end of day report against our payments: which are missing on our side, and which on theirs?    | Two pointers over two sorted lists, or a hash join               | O(n + m)               |
| 15  | Retry the token request      | Token issuer, outbox     | Failed requests retry after 1, 2, 4, 8 minutes. In what order do they go out?                                 | Min heap of next retry times (a priority queue)                  | O(n log n)             |
| 16  | Every number from a tool     | The agent’s harness      | Does every number in the agent’s draft reply appear in this turn’s tool results? (decision 8)                 | Tokenise, then set membership                                    | O(length of the text)  |
| 17  | The customer’s own day       | Rating, the daily charge | Put UTC readings into the customer’s local calendar day (`Africa/Nairobi`), not the UTC day.                  | Bucketing by a computed key, with `Intl` (ADR 0007)              | O(n)                   |
| 18  | A charger whose power varies | The charge planner       | Each half hour delivers different watt hours at a different price. Reach the energy needed at the least cost. | 0/1 knapsack, dynamic programming (after 07 and 08)              | O(n · W), W the energy |

They chain like the katas above: 05 leads to 10, 06 to 11 and 14, and 07 to 08 to 18.

Two to settle before writing them:

- **Kata 10’s bands.** The glossary gives Band A as at least 20 hours a day. The other bands’ hours need a source before they go in, or the kata states its own thresholds as the kata’s.
- **Kata 12’s blocks.** Lifeline tariffs differ by operator, so the kata uses blocks of its own and says so, as the time of use prices in kata 04 do.

The tests fail until you write the answer; that is the point. `npm test` does not run the katas.

One learner's answers are on the `solutions/anastasios` branch, one commit per kata. Try each kata first. To share your own, push them to a branch named `solutions/<your name>`; nothing from a solutions branch merges into `main` (decision 11).
