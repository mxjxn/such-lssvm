# LSSVM reference web UI (`@lssvm/web`)

Neutral Next.js front end for [sudoAMM v2 / LSSVM](https://github.com/sudoswap/lssvm): **explore pools**, **buy/sell** (any-N or specific token IDs), **create pools**, and **my pools**.

## Configure deployments

Copy `.env.example` to `.env.local` and set your factory, router, and bonding-curve addresses per chain. Nothing is hard-coded in this package.

See `packages/lssvm-contracts/script/DEPLOYMENT_ORDER.md` for deploying your own stack.

## Development

```bash
# from repository root
pnpm install
pnpm --filter @lssvm/web dev
```

## Scripts

```bash
pnpm --filter @lssvm/web test
pnpm --filter @lssvm/web build
pnpm --filter @lssvm/web check-types
```

Optional Postgres indexer: see `indexer/README.md`.

## Branded product

The production art-market experience lives in **[such.market](https://github.com/mxjxn/such.market)**. This app is an unbranded reference you can fork.