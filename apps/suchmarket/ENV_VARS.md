# such.market environment variables

```bash
# Recommended — dedicated RPC (public endpoints rate-limit log scans)
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Optional overrides (defaults come from @mxjxn/lssvm-abis)
NEXT_PUBLIC_ROUTER_ADDRESS_8453=0x4352c72114C4b9c4e1F8C96347F2165EECaDeb5C
NEXT_PUBLIC_FACTORY_ADDRESS_8453=0xF6B4bDF778db19DD5928248DE4C18Ce22E8a5f5e
NEXT_PUBLIC_ROUTER_ADDRESS_84532=0x6C9e6BAc4255901EaD3447C07917967E9dBc32d3
NEXT_PUBLIC_FACTORY_ADDRESS_84532=0x372990Fd91CF61967325dD5270f50c4192bfb892

NEXT_PUBLIC_IPFS_URL=https://ipfs.io
```

No private keys. Max deploys contracts locally.
