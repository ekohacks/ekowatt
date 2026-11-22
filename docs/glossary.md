# Glossary

Every term the code, the tests and the docs use, in plain words. A step that introduces a new term adds it here in the same commit.

## Energy and metering

- **Meter to cash.** The whole path from a meter reading to money settled on a customer's account.
- **Reading.** How much energy a meter recorded for one interval, in watt hours.
- **Interval, half hour.** The period a reading covers. Smart meters usually report every 30 minutes, 48 a day. An interval is named by its start time in UTC.
- **Watt hour (Wh), kilowatt hour (kWh).** Units of energy. 1 kWh is 1,000 Wh. ekowatt stores whole watt hours.
- **Reading source.** Where a reading came from: `measured` (interval data from a smart meter), `daily` (an occasional or daily read) or `estimated` (filled in by the system when there is no reading).
- **Revision.** A version number on a reading. A corrected reading has a higher revision, and the highest revision wins whatever order they arrive in.
- **Feeder.** The line from a substation that supplies a group of customers.
- **Supply band.** A tariff class set by how many hours a day a customer's feeder supplies power. In Nigeria, Band A is the band with at least 20 hours a day.
- **DisCo.** An electricity distribution company: it owns the local network and sells to customers.
- **Mini grid.** A small local network, often solar, serving a village or area off the national grid.

## Prepaid and payments

- **Prepaid.** The customer buys credit before using energy; consumption draws the credit down.
- **Top up.** A purchase of credit, usually by mobile money or a vending agent.
- **Token.** A number (often 20 digits, under the STS standard) that the customer types into the meter to load the credit they bought. One top up issues one token.
- **STS.** Standard Transfer Specification, the open standard for prepaid meter tokens.
- **Vending.** Selling top ups and issuing tokens.
- **Mobile money.** Payments through a mobile network account, such as M-Pesa or MTN MoMo.
- **Callback.** The message a payment provider sends to say a payment succeeded. It can arrive twice or late.

## Money

- **Minor unit.** The smallest unit of a currency: kobo for naira, cents for shillings or dollars, pence for pounds. 100 kobo make 1 naira.
- **Kobo.** ekowatt keeps all money as a whole number of kobo, never a float.
- **Carried remainder.** The fraction of a kobo left after rounding a charge down, carried into the next charge so nothing is lost. See ADR 0006.
- **Tariff.** The price rule: kobo per kWh, by supply band.

## Time

- **UTC.** Coordinated Universal Time, the one clock every timestamp in ekowatt is written in.
- **ISO 8601.** The standard text form for dates and times, such as `2026-11-23T05:30:00Z`. The `Z` means UTC.
- **IANA time zone.** A named zone from the standard time zone database, such as `Africa/Lagos` (UTC+1) or `Africa/Nairobi` (UTC+3).
- **Intl.** The internationalisation API built into JavaScript. `Intl.DateTimeFormat` with a `timeZone` gives the local hour without a library.
- **Temporal.** The newer JavaScript standard for dates and times. ekowatt will use it once the runtime ships it.
- **UTC offset.** How far a local clock is from UTC, such as +01:00 for Lagos. A timestamp written without one is read as the machine's local time.
- **Daylight saving time.** Moving the clocks forward in summer and back in autumn, as in London. It makes one local day 46 half hours long and another 50. Lagos and Nairobi do not use it.

## The ledger

- **Ledger.** The record of every money movement on an account: top ups in, charges out, credits.
- **Entry.** One line in the ledger. Entries are only ever added.
- **Append only.** Nothing in the ledger is edited or deleted. A mistake is fixed with a new entry.
- **Adjusting entry.** A new entry that corrects an earlier one, for example after a corrected reading.
- **Derived balance.** The balance is always worked out from the entries, never stored on its own.
- **Credit (as an entry).** Money given back to a customer. The agent may propose one; a person approves it.

## Delivery and correctness

- **Queue.** Where readings and payment callbacks wait to be processed.
- **At least once delivery.** A queue guarantee: every message arrives, but some may arrive more than once.
- **Acknowledge (ack).** Telling the queue a message is handled, so it stops sending it.
- **Idempotent.** Doing it twice has the same effect as doing it once. A reading delivered twice is stored once.
- **Out of order.** Messages arriving in a different order from the one in which they happened.

## The agent

