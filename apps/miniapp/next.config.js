/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly expose environment variables
  env: {
    NEXT_PUBLIC_ROUTER_ADDRESS_8453: process.env.NEXT_PUBLIC_ROUTER_ADDRESS_8453,
    NEXT_PUBLIC_FACTORY_ADDRESS_8453: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_8453,
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  },
}

module.exports = nextConfig

