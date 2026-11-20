# Agent notes

- Work here follows the pair-steps way of working. Make one small step, then stop. The owner runs the tests and makes the commit before the next step starts.
- Test first: a failing test, then the change that makes it pass, then any refactor, each its own step.
- No mocks, spies or stubbing libraries. Use James Shore's Nullables: https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks. Infrastructure wrappers (the queue, the clock) live in `src/infrastructure/` and expose `create()` and `createNull()`. Assert on state and tracked output, never on call records.
- Everything stays in memory: no database, no HTTP server, no Docker.
- Prose is British English.
- Design decisions go in `docs/decisions.md` (and an ADR in `docs/adr/` when the reasoning matters) before the code that follows them. Every new term goes in `docs/glossary.md` in the same commit that introduces it.

## The pattern language

The code follows James Shore's Testing Without Mocks pattern language. Use the pattern names in code, reviews and commit messages.

- **A-Frame Architecture.** The application (`MeterToCash`) sits on top of two siblings: logic (which reading counts for a meter and half hour, tariff pricing, the ledger balance) and infrastructure (the reading queue, the clock). Logic never imports infrastructure; the application wires them.
- **Logic Sandwich.** The application reads from infrastructure, hands the data to logic, then writes the results back out.
- **Infrastructure Wrappers.** `ReadingQueue` and `Clock` are the only code that touches the outside world.
- **Nullables.** Each wrapper has `create()` and `createNull()`. The Embedded Stub lives inside the wrapper, not in test files. `createNull()` takes Configurable Responses in the wrapper's own terms, for example `{ messages: [...] }` or `{ now: '2026-11-23T14:00Z' }`.
- **Behaviour Simulation.** Nulled wrappers can be told to misbehave as the real thing would, for example `simulateRedelivery()` or `simulateOutOfOrder()`.
- **Output Tracking.** Wrappers expose `trackX()`, for example `trackAcks()`. Tests assert on what was sent, never on calls.
- **Tests.** Narrow, State-Based, Overlapping Sociable Tests: application tests run real logic over nulled infrastructure. Logic tests are plain input and output (Easily-Visible Behaviour). Each wrapper gets a Narrow Integration Test against `create()`.
- **Parameterless Instantiation and Signature Shielding.** `createNull()` works with no arguments; test helpers take optional named options.
- **Grow Evolutionary Seeds.** No structure up front; a folder appears when a test needs it.
