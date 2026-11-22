# Decisions

Every design decision is written here before the code that follows it. Each entry says what was decided, why, and what it costs. A decision changes only by a new entry that replaces it; old entries stay.

## 1. In memory, TypeScript and Vitest

20 November 2026. Agreed.

No database, no HTTP server, no Docker. The point is the domain and the tests, and everything runs in one command. Cost: no real storage constraints to lean on, so idempotency lives in the logic.

## 2. James Shore's Testing Without Mocks pattern language

20 November 2026. Agreed.

A-Frame architecture, Logic Sandwich, Infrastructure Wrappers with Nullables, Behaviour Simulation, Output Tracking, sociable state based tests. No mocking libraries. Tests read like the domain, and the failures we care about (a message delivered twice, out of order, late) become one line of setup. Cost: each wrapper carries its own Embedded Stub. Details in `AGENTS.md`.

## 3. Prepaid electricity in African markets first

20 November 2026. Agreed.

The customer buys units in advance, usually with mobile money. So:

- the ledger is a prepaid credit balance: top ups in, consumption out, the balance always derived from the entries;
- payment callbacks from mobile money arrive on the same queue as meter readings, and can arrive twice or late;
- one token is issued per top up, never two;
- tariffs price by supply band (how many hours a day the feeder supplies power), not by time of day;
- the agent answers "why did my units run out?".

Cost: a postpaid bill is not built. It can be added later as another ledger view.

## 4. An agent at the edge, read only

20 November 2026. Agreed.

The deterministic core decides money. The agent only reads: balance, entries, and an explanation of any charge (the reading, the band, the price). It may propose a credit; a person approves it, and the approval goes through the same tested ledger logic. The model sits behind an `LlmClient` Infrastructure Wrapper with a Nullable, so the agent is tested without calling a model. The tools are also exposed as an MCP server over stdio.

Cost: two runtime dependencies, `@anthropic-ai/sdk` and `@modelcontextprotocol/sdk`, and an API key (`ANTHROPIC_API_KEY`) needed only by the narrow integration test, which runs on demand. A WhatsApp or USSD channel is described, not built.

## 5. The way of working

20 November 2026. Agreed.

One small step at a time. Failing tests are committed on their own, then the change that passes them. The owner runs the checks and makes every commit. A helper agent may scaffold, never commit. Each committed step goes into the work journal.

## 6. Money in whole minor units, energy in whole watt hours, round down and carry

20 November 2026. Agreed. Full record: [ADR 0006](adr/0006-money-in-minor-units.md).

Money is an integer number of kobo (or cents), energy an integer number of watt hours. Every charge is rounded down and the remainder carried into the next charge, so the charges always add up to the exact cost rounded down once. The customer never pays for energy not used; the supplier gives up less than one kobo per meter, ever.

## 7. The agent explains from whatever data exists, and says how sure it is

20 November 2026. Agreed.

Most prepaid customers do not have meters that send half hourly readings, and many have no meter at all. So every reading carries its source: `measured` (interval data from a smart meter), `daily` (an occasional or daily read) or `estimated` (no meter, or a gap filled by the system). Top ups and token history from vending count as evidence too. The confidence of an explanation is worked out by the core from those sources, not by the model, and the agent states it: "measured", "based on daily reads" or "estimated, because there is no meter reading for these days".

Cost: a source on every reading, estimation rules in the core, and an explanation that can say "I don't know" when the evidence is too thin.

## 8. The harness decides what the agent may say

20 November 2026. Agreed.

Everything around the model is engineered and tested like the rest of the core: which tools it gets, what evidence each tool returns with its source, the confidence label, the rule that every number in an answer must come from a tool result, the refusal when evidence is too thin, and a set of recorded questions with expected answers run against the nulled `LlmClient`. The model writes the sentence; the harness decides what is true.

## 9. A public teaching kata, a private product

20 November 2026. Agreed.

ekowatt stays public under the MIT licence: the core, the method, the decisions, the glossary and the curriculum. It is how EkoHacks shows the way it builds and how students learn. A company product, under its own name, lives in a separate private repository that builds on it: integrations with real vending, token and mobile money providers, tariff tables and estimation rules per operator, multi tenant setup, security and audit, and an agent tuned on pilot data.

Rules: no partner names, real tariffs, customer data or pilot results in this repository. Anything learned in a pilot comes back here only in a general form.

