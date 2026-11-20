# Agent notes

- Work here follows the pair-steps way of working. Make one small step, then stop. The owner runs the tests and makes the commit before the next step starts.
- Test first: a failing test, then the change that makes it pass, then any refactor, each its own step.
- No mocks, spies or stubbing libraries. Use James Shore's Nullables: https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks. Infrastructure wrappers (the queue, the clock) live in `src/infrastructure/` and expose `create()` and `createNull()`. Assert on state and tracked output, never on call records.
- Everything stays in memory: no database, no HTTP server, no Docker.
- Prose is British English.
