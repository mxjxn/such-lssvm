# such.market (`@lssvm/suchmarket`)

NFT AMM front end for Max’s LSSVM fork — the sales home for the cryptoart ecosystem.

- **cryptoart.studio** — artists manage contracts & launches (deep-links into `/launch`)
- **such.market** — pools, trading, (soon) auctions
- **cryptoart.social** — embeds `/embed/pool/...` and `/embed/collection/...`

## Run

```bash
pnpm install
pnpm --filter @lssvm/suchmarket dev
# http://localhost:3001
```

```bash
pnpm --filter @lssvm/suchmarket test
pnpm --filter @lssvm/suchmarket build
```

Env: see `ENV_VARS.md`. Uses Base + Base Sepolia factory/router addresses from `@mxjxn/lssvm-abis`.

## Data

Pool discovery uses **factory event logs via RPC** (`lib/indexer.ts`, `/api/pools`) — Vercel-friendly, no paid subgraph required. Quotes and trades read/write the chain with viem/wagmi.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/explore` | Browse pools |
| `/pool/[chainId]/[address]` | Detail + buy/sell |
| `/create` | Create pool |
| `/launch` | Artist launch-with-pool |
| `/my-pools` | Manage / deposit / params |
| `/auctions` | Stub for auction house |
| `/embed/pool/...` | Social embed card |
| `/embed/collection/...` | Collection liquidity card |
