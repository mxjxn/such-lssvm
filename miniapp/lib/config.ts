/**
 * Application configuration
 * These values are embedded at build time from environment variables
 * 
 * IMPORTANT: Restart the dev server after changing .env.local for these to take effect
 */

// Hardcoded fallback addresses for Base Mainnet (8453)
// These will be overridden by environment variables if set
const HARDCODED_ADDRESSES = {
  8453: {
    ROUTER: '0xa07ebd56b361fe79af706a2bf6d8097091225548',
    FACTORY: '0x605145D263482684590f630E9e581B21E4938eb8',
  },
}

export const CONFIG = {
  ROUTER_ADDRESS_8453: process.env.NEXT_PUBLIC_ROUTER_ADDRESS_8453 || HARDCODED_ADDRESSES[8453].ROUTER,
  FACTORY_ADDRESS_8453: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_8453 || HARDCODED_ADDRESSES[8453].FACTORY,
  BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  IPFS_URL: process.env.NEXT_PUBLIC_IPFS_URL || 'https://ipfs.io',
} as const

// Validate required addresses
if (typeof window !== 'undefined') {
  console.log('=== Config Debug ===')
  console.log('ROUTER_ADDRESS_8453 from env:', process.env.NEXT_PUBLIC_ROUTER_ADDRESS_8453)
  console.log('ROUTER_ADDRESS_8453 final:', CONFIG.ROUTER_ADDRESS_8453)
  console.log('FACTORY_ADDRESS_8453 from env:', process.env.NEXT_PUBLIC_FACTORY_ADDRESS_8453)
  console.log('FACTORY_ADDRESS_8453 final:', CONFIG.FACTORY_ADDRESS_8453)
  console.log('BASE_RPC_URL:', CONFIG.BASE_RPC_URL)
  console.log('All NEXT_PUBLIC_ vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')))
  console.log('===================')
}

