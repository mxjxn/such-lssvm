'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { base, baseSepolia } from 'wagmi/chains'
import { CreatePoolForm, CreatePoolFormData } from '@/components/CreatePoolForm'
import { useCreatePool } from '@/hooks/useCreatePool'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Address, isAddress } from 'viem'

function getChainFromId(chainId: string | string[]) {
  const id = typeof chainId === 'string' ? parseInt(chainId) : parseInt(chainId[0])
  if (isNaN(id)) {
    throw new Error(`Invalid chain ID: ${chainId}`)
  }
  if (id !== base.id && id !== baseSepolia.id) {
    throw new Error(`Unsupported chain: ${id}. Only Base Mainnet (${base.id}) and Base Sepolia (${baseSepolia.id}) are supported.`)
  }
  return id === base.id ? base : baseSepolia
}

export default function CreatePoolPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const chainIdParam = params.chainId
  const chainId = Array.isArray(chainIdParam) ? parseInt(chainIdParam[0]) : parseInt(chainIdParam)

  const [chain, setChain] = useState<typeof base | typeof baseSepolia | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialFormData, setInitialFormData] = useState<Partial<CreatePoolFormData> | null>(null)

  useEffect(() => {
    try {
      const validChain = getChainFromId(chainIdParam)
      setChain(validChain)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid chain ID')
    }
  }, [chainIdParam])

  // Parse URL query parameters for pre-filling form
  useEffect(() => {
    const nftContract = searchParams.get('nftContract')
    const nftType = searchParams.get('nftType') as 'ERC721' | 'ERC1155' | null
    const nftId = searchParams.get('nftId')
    const initialNFTIds = searchParams.get('initialNFTIds')
    const spotPrice = searchParams.get('spotPrice')
    const delta = searchParams.get('delta')
    const fee = searchParams.get('fee')
    const bondingCurve = searchParams.get('bondingCurve') as 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA' | null

    if (nftContract && isAddress(nftContract)) {
      const initialData: Partial<CreatePoolFormData> = {
        nftContract: nftContract as Address,
        nftType: nftType || 'ERC721',
        paymentToken: 'ETH',
        bondingCurve: bondingCurve || 'LINEAR',
        spotPrice: spotPrice || '0.002',
        delta: delta || '0.01',
        fee: fee || '100',
        initialTokenBalance: '0',
      }

      if (nftType === 'ERC1155') {
        initialData.nftId = nftId || '0'
        initialData.initialNFTBalance = '1'
      } else {
        initialData.initialNFTIds = initialNFTIds || '1'
      }

      setInitialFormData(initialData)
    }
  }, [searchParams])

  const { createPool, poolAddress, txHash, error: createError, isPending, isSuccess } = useCreatePool(chainId)

  // Redirect to pool page when pool is created
  useEffect(() => {
    if (isSuccess && poolAddress) {
      // Wait a moment for subgraph to index, then redirect
      const timer = setTimeout(() => {
        router.push(`/pool/${chainId}/${poolAddress}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, poolAddress, chainId, router])

  const handleSubmit = async (formData: CreatePoolFormData) => {
    try {
      await createPool(formData)
    } catch (err) {
      console.error('Error creating pool:', err)
      setError(err instanceof Error ? err.message : 'Failed to create pool')
    }
  }

  if (error) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Go back home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!chain) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Pool</h1>
          <p className="text-sm text-gray-600">
            Create a new TRADE pool for {chain.name} (Chain ID: {chain.id})
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {isSuccess && poolAddress ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pool Created Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Pool address: <span className="font-mono text-sm">{poolAddress}</span>
              </p>
              {txHash && (
                <p className="text-sm text-gray-500 mb-4">
                  Transaction: <span className="font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                </p>
              )}
              <p className="text-sm text-gray-500 mb-6">Redirecting to pool page...</p>
              <Link
                href={`/pool/${chainId}/${poolAddress}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Pool
              </Link>
            </div>
          ) : (
            <>
              {txHash && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600">
                    <strong>Transaction submitted:</strong> {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Waiting for confirmation...</p>
                </div>
              )}
              <CreatePoolForm
                chainId={chainId}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                error={createError}
                initialData={initialFormData}
              />
            </>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>You must approve the factory to transfer your NFTs before creating a pool</li>
            <li>For ERC20 pools, you must approve the factory to spend your tokens</li>
            <li>TRADE pools allow anyone to buy and sell NFTs</li>
            <li>Initial NFTs/tokens will be deposited into the pool immediately</li>
            <li>Make sure you have enough balance for the initial deposit</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

