'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector'
import { CartProvider } from '@/contexts/CartContext'
import { CONFIG } from '@/lib/config'

const queryClient = new QueryClient()

// Create wagmi config with Farcaster miniapp connector
// Supporting Base Mainnet and Base Sepolia
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(CONFIG.BASE_RPC_URL),
    [baseSepolia.id]: http(CONFIG.BASE_SEPOLIA_RPC_URL),
  },
  connectors: [
    farcasterFrame(),
  ],
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize Farcaster miniapp SDK
    const initSDK = async () => {
      try {
        // Dynamically import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        await sdk.actions.ready()
        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize SDK:', error)
        setIsReady(true) // Continue anyway for development
      }
    }
    
    // Only initialize in browser
    if (typeof window !== 'undefined') {
      initSDK()
    } else {
      setIsReady(true)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

