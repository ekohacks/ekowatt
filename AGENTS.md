# Agent notes

Only what the code, the tools and the docs cannot tell you. A rule a tool can check is a lint rule instead (decision 13).

- Work in pair steps: make one small step, then stop. The owner runs `npm run check` and makes the commit before the next step starts.
- Test first: a failing test, then the change that makes it pass, then any refactor, each its own step.
- Read `docs/decisions.md` before any change to the design. A new decision is written there (and an ADR in `docs/adr/` when the reasoning matters) before the code that follows it. Every new term goes in `docs/glossary.md` in the same commit that introduces it.
- Tests use James Shore's Testing Without Mocks pattern language (decision 2): https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks. Use its pattern names, listed in the glossary, in code, reviews and commit messages. Assert on state and tracked output, never on calls.
- Grow Evolutionary Seeds: no structure up front. A folder, a wrapper or a name appears when a test needs it, not before.
- Laws (order, duplicates, the money guarantee) are fast-check properties with a few readable examples beside each (decision 12). All randomness comes from the fast-check seed.
- Never commit a filled in kata `starter.ts` (decision 11).
- Prose is British English.
