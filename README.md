# EkoWatt

A practice kata: a small, in memory slice of an energy retail platform, from meter to cash.

Half hourly meter readings arrive on a queue. Some arrive twice, some arrive late and some arrive out of order. Each reading is priced by a tariff and lands as a charge on a customer ledger. The ledger is append only. Nothing is ever edited or deleted, and the balance is always derived from the entries, never stored.

There is no database, no HTTP server and no Docker. Everything runs in memory. Tests use Nullables (James Shore's Testing Without Mocks) in place of mocks.

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
