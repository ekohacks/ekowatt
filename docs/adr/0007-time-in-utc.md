# ADR 0007: Time in UTC, local time only by name

Status: Agreed, 22 November 2026. Records the reasoning behind decision 10, which has been enforced by lint since commit 0338e76.

## Context

Every reading, top up and charge in ekowatt happens at a moment in time, and a bill depends on when. A half hour priced at the night rate and the same half hour priced at the day rate are different amounts of money. So the question of which clock the code reads is a question about money.

There are two kinds of reason to care, and they point the same way.

**Reasons any system has.** These hold for software that has nothing to do with electricity.

- **The machine's zone is not part of the program.** The same code runs on a laptop in London, a CI runner set to UTC and a server in Lagos. A method such as `getHours()` answers in the machine's zone, so the same input gives three answers. A test that passes on one machine and fails on another is the usual way this is found.
- **The language reads a missing offset as local.** The ECMAScript spec parses a date and time written without an offset, such as `2026-11-23T05:30`, as local time. A timestamp that looks complete is not.
- **Local days are not always 48 half hours.** Where clocks change for daylight saving time, as in London, one day a year has 46 half hours and another has 50, and one local half hour happens twice. UTC has neither problem.
- **Order and equality.** ISO 8601 timestamps in UTC with the same layout sort alphabetically in the order they happened (see `docs/deep-dives/order-should-not-matter.md`). Mixed offsets break that.

**Reasons ekowatt has.** These come from prepaid electricity in African markets.

- **One system, several zones.** A supplier may serve customers in Lagos (UTC+1, `Africa/Lagos`) and Nairobi (UTC+3, `Africa/Nairobi`) from the same deployment. Neither zone changes for daylight saving, but they differ from each other and from the server.
- **Local time is a fact about the customer, not the server.** A tariff's night, the hours a feeder supplies power, the calendar day a daily charge belongs to: each is local to where the customer lives. The server's zone has no business in any of them.
- **Every bill must be explainable to the kobo** (ADR 0006). If the same readings could be charged differently depending on where the code ran, no explanation would hold, and the agent's answer to "why did my units run out?" could not be trusted.
- **A half hour is named by its UTC start** (see the glossary). The interval, the key that keeps a reading once and the revision that corrects it all depend on that name being the same everywhere.

## Options

1. **Read the machine's local time.** Least code. Wrong on any machine whose zone is not the customer's, and wrong twice a year where clocks change.
2. **A date library** (Luxon, date-fns-tz, Moment Timezone). Handles zones well. A dependency in the money path, and the Temporal standard is due to replace what it does.
3. **UTC everywhere, local time only by name.** Store and compute in UTC. When a customer's local time is needed, compute it from the UTC instant and the customer's IANA zone name with `Intl.DateTimeFormat`, which is built into JavaScript. Move to Temporal when the runtime ships it.

## Decision

Option 3, as decision 10 states.

- Every timestamp in data is ISO 8601 in UTC with an explicit `Z`.
- Code reads time with the UTC methods (`getUTCHours` and the rest), never the local ones.
- A customer's local time comes only from `Intl.DateTimeFormat` with the zone named on the tariff or the account, such as `Africa/Lagos`.
- Tests take time from their inputs (a fixed ISO string, `Date.UTC`, a nulled `Clock`), never from the machine's clock.

The katas simplify. Kata 01 puts the night between 00:00 and 06:00 UTC, so a learner meets the rounding rule without a zone. The product code does not take that shortcut.

## How it is enforced

Since commit 0338e76, ESLint fails any call to a local get or set method (`getHours`, `setDate` and the rest), `getTimezoneOffset`, `toLocaleDateString` or `toLocaleTimeString`, anywhere in the repo. The message names this decision and what to use instead. `tests/architecture.test.ts` proves the rule fires in logic and in tests, and that `getUTCHours` is allowed. Since commit cd05cc6, tests may not call `Date.now()`, `new Date()` without arguments or `Math.random()`.

## Consequences

- The same readings give the same bill on every machine, which is what makes a bill explainable.
- A tariff and an account each carry a zone name. Forgetting it is a data error the code can refuse, not a silent shift of an hour.
- Converting to local time is a little more code than a library call.
- `toLocaleString` is not banned, because numbers use it too. A date's `toLocaleString` would slip past the rule. Review, and Temporal later, cover that gap.
- Anyone reading a log sees UTC, and has to add the customer's offset in their head.
