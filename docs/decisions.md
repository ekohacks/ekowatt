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

## 6. Money in whole minor units

20 November 2026. Proposed, not yet agreed.

Amounts are integers in the currency's minor unit (kobo, cents), never floats, with rounding done once and named where it happens. Decided before the tariff step.

## The plan

| Step | What                                                                                                                            | Decision |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1    | Readings kept by meter and half hour, once                                                                                      | 1, 2     |
| 2    | Late corrections: the higher revision wins in any arrival order                                                                 | 2        |
| 3    | `ReadingQueue` wrapper: Nullable, Configurable Responses, `trackAcks()`, then `simulateRedelivery()` and `simulateOutOfOrder()` | 2, 3     |
| 4    | `Clock` wrapper                                                                                                                 | 2        |
| 5    | Tariffs: flat, then supply band                                                                                                 | 3, 6     |
| 6    | Prepaid ledger: top ups, consumption, one token per top up, derived balance                                                     | 3, 6     |
| 7    | `MeterToCash` application as a Logic Sandwich                                                                                   | 2        |
| 8    | Read only queries: balance, entries, explain a charge                                                                           | 4        |
| 9    | `LlmClient` wrapper with a Nullable                                                                                             | 4        |
| 10   | The "why did my units run out?" agent                                                                                           | 4        |
| 11   | MCP server over stdio                                                                                                           | 4        |
