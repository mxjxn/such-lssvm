# LSSVM reference (sudoAMM v2)

A **forkable Turborepo** for the [LSSVM](https://github.com/sudoswap/lssvm) protocol (Liquidity-Sensitive Single-Variant Market / sudoAMM v2): Solidity contracts, shared ABIs, deployment scripts, optional subgraph/indexer tooling, and a **neutral web UI** for exploring and trading on bonding-curve NFT pools.

The production, branded marketplace is **[such.market](https://github.com/mxjxn/such.market)**. This repository stays generic so you can deploy your own factory/router and wire your own addresses.

## What is LSSVM?

sudoAMM v2 extends v1 with on-chain royalties, property checking for pools, optional project settings, ERC-1155 pairs, separate fee accounting, and the **VeryFastRouter** for multi-asset swaps and partial fills. Overview: [Introducing sudoAMM v2](https://blog.sudoswap.xyz/introducing-sudoswap-v2.html).

![sudoAMM v2 diagram](./flowchart.png)

## Monorepo layout

| Path | Purpose |
|------|---------|
| `packages/lssvm-contracts` | Protocol Solidity, Foundry tests, deploy scripts |
| `packages/lssvm-abis` | ABIs, types, and address helpers (no baked-in deployments) |
| `apps/web` | Reference Next.js UI: explore, trade, create pool, my pools |
| `apps/indexer` | The Graph subgraph template (set your factory address before deploy) |
| `apps/docs` | GitHub Pages documentation site |
| `archive/miniapp` | Archived legacy Farcaster miniapp (unmaintained) |

## Quick start

```bash
pnpm install
pnpm build
pnpm check-types
pnpm test
```

### Deploy your own stack

1. Read `packages/lssvm-contracts/script/DEPLOYMENT_ORDER.md`.
2. Configure Foundry env (see `packages/lssvm-contracts/ENV_SETUP.md`) and broadcast deploy scripts under `packages/lssvm-contracts/script/`.
3. Copy addresses from broadcast JSON into your app env.

### Run the reference UI

```bash
cp apps/web/.env.example apps/web/.env.local
# edit apps/web/.env.local with your factory, router, and curve addresses

pnpm --filter @lssvm/web dev
```

Open [http://localhost:3001](http://localhost:3001). See `apps/web/README.md` and `apps/web/ENV_VARS.md` for all variables.

### Verify deployments (optional)

```bash
NEXT_PUBLIC_FACTORY_ADDRESS_84532=0x... \
NEXT_PUBLIC_ROUTER_ADDRESS_84532=0x... \
pnpm --filter @lssvm/web exec tsx apps/web/scripts/verify-lssvm-deployments.ts 84532
```

## Configuration philosophy

- **No maintainer-specific factory/router addresses** in application code or `@mxjxn/lssvm-abis`.
- Example shape: `packages/lssvm-abis/src/addresses.example.ts` and `apps/web/.env.example`.
- Foundry `broadcast/` artifacts in the repo are historical examples only; treat them as templates, not canonical deployments.

## License

AGPL-3.0 (see repository `LICENSE`). Protocol contracts inherit sudoswap licensing; check individual file headers.