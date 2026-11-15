# Environment variables (`apps/web`)

Copy `.env.example` to `.env.local` (not committed). All contract addresses are opt-in per chain.

## Required for on-chain features

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FACTORY_ADDRESS_<chainId>` | `LSSVMPairFactory` for that network |
| `NEXT_PUBLIC_ROUTER_ADDRESS_<chainId>` | `VeryFastRouter` (or compatible router) |
| `NEXT_PUBLIC_CURVE_LINEAR_<chainId>` | Linear bonding curve |
| `NEXT_PUBLIC_CURVE_EXPONENTIAL_<chainId>` | Exponential curve (optional) |
| `NEXT_PUBLIC_CURVE_XYK_<chainId>` | XYK curve (optional) |
| `NEXT_PUBLIC_CURVE_GDA_<chainId>` | GDA curve (optional) |

## RPC

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_BASE_RPC_URL` | `https://mainnet.base.org` |
| `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` | `https://sepolia.base.org` |
| `NEXT_PUBLIC_ETHEREUM_RPC_URL` | public node |

## Optional indexer

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `INDEXER_FACTORY_START_BLOCK_<chainId>` | First block to scan for `NewERC721Pair` / `NewERC1155Pair` |
| `INDEXER_MAX_BLOCKS_PER_RUN` | Default `250000` |
| `INDEXER_LOG_CHUNK` | Default `50000` |
| `CRON_SECRET` | Protects `/api/cron/sync-indexer` |

## Verification

```bash
NEXT_PUBLIC_FACTORY_ADDRESS_84532=0x... \
NEXT_PUBLIC_ROUTER_ADDRESS_84532=0x... \
pnpm --filter @lssvm/web exec tsx apps/web/scripts/verify-lssvm-deployments.ts 84532
```