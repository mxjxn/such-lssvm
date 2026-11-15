# such.market roadmap

Marketplace-only surface (pools + auctions). Artist/studio flows stay in cryptoart.studio.

## Done (this branch / PR #4)

- [x] **Pools UI** — browse, pool detail, buy/sell via VeryFastRouter (721 any-N + specific IDs).
- [x] **Multi-chain config** — Base (`8453`), Base Sepolia (`84532`), Ethereum (`1` placeholders).
- [x] **Address alignment** — `apps/suchmarket` + `@mxjxn/lssvm-abis` match Base mainnet (`0xF6B4…` / `0x4352…`) and Base Sepolia deployment docs; RPC verification script `apps/suchmarket/scripts/verify-lssvm-deployments.ts`.
- [x] **Indexer** — Postgres schema + cron sync + CLI (`apps/suchmarket/indexer/`).
- [x] **Auctions** — marketplace listings API + `/auctions` UI (RPC fallback without DB).
- [x] **LSSVM spike (Base Sepolia)** — Foundry fork tests `packages/lssvm-contracts/test/SuchmarketBaseSepoliaFork.t.sol` (linear + exponential ETH pools, 1155 ETH, 721/ERC20 quotes); vitest quote decomposition aligned to fork fixtures.

## Spike results (summary)

| Check | Result |
| --- | --- |
| Factory + router bytecode on Base Sepolia | OK |
| Four curves + router whitelisted | OK |
| Config vs deployment docs (`84532`, `8453`) | OK |
| Fork E2E swaps (create pool → router buy → sell) | **4/4 Foundry tests pass** |
| App quote math vs contract quote fields | Vitest fixtures from fork |

See PR #4 description for the latest CI run.

## Remaining — Sepolia beta

| Step | Owner |
| --- | --- |
| Hosted Postgres + `DATABASE_URL` on Vercel | **Max** |
| Vercel project for `apps/suchmarket`, preview URLs | **Max** |
| Cron secret / `CRON_SECRET` for indexer route | **Max** |
| Base Sepolia marketplace contract in env (if not using hardcoded dev defaults) | **Max** |
| SettingsFactory + property-checker pools in UI | Agent + **Max** (deploy checker addresses if needed) |
| Royalties UX for studio collections (2981 / engine hints) | Agent |
| Indexer hosting runbook (Neon/Railway/etc.) | **Max** |
| QA on live Sepolia pools + TestNFT contracts | Agent + Max |

## Remaining — mainnet

| Step | Owner |
| --- | --- |
| **Ethereum LSSVM strategy** — sudoswap canonical vs own factory ([ETHEREUM_LSSVM_DEPLOYMENT.md](./ETHEREUM_LSSVM_DEPLOYMENT.md)) | **Max** (decision) |
| Enable Ethereum addresses in `lssvm-abis` + such.market when chosen | Agent after decision |
| `such.market` DNS → Vercel | **Max** |
| Production env vars (`NEXT_PUBLIC_*`, RPC URLs, optional `DATABASE_URL`) | **Max** |
| cryptoart.social embeds / deep links to pools & auctions | Agent |
| ERC-20 pool trading polish (day two) | Agent |
| Protocol fee / treasury monitoring | **Max** |

## Operator notes

- **Do not** use legacy miniapp `.env.local` Base mainnet factory/router values; TASKLIST documents wrong addresses. such.market hardcoded `8453` values are correct.
- Never commit secrets; see `ENV_VARS.md`.

## References

- Base Sepolia: [BASE_TESTNET_DEPLOYMENT_SUMMARY.md](../../../packages/lssvm-contracts/BASE_TESTNET_DEPLOYMENT_SUMMARY.md)
- Base mainnet: [BASE_DEPLOYMENT_SUMMARY.md](../../../packages/lssvm-contracts/BASE_DEPLOYMENT_SUMMARY.md)
- Ethereum options: [ETHEREUM_LSSVM_DEPLOYMENT.md](./ETHEREUM_LSSVM_DEPLOYMENT.md)