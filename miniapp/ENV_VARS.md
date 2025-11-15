# Required Environment Variables

All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## RPC Configuration

- `NEXT_PUBLIC_BASE_RPC_URL` - RPC endpoint URL for Base Mainnet (required to avoid rate limits)
  - Example: `https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
  - Defaults to public endpoint if not set (may hit rate limits)

## IPFS Configuration

- `NEXT_PUBLIC_IPFS_URL` - IPFS gateway URL for resolving IPFS metadata and images
  - Example: `https://sapphire-dear-marsupial-522.mypinata.cloud` (Pinata gateway)
  - Defaults to `https://ipfs.io` if not set
  - Used for fetching NFT metadata stored on IPFS

## Base Mainnet (Chain ID: 8453)

- `NEXT_PUBLIC_ROUTER_ADDRESS_8453` - Address of the LSSVMRouter contract on Base Mainnet
- `NEXT_PUBLIC_FACTORY_ADDRESS_8453` - Address of the LSSVMPairFactory contract on Base Mainnet

## Example `.env.local` file

```bash
# RPC Configuration (required to avoid rate limits)
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# IPFS Configuration
NEXT_PUBLIC_IPFS_URL=https://sapphire-dear-marsupial-522.mypinata.cloud

# Base Mainnet (chainId: 8453)
NEXT_PUBLIC_ROUTER_ADDRESS_8453=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_FACTORY_ADDRESS_8453=0x0000000000000000000000000000000000000000
```

## Notes

- Replace the placeholder addresses (`0x0000...`) with your actual deployed contract addresses
- All addresses must be valid Ethereum addresses (42 characters, starting with `0x`)
- The router address is used for executing buy/sell transactions
- The factory address is available via `getFactoryAddress()` but may not be currently used in the UI
