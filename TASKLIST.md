# LSSVM Integration & Maintenance Tasklist

This document tracks tasks for integrating LSSVM with the cryptoart-studio monorepo and maintaining the codebase.

## 🔴 High Priority

### Environment Variables & Configuration

- [ ] **Update hardcoded contract addresses in `apps/miniapp/lib/config.ts`**
  - Current Base Mainnet (8453) addresses are incorrect:
    - Current ROUTER: `0xa07ebd56b361fe79af706a2bf6d8097091225548` ❌
    - Current FACTORY: `0x605145D263482684590f630E9e581B21E4938eb8` ❌
  - Should be:
    - ROUTER: `0x4352c72114C4b9c4e1F8C96347F2165EECaDeb5C` ✅
    - FACTORY: `0xF6B4bDF778db19DD5928248DE4C18Ce22E8a5f5e` ✅
  - Base Sepolia (84532) addresses appear correct
  - **Note**: This must be done manually as env vars are not accessible to AI tools

- [ ] **Verify and update `.env.local` files**
  - Check `apps/miniapp/.env.local` has correct addresses
  - Verify `packages/lssvm-contracts/.env.local` for deployment scripts
  - Document correct addresses in `apps/miniapp/ENV_VARS.md`

## 🟡 Cross-Repo Integration Tasks

### Phase 1: Create Shared ABI Package

- [ ] **Create `packages/lssvm-abis/` package**
  - [ ] Create `package.json` with proper exports
  - [ ] Extract ABIs from `apps/miniapp/lib/contracts.ts`:
    - `LSSVM_PAIR_ABI`
    - `LSSVM_FACTORY_ABI`
    - `LSSVM_ROUTER_ABI`
    - `ERC721_ABI`
    - `ERC1155_ABI`
    - `ERC20_ABI`
  - [ ] Export contract addresses/configuration helpers
  - [ ] Export TypeScript types (PoolType, CurveError, etc.)
  - [ ] Add TypeScript build configuration
  - [ ] Update `pnpm-workspace.yaml` to include new package

- [ ] **Create `packages/lssvm-abis/src/index.ts`**
  - Export all ABIs
  - Export address helpers (`getFactoryAddress`, `getRouterAddress`)
  - Export types and enums

- [ ] **Create `packages/lssvm-abis/src/abis.ts`**
  - Centralize all ABI definitions
  - Re-export from contracts or define directly

- [ ] **Create `packages/lssvm-abis/src/addresses.ts`**
  - Export contract addresses by chain ID
  - Include Base Mainnet and Base Sepolia addresses

- [ ] **Create `packages/lssvm-abis/src/types.ts`**
  - Export TypeScript types and enums
  - PoolType enum
  - CurveError enum
  - Address type helpers

- [ ] **Build and test the package**
  - [ ] Run `pnpm build` to ensure TypeScript compiles
  - [ ] Test imports in miniapp to ensure backward compatibility

### Phase 2: Set Up Cross-Repo Dependencies

- [ ] **Add workspace dependency in `cryptoart-monorepo`**
  - [ ] Update `cryptoart-monorepo/package.json`:
    ```json
    {
      "dependencies": {
        "@lssvm/abis": "workspace:git+https://github.com/mxjxn/such-lssvm.git#main:packages/lssvm-abis"
      }
    }
    ```
  - [ ] Run `pnpm install` in cryptoart-monorepo
  - [ ] Verify package resolves correctly

- [ ] **Create `packages/contracts-abis/` in cryptoart-monorepo** (if needed)
  - [ ] Extract Auctionhouse ABIs
  - [ ] Extract Creator Core ABIs
  - [ ] Export as package for potential reverse dependency

### Phase 3: Create Unified Indexer Package

- [ ] **Create `packages/unified-indexer/` in cryptoart-monorepo**
  - [ ] Create package structure
  - [ ] Install dependencies (`@lssvm/abis`, GraphQL clients)
  - [ ] Create unified query functions:
    - `getSalesOptions(nftContract, chainId)` - Returns pools + auctions
    - `getPoolData(poolAddress)` - LSSVM pool data
    - `getAuctionData(listingId)` - Auctionhouse listing data
  - [ ] Create GraphQL query helpers for both subgraphs
  - [ ] Add TypeScript types for unified data structures

