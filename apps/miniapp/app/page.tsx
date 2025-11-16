'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChainId } from 'wagmi'
import { isAddress, Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const currentChainId = useChainId()
  const [selectedChainId, setSelectedChainId] = useState<number>(currentChainId || base.id)
  const [poolAddress, setPoolAddress] = useState('')
  const [nftContractAddress, setNftContractAddress] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  const handleViewPool = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAddress(poolAddress)) {
      setIsNavigating(true)
      router.push(`/pool/${selectedChainId}/${poolAddress}`)
    } else {
      alert('Invalid pool address')
    }
  }

  const handleBrowseNFTs = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAddress(nftContractAddress)) {
      setIsNavigating(true)
      router.push(`/browse/${nftContractAddress}?chainId=${selectedChainId}`)
    } else {
      alert('Invalid NFT contract address')
    }
  }

  const getChainName = (chainId: number) => {
    return chainId === base.id ? 'Base Mainnet' : chainId === baseSepolia.id ? 'Base Sepolia' : `Chain ${chainId}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NFT Liquidity Pools
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create pools, browse NFTs, and trade with automated market makers on Base
          </p>

          {/* Chain Selector */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedChainId(base.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedChainId === base.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Base Mainnet
            </button>
            <button
              onClick={() => setSelectedChainId(baseSepolia.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedChainId === baseSepolia.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Base Sepolia
            </button>
          </div>

          {/* Primary CTA */}
          <Link
            href={`/create/${selectedChainId}`}
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start a Pool
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Browse NFTs Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Browse NFTs</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View all NFTs from all pools for a contract, sorted by price
            </p>
            <form onSubmit={handleBrowseNFTs} className="space-y-3">
              <input
                type="text"
                value={nftContractAddress}
                onChange={(e) => setNftContractAddress(e.target.value)}
                placeholder="Enter NFT contract address (0x...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <button
                type="submit"
                disabled={isNavigating || !isAddress(nftContractAddress)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Browse NFTs
              </button>
            </form>
          </div>

          {/* View Pool Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">View Pool</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Enter a pool address to view details and trade NFTs
            </p>
            <form onSubmit={handleViewPool} className="space-y-3">
              <input
                type="text"
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
                placeholder="Enter pool address (0x...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={isNavigating || !isAddress(poolAddress)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                View Pool
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href={`/create/${selectedChainId}`}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Create Pool</div>
                <div className="text-sm text-gray-500">Start a new liquidity pool</div>
              </div>
            </Link>

            {selectedChainId === baseSepolia.id && (
              <>
                <Link
                  href={`/create/${selectedChainId}?nftContract=0xF130207fbE0913b5470732D25699E41F5Ea4da7f&nftType=ERC721&initialNFTIds=1&spotPrice=0.002&delta=0.01&fee=100&bondingCurve=LINEAR`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Create Test ERC721 Pool</div>
                    <div className="text-sm text-gray-500">Quick test pool with ERC721</div>
                  </div>
                </Link>

                <Link
                  href={`/create/${selectedChainId}?nftContract=0x68f397655a5a1478e24Bdb52D0Df33e50AB6Ce28&nftType=ERC1155&nftId=0&spotPrice=0.002&delta=0.01&fee=100&bondingCurve=LINEAR`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Create Test ERC1155 Pool</div>
                    <div className="text-sm text-gray-500">Quick test pool with ERC1155</div>
                  </div>
                </Link>
              </>
            )}

            {selectedChainId === baseSepolia.id && (
              <Link
                href="/browse/0xF130207fbE0913b5470732D25699E41F5Ea4da7f?chainId=84532"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Test ERC721</div>
                  <div className="text-sm text-gray-500">Browse test NFT collection</div>
                </div>
              </Link>
            )}

            {selectedChainId === baseSepolia.id && (
              <Link
                href="/browse/0x68f397655a5a1478e24Bdb52D0Df33e50AB6Ce28?chainId=84532"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Test ERC1155</div>
                  <div className="text-sm text-gray-500">Browse test ERC1155 collection</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Currently connected to: <span className="font-medium text-gray-700">{getChainName(selectedChainId)}</span></p>
          <p className="mt-1">Chain ID: {selectedChainId}</p>
        </div>
      </div>
    </main>
  )
}
