# Katas

Seven 15 minute katas from the same domain as ekowatt. Do each one cold: timer on, AI completion off, talking out loud.

1. Open the kata's `starter.ts` and replace the `throw` with your answer.
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

## The algorithm behind each kata, and what it costs

Naming the shape before writing a line is half the kata. Each one below is a known algorithm or pattern, and its cost is written in Big O notation: how the work grows as the input grows, ignoring constant factors. Here n is the number of items in, k the number kept or picked, and d the number of days.

| Kata                    | Algorithm or pattern                                          | The work                                                                                 | Time           | Space |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------- | ----- |
| 01 price a day          | A fold in fixed point arithmetic, plus counting distinct keys | One pass: price each reading in thousandths of a kobo, add its UTC day to a `Set`        | O(n)           | O(d)  |
| 02 latest revision wins | Keep the max per key, then sort by a composite key            | One pass into a `Map` keyed by meter and half hour, then sort the k kept readings        | O(n + k log k) | O(k)  |
| 03 missing half hours   | Set difference over a generated range                         | Put the reading starts in a `Set`, walk the 48 slots of the day, keep the ones not in it | O(n)           | O(n)  |
| 04 cheapest slots       | Greedy selection of the k smallest                            | Sort by price then start, take k, sort those k by start                                  | O(n log n)     | O(n)  |
| 05 merge outages        | Merge intervals: sort, then sweep                             | Sort by start, then one pass that extends the current range or starts a new one          | O(n log n)     | O(n)  |
| 06 top up once          | Idempotent consumer: a seen set in front of the effect        | A `Set` of payment ids seen and a `Map` of balances; each callback is one lookup         | O(1) per call  | O(p)  |
| 07 charge when supplied | Filter, then greedy selection of the k smallest, as in 04     | Keep slots before the deadline while supplied, work out k by rounding up, then as 04     | O(n log n)     | O(n)  |

Notes on reading the table.

- `Map` and `Set` lookups are O(1) on average, which is what lets 01, 02, 03 and 06 work in one pass. A nested loop that searches a list instead would be O(n²).
- In 03 the day always has 48 slots, a constant, so walking them adds nothing that grows with n.
- In 06, p is the number of payments seen. The seen set grows forever unless old ids are allowed to expire, which is a real system's trade off and not the kata's.
- In 04 and 07, a heap of size k would pick the k smallest in O(n log k), faster when k is much smaller than n. With 48 slots a day, sorting is simpler and fast enough.
- Made harder, 07 becomes a **sliding window** (charging that must run unbroken) and then a **knapsack** (a charger whose power varies by slot). The curriculum's optimisation chapter takes them there.

The tests fail until you write the answer; that is the point. `npm test` does not run the katas.

One learner's answers are on the `solutions/anastasios` branch, one commit per kata. Try each kata first. To share your own, push them to a branch named `solutions/<your name>`; nothing from a solutions branch merges into `main` (decision 11).
