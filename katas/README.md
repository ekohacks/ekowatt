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

The tests fail until you write the answer; that is the point. `npm test` does not run the katas.

One learner's answers are on the `solutions/anastasios` branch, one commit per kata. Try each kata first. To share your own, push them to a branch named `solutions/<your name>`; nothing from a solutions branch merges into `main` (decision 11).