- **Agent.** A program that uses a language model to answer questions by calling tools.
- **Tool.** A function the agent may call, such as `getBalance` or `explainCharge`. ekowatt's tools only read.
- **Evidence.** What a tool returns, with the source of each fact.
- **Confidence.** How sure an explanation can be, worked out by the core from the reading sources, not by the model.
- **Harness.** Everything around the model: the tools, the evidence, the confidence label, the rules on what may be said, and the recorded questions that test it.
- **MCP (Model Context Protocol).** An open protocol for exposing tools to any agent. ekowatt serves its read only tools over stdio.

## Testing Without Mocks (James Shore)

- **A-Frame Architecture.** The application on top; logic and infrastructure as separate siblings beneath it. Logic never imports infrastructure.
- **Logic Sandwich.** Read from infrastructure, run the logic, write the results back out.
- **Infrastructure Wrapper.** The only code that touches the outside world, such as `ReadingQueue`, `Clock` and `LlmClient`.
- **Nullable.** A wrapper that can be created with `createNull()` to run without the outside world, for tests.
- **Embedded Stub.** The stand in for the outside world, kept inside the wrapper rather than in test files.
- **Configurable Responses.** Telling a Nullable what to return, in the wrapper's own terms.
- **Behaviour Simulation.** Telling a Nullable to misbehave as the real thing can, such as delivering a message twice.
- **Output Tracking.** Recording what a wrapper sent, so tests check outcomes rather than calls.
- **Sociable test.** A test that runs real collaborators together instead of replacing them.
- **Narrow Integration Test.** One test of one wrapper against the real outside world.
- **State-Based Test.** A test that checks what a piece of code returned or left behind, not which functions it called.
- **Overlapping Sociable Tests.** Each test runs real collaborators, so between them the tests cover every layer, with no gaps for a mock to hide.
- **Easily-Visible Behaviour.** Logic written so its result is a plain return value, easy to test with input and output alone.
- **Parameterless Instantiation.** `createNull()` works with no arguments, so a test sets up only what it cares about.
- **Signature Shielding.** Test helpers take optional named options, so a new parameter does not break every test.
- **Grow Evolutionary Seeds.** No structure up front: a folder, a wrapper or a name appears when a test needs it.

## Property based testing

- **Example test.** A test that picks one input and checks one answer.
- **Property.** A statement that must hold for every input, such as "the order of arrival does not change the result".
- **Property based test.** A test where a library generates many inputs and checks a property against each one.
- **Arbitrary.** fast-check's name for a generator of inputs, such as readings, numbers or shuffles.
- **Shrinking.** When a property fails, trying smaller inputs until the smallest one that still fails is found.
- **Seed.** The number that fixes a run's random choices, so a failure can be replayed exactly.
- **Associative, commutative, idempotent.** Grouping, order and repeats do not change the result. An operation with all three is a **semilattice**. See `docs/deep-dives/order-should-not-matter.md`.

## Algorithms and cost

- **Big O notation.** How the work or memory of an algorithm grows as its input grows, ignoring constant factors. O(n) grows in step with the input; O(n log n) a little faster; O(n²) with its square; O(1) not at all.
- **Time and space complexity.** The Big O of the work done and of the memory held. The katas README gives both for each kata.
- **Greedy algorithm.** One that takes the best choice at each step and never goes back, such as taking the cheapest slots first.
- **Merge intervals.** Sort ranges by start, then sweep once, extending the current range or starting a new one.
- **Fold.** Walking a list once and carrying one running value, such as a total, from item to item.
- **Sliding window, knapsack.** Two harder optimisation shapes: the best unbroken run of slots, and the best choice of items under a limit when each has its own weight and value.

## Working with agents

- **Agent file.** Instructions a coding agent reads at the start of every session. Other agents read `AGENTS.md`. Claude Code reads `CLAUDE.md`, and reads `AGENTS.md` only when no `CLAUDE.md` sits in the folder it starts in or any folder above. ekowatt keeps its rules in `AGENTS.md` and its `CLAUDE.md` imports it, so the rules load whatever sits above the repo. `/context all` lists the files a session loaded.
- **Import (`@path`).** A line in `CLAUDE.md` such as `@AGENTS.md` that pulls another file's text in as if it were written there.
- **Lint rule.** A check ESLint runs on the code. A rule the agent file used to state in prose becomes one, so breaking it fails `npm run lint`.
