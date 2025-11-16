# LSSVM Subgraph

Graph Protocol subgraph for indexing LSSVM (Liquidity-Sensitive Single-Variant Market) pools on Base.

## Contracts Indexed

### Primary Contract: LSSVMPairFactory
- **Address**: `0xF6B4bDF778db19DD5928248DE4C18Ce22E8a5f5e`
- **Network**: Base Mainnet
- **Start Block**: 38239761

### Events Indexed

#### Factory Events:
- `NewERC721Pair` - When a new ERC721 pool is created
- `NewERC1155Pair` - When a new ERC1155 pool is created
- `ERC20Deposit` - ERC20 token deposits into pools
- `NFTDeposit` - NFT deposits into pools
- `ERC1155Deposit` - ERC1155 token deposits into pools

#### Pair Events (dynamically indexed):
- `SwapNFTInPair` - NFTs swapped into pool (buy)
- `SwapNFTOutPair` - NFTs swapped out of pool (sell)
- `SpotPriceUpdate` - Spot price changes
- `TokenDeposit` / `TokenWithdrawal` - Token liquidity changes
- `NFTWithdrawal` - NFT withdrawals
- `DeltaUpdate` - Bonding curve delta changes
- `FeeUpdate` - Fee changes
- `AssetRecipientChange` - Asset recipient changes

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate TypeScript types:
```bash
npm run codegen
```

3. Build the subgraph:
```bash
npm run build
```

## Deployment

### Deploy to The Graph Studio (Hosted Service)

1. Create a subgraph on [The Graph Studio](https://thegraph.com/studio/)
2. Get your deployment key
3. Deploy:
```bash
npm run deploy
```

### Deploy Locally

1. Start a local Graph node (see [Graph Node docs](https://github.com/graphprotocol/graph-node))
2. Create the subgraph:
```bash
npm run create-local
```
3. Deploy:
```bash
npm run deploy-local
```

## Schema

The subgraph indexes:
- **Pool** entities - All pool configurations and current state
- **Swap** entities - All buy/sell transactions
- **Deposit** entities - All deposits (NFTs, tokens, ERC1155)
- **Withdrawal** entities - All withdrawals

## Query Examples

```graphql
# Get all pools for a specific NFT contract
{
  pools(where: { nftContract: "0x..." }) {
    id
    spotPrice
    poolType
    currentNFTBalance
    currentTokenBalance
  }
}

# Get all swaps for a pool
{
  swaps(where: { pool: "0x..." }, orderBy: timestamp, orderDirection: desc) {
    id
    type
    tokenAmount
    nftIds
    timestamp
  }
}
```

## Development

- `npm run codegen` - Generate types from schema and ABIs
- `npm run build` - Build the subgraph
- `npm run deploy` - Deploy to The Graph Studio
- `npm test` - Run tests (if configured)

