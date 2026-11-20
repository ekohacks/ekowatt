# Teaching from ekowatt

ekowatt is built one committed step at a time, so its history is a course. Each module below is one or two commits: learners read the failing tests, write the green themselves with AI completion off, then compare with the commit.

| Module                              | What learners practise                                                             | Algorithm or pattern behind it                                                                                          | Commits to work from                 | Katas  |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------ |
| 1. The same thing twice             | Identity and keys: what makes two readings "the same", idempotent writes           | **Group by key** in a hash map                                                                                          | Readings kept by meter and half hour | 02, 06 |
| 2. Arrival order is not event order | Versions, late corrections, why you recompute instead of applying deltas           | **Keep the max per key**, a last writer wins register ordered by version; **sort by a composite key**                   | Revisions                            | 02     |
| 3. Wrapping the outside world       | Infrastructure Wrappers, `create()` and `createNull()`, Embedded Stubs             | **Adapter** (ports and adapters), a design pattern                                                                      | `ReadingQueue`                       |        |
| 4. Making failure boring            | Behaviour Simulation of at least once delivery; Output Tracking instead of mocks   | **Idempotent consumer**, where a seen set turns at least once delivery into exactly once effects                        | Queue redelivery and reordering      | 06     |
| 5. Time is infrastructure           | A Nullable clock, testing midnight and band edges                                  | **Set difference over a generated range** (gap finding); **merge intervals** (sort, then sweep)                         | `Clock`                              | 03, 05 |
| 6. Pricing without floats           | Tariffs, supply bands, money in minor units, one rounding rule                     | **Fixed point arithmetic**, a **fold**, and **error diffusion** (carry the remainder, as in Bresenham's line algorithm) | Tariffs                              | 01     |
| 7. Never edit money                 | Append only ledgers, derived balances, adjusting entries, one token per top up     | **Event sourcing**, state as a fold over an append only log                                                             | Prepaid ledger                       | 06     |
| 8. The application layer            | A-Frame and the Logic Sandwich; sociable tests over nulled infrastructure          | **Functional core, imperative shell**                                                                                   | `MeterToCash`                        |        |
| 9. An agent at the edge             | Read only tools, a model behind a Nullable wrapper, a person approves every credit | **Tool calling loop** with a **grounding check** (every number must come from a tool result)                            | Queries, `LlmClient`, the agent      |        |
| 10. Speaking MCP                    | Exposing tools to any agent over stdio, with a narrow integration test             | **JSON-RPC over stdio**, the protocol MCP is built on                                                                   | MCP server                           |        |

Katas 04 (cheapest slots) and 07 (charge when supplied) practise **greedy selection of the k smallest**, which belongs to the optimisation chapter planned after the agent. Made harder, they lead to a **sliding window** (charging that must run unbroken) and towards **knapsack** (a charger whose power varies by slot).

Naming the algorithm matters as much as writing it. "This is merge intervals, sort then sweep" tells a reviewer or an interviewer that you recognised the shape before writing a line.

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
