# NFT Liquidity Pool Miniapp

A Farcaster miniapp for interacting with NFT liquidity pools built on the LSSVM protocol.

## Features

- **Pool Discovery**: Enter pool addresses to view pool details
- **Buy NFTs**: Purchase NFTs from liquidity pools using ETH or ERC20 tokens
- **Sell NFTs**: Sell your NFTs to liquidity pools in exchange for tokens
- **Real-time Quotes**: Get up-to-date pricing information before trading
- **Transaction Tracking**: Monitor transaction status with explorer links

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your contract addresses:
```
# Base Sepolia (chainId: 84532)
NEXT_PUBLIC_ROUTER_ADDRESS_84532=0x...
NEXT_PUBLIC_FACTORY_ADDRESS_84532=0x...

# Base Mainnet (chainId: 8453)
NEXT_PUBLIC_ROUTER_ADDRESS_8453=0x...
NEXT_PUBLIC_FACTORY_ADDRESS_8453=0x...
```

3. Update `public/.well-known/farcaster.json` with your domain and sign it using the [Farcaster Manifest Tool](https://warpcast.com/~/developers/manifest)

4. Run the development server:
```bash
npm run dev
```

## Project Structure

- `app/` - Next.js app router pages
  - `page.tsx` - Home page with pool address input
  - `pool/[address]/page.tsx` - Pool detail page
  - `buy/[poolAddress]/page.tsx` - Buy NFTs interface
  - `sell/[poolAddress]/page.tsx` - Sell NFTs interface
- `components/` - React components
  - `PoolCard.tsx` - Pool summary card
  - `PoolDetails.tsx` - Detailed pool information display
  - `NFTSelector.tsx` - NFT selection component
  - `PriceQuote.tsx` - Price breakdown display
  - `TransactionStatus.tsx` - Transaction status indicator
- `hooks/` - React hooks for data fetching
  - `usePoolData.ts` - Fetch pool information
  - `useBuyQuote.ts` - Get buy price quotes
  - `useSellQuote.ts` - Get sell price quotes
  - `useUserNFTs.ts` - Fetch user's NFTs
  - `useTokenData.ts` - Fetch token information
- `lib/` - Utility functions and contract ABIs
  - `contracts.ts` - Contract ABIs and types
  - `pool.ts` - Pool data fetching utilities
  - `wagmi.ts` - Wagmi configuration

## Contract Integration

The miniapp integrates with:
- `LSSVMRouter` - Main router contract for executing swaps
- `ILSSVMPair` - Pair contract interface for pool data
- ERC721/ERC1155 - NFT standards
- ERC20 - Token standard

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or your preferred hosting platform

3. Update the `farcaster.json` manifest with your production domain

4. Sign the manifest using your Farcaster custody address

## Notes

- The app currently supports manual pool address entry. For production, consider integrating with an indexer or subgraph for pool discovery.
- NFT metadata fetching (images, names) is not implemented. Consider integrating with IPFS or a metadata service.
- User NFT fetching uses `tokenOfOwnerByIndex` which may not be supported by all ERC721 contracts. Consider using an indexer for production.

