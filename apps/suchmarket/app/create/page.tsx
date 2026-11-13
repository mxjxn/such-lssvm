'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreatePoolForm, CreatePoolFormData } from '@/components/CreatePoolForm'
import { useCreatePool } from '@/hooks/useCreatePool'
import { useAppChain } from '@/contexts/ChainContext'
import { LAUNCH_CURVE, getChainName } from '@/lib/chains'
import Link from 'next/link'

export default function CreatePoolPage() {
  const { chainId } = useAppChain()
  const router = useRouter()
  const { createPool, poolAddress, error, isPending, isSuccess } = useCreatePool(chainId)

  useEffect(() => {
    if (isSuccess && poolAddress) {
      const t = setTimeout(() => router.push(`/pool/${chainId}/${poolAddress}`), 1500)
      return () => clearTimeout(t)
    }
  }, [isSuccess, poolAddress, chainId, router])

  return (
    <div className="sm-container py-10 max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink">Create a pool</h1>
        <p className="mt-2 text-sm text-mute leading-relaxed">
          Open a buy, sell, or trade pool on {getChainName(chainId)}. Default curve:{' '}
          <strong>{LAUNCH_CURVE}</strong>. More curves and Ethereum can be enabled later.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/launch" className="text-forest hover:underline">
            Launching a collection?
          </Link>{' '}
          Use the guided artist flow.
        </p>
      </header>
      <div className="sm-card p-6">
        <CreatePoolForm
          chainId={chainId}
          onSubmit={(data: CreatePoolFormData) => createPool(data)}
          isSubmitting={isPending}
          error={error}
        />
        {isSuccess && poolAddress && (
          <p className="mt-4 text-sm text-forest">Pool created — opening detail…</p>
        )}
      </div>
    </div>
  )
}
