'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Address, isAddress } from 'viem'
import { useAppChain } from '@/contexts/ChainContext'
import { CreatePoolForm, CreatePoolFormData } from '@/components/CreatePoolForm'
import { useCreatePool } from '@/hooks/useCreatePool'
import { LAUNCH_CURVE, getChainName } from '@/lib/chains'
import { explainPoolForArtist } from '@/lib/quotes'
import Link from 'next/link'

/**
 * Artist launch flow — deep-linkable from cryptoart.studio:
 * /launch?nft=0x…&ids=1,2,3&spot=0.01&delta=0.001&fee=50&chainId=8453
 */
export default function LaunchPage() {
  const { chainId, setChainId } = useAppChain()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [nftContract, setNftContract] = useState('')
  const [ids, setIds] = useState('')
  const [spot, setSpot] = useState('0.01')
  const [delta, setDelta] = useState('0.001')
  const [fee, setFee] = useState('50')
  const { createPool, poolAddress, isPending, isSuccess, error } = useCreatePool(chainId)

  useEffect(() => {
    const nft = searchParams.get('nft') || searchParams.get('nftContract')
    const idList = searchParams.get('ids') || searchParams.get('initialNFTIds')
    const c = searchParams.get('chainId')
    if (nft) setNftContract(nft)
    if (idList) setIds(idList)
    if (searchParams.get('spot') || searchParams.get('spotPrice')) {
      setSpot(searchParams.get('spot') || searchParams.get('spotPrice') || '0.01')
    }
    if (searchParams.get('delta')) setDelta(searchParams.get('delta') || '0.001')
    if (searchParams.get('fee')) setFee(searchParams.get('fee') || '50')
    if (c === '8453' || c === '84532') setChainId(Number(c) as 8453 | 84532)
  }, [searchParams, setChainId])

  useEffect(() => {
    if (isSuccess && poolAddress) {
      router.push(`/pool/${chainId}/${poolAddress}`)
    }
  }, [isSuccess, poolAddress, chainId, router])

  const deepLink = useMemo(() => {
    const q = new URLSearchParams({
      nft: nftContract || '',
      ids,
      spot,
      delta,
      fee,
      chainId: String(chainId),
    })
    return `/launch?${q.toString()}`
  }, [nftContract, ids, spot, delta, fee, chainId])

  const onLaunch = async () => {
    if (!isAddress(nftContract)) {
      alert('Valid NFT contract required')
      return
    }
    const formData: CreatePoolFormData = {
      nftType: 'ERC721',
      paymentToken: 'ETH',
      nftContract: nftContract as Address,
      erc20Token: null,
      bondingCurve: LAUNCH_CURVE,
      spotPrice: spot,
      delta,
      fee,
      initialNFTIds: ids,
      nftId: '0',
      initialNFTBalance: '0',
      initialTokenBalance: '0',
    }
    await createPool(formData)
  }

  return (
    <div className="sm-container py-10 max-w-2xl">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.14em] text-soft mb-2">For artists</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink">Launch with a pool</h1>
        <p className="mt-3 text-mute text-sm leading-relaxed">{explainPoolForArtist(2)}</p>
      </header>

      <ol className="flex gap-2 mb-8 text-xs">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className={`rounded-full px-3 py-1 border ${
              step === n ? 'border-ink bg-ink text-white' : 'border-line text-mute'
            }`}
          >
            {n === 1 ? 'Collection' : n === 2 ? 'Curve' : 'Confirm'}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="sm-card p-6 space-y-4">
          <div>
            <label className="sm-label">NFT contract</label>
            <input
              className="sm-input font-mono text-xs"
              value={nftContract}
              onChange={(e) => setNftContract(e.target.value)}
              placeholder="0x…"
            />
          </div>
          <div>
            <label className="sm-label">Token IDs to deposit</label>
            <textarea
              className="sm-input font-mono text-xs min-h-[100px]"
              value={ids}
              onChange={(e) => setIds(e.target.value)}
              placeholder="1, 2, 3, …"
            />
            <p className="mt-1 text-[11px] text-soft">
              For large collections (e.g. 1,000 1/1s), deposit an initial batch here, then add more
              from My pools.
            </p>
          </div>
          <button
            type="button"
            className="sm-btn-primary"
            onClick={() => setStep(2)}
            disabled={!nftContract}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="sm-card p-6 space-y-4">
          <p className="text-sm text-mute">
            {getChainName(chainId)} · {LAUNCH_CURVE} · Trade pool
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="sm-label">Starting price (ETH)</label>
              <input className="sm-input" value={spot} onChange={(e) => setSpot(e.target.value)} />
            </div>
            <div>
              <label className="sm-label">Price step Δ</label>
              <input className="sm-input" value={delta} onChange={(e) => setDelta(e.target.value)} />
            </div>
            <div>
              <label className="sm-label">Fee (bps field)</label>
              <input className="sm-input" value={fee} onChange={(e) => setFee(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="sm-btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="sm-btn-primary" onClick={() => setStep(3)}>
              Review
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="sm-card p-6 space-y-4">
          <h2 className="font-display text-xl">Confirm launch</h2>
          <ul className="text-sm text-mute space-y-1">
            <li>Contract: {nftContract}</li>
            <li>IDs: {ids.split(/[,\s]+/).filter(Boolean).length} tokens</li>
            <li>
              Spot {spot} · Δ {delta} · fee {fee}
            </li>
          </ul>
          <p className="text-[11px] text-soft break-all">Studio deep-link: {deepLink}</p>
          {error && <p className="text-sm text-clay">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="sm-btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="button"
              className="sm-btn-primary"
              disabled={isPending}
              onClick={onLaunch}
            >
              {isPending ? 'Confirm in wallet…' : 'Create trade pool'}
            </button>
          </div>
          <details className="pt-4 border-t border-line">
            <summary className="text-xs text-mute cursor-pointer">Advanced full form</summary>
            <div className="mt-4">
              <CreatePoolForm
                chainId={chainId}
                onSubmit={(data) => createPool(data)}
                isSubmitting={isPending}
                error={error}
                initialData={{
                  nftContract: isAddress(nftContract) ? (nftContract as Address) : undefined,
                  initialNFTIds: ids,
                  spotPrice: spot,
                  delta,
                  fee,
                  bondingCurve: LAUNCH_CURVE,
                }}
              />
            </div>
          </details>
        </div>
      )}

      <p className="mt-8 text-xs text-soft">
        <Link href="/create" className="text-forest hover:underline">
          Manual create pool
        </Link>
      </p>
    </div>
  )
}
