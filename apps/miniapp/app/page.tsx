'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAddress } from 'viem'
import { base } from 'viem/chains'

export default function Home() {
  const [poolAddress, setPoolAddress] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const chainId = base.id.toString() // Only Base mainnet for now
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAddress(poolAddress)) {
      setIsNavigating(true)
      router.push(`/pool/${chainId}/${poolAddress}`)
    } else {
      alert('Invalid address')
    }
  }

  const handleTestPool = () => {
    setIsNavigating(true)
    router.push(`/pool/${chainId}/0x771751dc41315b70d0c9f3d65823028d68cc9ace`)
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">NFT Liquidity Pools</h1>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Currently only Base Mainnet ({base.id}) is supported. Base Sepolia support will be added after test contract deployment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="p-3 border rounded-lg bg-gray-50 text-gray-600 whitespace-nowrap">
              Base ({base.id})
            </div>
            <input
              type="text"
              value={poolAddress}
              onChange={(e) => setPoolAddress(e.target.value)}
              placeholder="Enter pool address (0x...)"
              className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={isNavigating}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isNavigating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Loading...</span>
                </>
              ) : (
                'View Pool'
              )}
            </button>
          </div>
        </form>

        <div className="mb-4">
          <button
            onClick={handleTestPool}
            disabled={isNavigating}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isNavigating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </>
            ) : (
              'Test with Sample Pool'
            )}
          </button>
        </div>

        <div className="text-gray-500">
          <p className="mb-2">Enter a pool address to view pool details and trade NFTs.</p>
          <p className="text-sm">Pool addresses can be found from your liquidity pool factory or indexer.</p>
        </div>
      </div>
    </main>
  )
}