- [ ] **Create `packages/unified-indexer/src/index.ts`**
  - Export unified query functions
  - Export types (PoolData, AuctionData, SalesOptions)

- [ ] **Create `packages/unified-indexer/src/lssvm-queries.ts`**
  - GraphQL queries for LSSVM subgraph
  - Query pools by NFT contract
  - Query pool details

- [ ] **Create `packages/unified-indexer/src/auctionhouse-queries.ts`**
  - GraphQL queries for Auctionhouse subgraph
  - Query listings by NFT contract
  - Query listing details

### Phase 4: UI Integration

- [ ] **Update collection creation flow in cryptoart-studio-app**
  - [ ] Add sales method selector component:
    - Options: "Sell via Pool" (LSSVM), "Sell via Auction" (Auctionhouse), "Both"
  - [ ] Create `SalesMethodSelector.tsx` component
  - [ ] Integrate into collection creation form

- [ ] **Create pool creation flow**
  - [ ] Add "Create Pool" button/action when sales method includes "pool"
  - [ ] Use LSSVM ABIs from `@lssvm/abis` package
  - [ ] Integrate pool creation transaction flow

- [ ] **Create auction listing flow**
  - [ ] Add "Create Listing" button/action when sales method includes "auction"
  - [ ] Use Auctionhouse ABIs
  - [ ] Integrate listing creation transaction flow

- [ ] **Create unified sales view**
  - [ ] Display both pools and auctions for a collection
  - [ ] Use `@cryptoart/unified-indexer` to fetch data
  - [ ] Show clear distinction between pool and auction sales

- [ ] **Add API routes for sales data**
  - [ ] Create `apps/cryptoart-studio-app/src/app/api/collections/[address]/sales/route.ts`
  - [ ] Query unified indexer for pool + auction data
  - [ ] Return JSON response with both sales methods

### Phase 5: Subgraph/Indexer Integration

- [ ] **Verify subgraph deployments**
  - [ ] Confirm LSSVM subgraph is deployed and accessible
  - [ ] Confirm Auctionhouse subgraph is deployed and accessible
  - [ ] Document subgraph endpoints in both repos

- [ ] **Update subgraph queries**
  - [ ] Ensure both subgraphs support querying by NFT contract address
  - [ ] Verify query performance for collection-level queries
  - [ ] Add any missing fields needed for unified display

- [ ] **Create unified GraphQL schema** (optional)
  - [ ] Consider creating a GraphQL gateway that combines both subgraphs
  - [ ] Or create REST API endpoints that query both subgraphs

## 🟢 Documentation & Maintenance

- [ ] **Update README.md**
  - [ ] Document cross-repo integration approach
  - [ ] Add instructions for using `@lssvm/abis` package
  - [ ] Document unified indexer usage

- [ ] **Create integration guide**
  - [ ] Document how to add LSSVM pool creation to cryptoart-studio
  - [ ] Document how to query both sales methods
  - [ ] Add code examples

- [ ] **Update deployment documentation**
  - [ ] Ensure contract addresses are documented correctly
  - [ ] Add notes about env var requirements
  - [ ] Document subgraph endpoints

## 📝 Notes

- **Env Vars**: Environment variables must be updated manually as they are not accessible to AI tools
- **Contract Addresses**: Always verify addresses against deployment summaries:
  - Base Mainnet: `packages/lssvm-contracts/BASE_DEPLOYMENT_SUMMARY.md`
  - Base Sepolia: `packages/lssvm-contracts/BASE_TESTNET_DEPLOYMENT_SUMMARY.md`
- **Subgraph Endpoints**: Current endpoints in `apps/miniapp/lib/config.ts`:
  - Base Mainnet: `https://api.studio.thegraph.com/query/5440/such-lssvm/0.0.1`
  - Base Sepolia: `https://api.studio.thegraph.com/query/5440/such-lssvm-sepolia/0.0.1`

## 🔗 Related Repositories

- **cryptoart-studio**: `github.com/mxjxn/cryptoart-studio`
- **such-lssvm**: `github.com/mxjxn/such-lssvm` (this repo)

---

**Last Updated**: 2025-01-XX
**Status**: Planning phase - awaiting approval to begin implementation

