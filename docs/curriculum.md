# Teaching from ekowatt

ekowatt is built one committed step at a time, so its history is a course. Each module below is one or two commits: learners read the failing tests, write the green themselves with AI completion off, then compare with the commit.

| Module                              | What learners practise                                                             | Commits to work from                 |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| 1. The same thing twice             | Identity and keys: what makes two readings "the same", idempotent writes           | Readings kept by meter and half hour |
| 2. Arrival order is not event order | Versions, late corrections, why you recompute instead of applying deltas           | Revisions                            |
| 3. Wrapping the outside world       | Infrastructure Wrappers, `create()` and `createNull()`, Embedded Stubs             | `ReadingQueue`                       |
| 4. Making failure boring            | Behaviour Simulation of at least once delivery; Output Tracking instead of mocks   | Queue redelivery and reordering      |
| 5. Time is infrastructure           | A Nullable clock, testing midnight and band edges                                  | `Clock`                              |
| 6. Pricing without floats           | Tariffs, supply bands, money in minor units, one rounding rule                     | Tariffs                              |
| 7. Never edit money                 | Append only ledgers, derived balances, adjusting entries, one token per top up     | Prepaid ledger                       |
| 8. The application layer            | A-Frame and the Logic Sandwich; sociable tests over nulled infrastructure          | `MeterToCash`                        |
| 9. An agent at the edge             | Read only tools, a model behind a Nullable wrapper, a person approves every credit | Queries, `LlmClient`, the agent      |
| 10. Speaking MCP                    | Exposing tools to any agent over stdio, with a narrow integration test             | MCP server                           |

Each module ends with a 15 minute timed kata on the same idea, done cold in a blank file.
