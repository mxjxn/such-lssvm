'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { CartProvider } from '@/contexts/CartContext'
import { CONFIG } from '@/lib/config'
import { ChainProvider } from '@/contexts/ChainContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      retry: 1,
    },
  },
})

export const config = createConfig({
  chains: [base, baseSepolia, mainnet],
  transports: {
    [base.id]: http(CONFIG.BASE_RPC_URL),
    [baseSepolia.id]: http(CONFIG.BASE_SEPOLIA_RPC_URL),
    [mainnet.id]: http(CONFIG.ETHEREUM_RPC_URL),
  },
  connectors: [injected({ shimDisconnect: true })],
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChainProvider>
          <CartProvider>{children}</CartProvider>
        </ChainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}