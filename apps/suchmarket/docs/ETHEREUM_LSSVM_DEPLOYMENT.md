# Ethereum mainnet LSSVM — sudoswap canonical vs self-deploy

such.market needs Ethereum (chain id `1`) factory, router, and curve addresses before mainnet beta. This spike does **not** deploy anything; it documents the tradeoff.

## Option A: Use sudoswap canonical deployment (recommended for day one)

| Contract | Address |
| --- | --- |
| LSSVMPairFactory | `0xA020d57aB0448Ef74115c112D18a9C231CC86000` |
| VeryFastRouter | `0x090C236B62317db226e6ae6CD4c0Fd25b7028b65` |
| LinearCurve | `0xe5d78fec1a7f42d2F3620238C498F088A866FdC5` |
| ExponentialCurve | `0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a` |
| XYKCurve | `0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5` |
| GDACurve | `0x1fD5876d4A3860Eb0159055a3b7Cb79fdFFf6B67` |
| RoyaltyEngine | `0xBc40d21999b4BF120d330Ee3a2DE415287f626C9` |

**Pros**

- Live liquidity and pools already indexed by the ecosystem.
- No deployment cost or ongoing factory admin work for curves/router whitelist.
- Addresses already documented in [README.md](../../../README.md) and `@mxjxn/lssvm-abis`.

**Cons / protocol fees**

- **Protocol fees** on swaps go to the address configured on the canonical factory (`protocolFeeRecipient`). That recipient is controlled by the sudoswap/LSSVM protocol operators, not mxjxn. such.market does not earn protocol fees when routing through this deployment unless separately negotiated.
- Product changes (custom router features, SettingsFactory wiring) must use contracts the canonical factory already whitelists.

**Who receives fees on a trade**

| Fee type | Typical recipient (canonical) |
| --- | --- |
| Pool / LP fee (per-pair `fee`) | Pool `assetRecipient` or pool balance per pair type |
| Protocol fee | Factory `protocolFeeRecipient` (sudoswap-controlled) |
| Royalties | Creators via `RoyaltyEngine` lookups |

## Option B: Deploy mxjxn factory + router on Ethereum (Base-style)

Follow `packages/lssvm-contracts/DEPLOY_BASE.md` adapted for Ethereum: deploy `LSSVMPairFactory`, `VeryFastRouter`, `RoyaltyEngine`, reuse **stateless** sudoswap curve contracts on mainnet (same curve addresses as Option A), whitelist curves + router as factory owner.

**Pros**

- **Protocol fees** accrue to the recipient Max sets in `setProtocolFeeRecipient` (typically a mxjxn/Such treasury or splitter).
- Full control over router whitelist, optional Settings / property-checker factories, and future upgrades on your factory only.

**Cons**

- Empty pool set at launch; all liquidity is net-new.
- Deployment gas, multisig admin, and security review burden.
- such.market must point `apps/suchmarket` config and `@mxjxn/lssvm-abis` at the new addresses (today Ethereum entries are placeholders pending this decision).

**Who receives fees on a trade**

| Fee type | Typical recipient (self-deploy) |
| --- | --- |
| Pool / LP fee | Pool creator / `assetRecipient` |
| Protocol fee | Address Max sets on the mxjxn factory |
| Royalties | Same shared `RoyaltyEngine` or a deployed fork |

## Recommendation for such.market

1. **Sepolia / Base beta:** Continue using the documented mxjxn Base Sepolia deployment (verified in spike — see PR #4).
2. **Ethereum mainnet v1:** Start with **Option A** for discoverability and zero deploy risk; flip to **Option B** only if protocol fee capture or custom factory modules are required for launch.

## Max action items (no agent deployment)

- Choose Option A or B for Ethereum mainnet.
- If A: confirm `protocolFeeRecipient` on canonical factory is acceptable; add Ethereum addresses to Vercel env + `@mxjxn/lssvm-abis` / `chain-config` when enabling chain `1`.
- If B: fund deploy wallet, run audited deploy script, set protocol fee recipient, publish addresses in `packages/lssvm-contracts` deployment summary.