Cost: the core is open for anyone to copy. What cannot be copied is the partnerships, the engineers trained on the ground and the data from real pilots.

## 10. Time through standards and native APIs

20 November 2026. Agreed.

- All timestamps in data are ISO 8601 in UTC with an explicit `Z`. The ECMAScript spec reads a date and time without an offset as local time, so the same code would bill differently on a laptop in London and a server in Lagos.
- Logic reads time with the UTC getters (`getUTCHours`), never the local ones. The server's time zone never changes a bill.
- A customer's local time (a tariff's night, a supply window) comes only from `Intl.DateTimeFormat` with an IANA time zone such as `Africa/Lagos`.
- Temporal replaces this once the runtime ships it (Node 24.4 does not). No date libraries in between.

Cost: a little more code than a library call, and a time zone carried on every tariff. The `Clock` wrapper and the tariff step follow this.

Full record, with the general reasons and ekowatt's own: [ADR 0007](adr/0007-time-in-utc.md), added 22 November 2026.

## 11. Kata answers on their own branches

20 November 2026. Agreed.

`main` keeps every kata's `starter.ts` empty, so each learner starts from the same place. A learner who wants to share answers pushes them to a branch of their own, `solutions/<name>`, one commit per kata, and that branch never merges into `main`. The reference answers used to check the katas stay private.

Cost: answers are one branch switch away, so the katas README asks learners to try each kata first.

## 12. Property based tests with fast-check, as an extension of Testing Without Mocks

20 November 2026. Agreed.

Properties test laws: arrival order does not change the result, duplicates do not change the result, and the money guarantee of ADR 0006 holds. They run on logic, and on the application through Nullables, with fast-check generating the Configurable Responses and the Behaviour Simulation, and the checks made through Output Tracking. Each property sits next to a few readable examples, so a reader sees what the code does before seeing the law. Narrow Integration Tests against real infrastructure stay example based. All randomness in a test comes from the fast-check seed, never from `Math.random` or the clock, so any failure can be replayed.

This is our extension. James Shore's pattern language does not describe property based testing.

Cost: two dev dependencies, `fast-check` and `@fast-check/vitest`; properties are harder to write than examples, and a wrong property passes as easily as a wrong example; many runs take longer than one.

## 13. Rules a tool can check are lint rules, not lines in the agent file

21 November 2026. Agreed.

A rule ESLint can check (no mocks, logic never imports infrastructure, no `Math.random` or clock in tests, no local time getters) is enforced as a lint rule, with an error message that gives the reason. Once it is, its line leaves `AGENTS.md`. The agent file keeps only what no tool can check: the way of working, British English, decisions before code, and where to look.

Why: every line in the agent file is read in every session and competes with the task, and an agent can still ignore it. A lint rule fails the check instead, for the agent, a learner or anyone else. This follows Addy Osmani's "Stop Using /init for AGENTS.md" (23 February 2026): fix the code, then delete the line.

Cost: more ESLint configuration (`no-restricted-syntax`, `no-restricted-imports`), and error messages written to teach, since a learner may meet the rule before reading why.

## The plan

| Step | What                                                                                                                                            | Decision |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1    | Readings kept by meter and half hour, once                                                                                                      | 1, 2     |
| 2    | Late corrections: the higher revision wins in any arrival order                                                                                 | 2        |
| 3    | `ReadingQueue` wrapper: Nullable, Configurable Responses, `trackAcks()`, then `simulateRedelivery()` and `simulateOutOfOrder()`                 | 2, 3     |
| 4    | `Clock` wrapper (ISO 8601 UTC, local time through `Intl`)                                                                                       | 2, 10    |
| 5    | Tariffs: flat, then supply band                                                                                                                 | 3, 6, 10 |
| 6    | Prepaid ledger: top ups, consumption, one token per top up, derived balance                                                                     | 3, 6     |
| 7    | `MeterToCash` application as a Logic Sandwich                                                                                                   | 2        |
| 8    | Read only queries: balance, entries, explain a charge                                                                                           | 4        |
| 9    | `LlmClient` wrapper with a Nullable                                                                                                             | 4        |
| 10   | The "why did my units run out?" agent and its harness: evidence with sources, confidence, every number from a tool, refusal, recorded questions | 4        |
| 11   | MCP server over stdio                                                                                                                           | 4        |
