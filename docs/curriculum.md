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

## What you gain

This course teaches what has to be true before you can trust code an AI wrote, and how to build an agent that can be trusted near money. By the end you can:

1. **Write the test before the AI writes the code.** You state behaviour as a failing test, so any code, yours or a model's, is judged by something you wrote and understand.
2. **Work in steps you can check.** The AI makes one change; you run it, read the diff, and commit it or reject it. Your history tells a story a reviewer can follow.
3. **Code without the AI.** Every module ends with a 15 minute kata with AI completion off, so you can still think when the tool is gone, and pass interviews that test exactly that.
4. **Design so an agent cannot make a mess.** The A-Frame and Nullables give every kind of code one place; a rule file tells the agent where things go, and the tests catch it when it does not listen.
5. **Build an agent near money that holds up.** Read only tools, evidence with its source, confidence decided by code rather than the model, refusal when evidence is thin, and evals that run with no model and no API bill.
6. **Expose your tools over MCP,** so any agent can use what you built.
7. **Know a real domain.** At least once delivery, idempotency, append only ledgers, money in minor units, prepaid and mobile money. It carries over to payments, fintech and any event driven backend.
8. **Show it.** A public repository with decisions, ADRs, a glossary and a clean commit history, and the articles that explain it.

It does not promise a job or a senior title. You leave with a repository that shows how you work with an AI: tests first, small reviewed steps, and an agent whose every answer you can explain.
