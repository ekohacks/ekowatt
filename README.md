# EkoWatt

A teaching kata from EkoHacks: prepaid electricity for African markets, from meter reading to money, built test first one commit at a time.

Customers buy credit in advance, usually with mobile money, and their consumption draws it down. Meter readings and payment callbacks arrive on a queue, some twice, some late, some out of order. Each reading is priced by supply band and charged to an append only ledger whose balance is always derived from its entries. Money is kept in whole kobo and never rounded against the customer. At the edge, a read only agent answers "why did my units run out?" from whatever data exists, and says how sure it is.

This is a kata for learning and teaching, not a product. There is no database, no HTTP server and no Docker; everything runs in memory. Tests use Nullables (James Shore's Testing Without Mocks) in place of mocks.

- [Decisions](docs/decisions.md) and [ADRs](docs/adr/): every design choice, before the code that follows it
- [Glossary](docs/glossary.md): every term, in plain words
- [Curriculum](docs/curriculum.md): the course this history teaches

## Running it

Use Node 24 (see `.nvmrc`).

```sh
npm install
npm test
```

Other scripts:

- `npm run test:watch` reruns the tests on every change
- `npm run typecheck` checks the types
- `npm run lint` runs ESLint
- `npm run format` formats the code with Prettier

## Layout

- `src/` holds the domain
- `src/infrastructure/` will hold the wrappers for the queue and the clock, each with `create()` and `createNull()`
- `tests/` mirrors `src/`
