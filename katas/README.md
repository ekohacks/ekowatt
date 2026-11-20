# Katas

Seven 15 minute katas from the same domain as ekowatt. Do each one cold: timer on, AI completion off, talking out loud.

1. Open the kata's `starter.ts` and replace the `throw` with your answer.
2. Run all the katas: `npx vitest --config katas/vitest.config.ts` (it reruns as you save).
3. When the kata's tests pass, stop the timer and note your time.
4. Reset it for next time: `git checkout katas/<kata>/starter.ts`.

| Kata                    | The idea                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| 01 price a day          | Night and day prices, a daily charge, whole kobo, round down once      |
| 02 latest revision wins | Duplicates and late corrections                                        |
| 03 missing half hours   | 48 slots a day, find the gaps                                          |
| 04 cheapest slots       | Pick the cheapest half hours, ties to the earlier                      |
| 05 merge outages        | Overlapping time ranges                                                |
| 06 top up once          | An idempotent mobile money callback                                    |
| 07 charge when supplied | Cheapest slots before a deadline, only while the feeder supplies power |

The tests fail until you write the answer; that is the point. `npm test` does not run the katas.
