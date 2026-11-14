import type { PoolListItem } from '@/components/PoolListCard'

/** Clearly labeled sample pools for homepage preview / empty screenshots. */
export const SAMPLE_POOLS: PoolListItem[] = [
  {
    poolAddress: '0xSamplePool000000000000000000000001',
    nft: '0xSampleNft000000000000000000000001',
    poolType: 2,
    spotPrice: '10000000000000000', // 0.01 ETH
    delta: '1000000000000000',
    fee: '50000000000000000',
    curveType: 'LINEAR',
    owner: null,
  },
  {
    poolAddress: '0xSamplePool000000000000000000000002',
    nft: '0xSampleNft000000000000000000000002',
    poolType: 1,
    spotPrice: '25000000000000000',
    delta: '2000000000000000',
    fee: '100000000000000000',
    curveType: 'LINEAR',
    owner: null,
  },
  {
    poolAddress: '0xSamplePool000000000000000000000003',
    nft: '0xSampleNft000000000000000000000003',
    poolType: 0,
    spotPrice: '5000000000000000',
    delta: '500000000000000',
    fee: '0',
    curveType: 'LINEAR',
    owner: null,
  },
]

export interface SampleAuction {
  id: string
  title: string
  lotLabel: string
  currentBid: string
  endsIn: string
}

export const SAMPLE_AUCTIONS: SampleAuction[] = [
  {
    id: 'sample-a1',
    title: 'Study in ochre #12',
    lotLabel: 'English · Lot 14',
    currentBid: '0.42 ETH',
    endsIn: '2d 4h',
  },
  {
    id: 'sample-a2',
    title: 'Night terrace (edition)',
    lotLabel: 'English · Lot 9',
    currentBid: '0.18 ETH',
    endsIn: '11h',
  },
  {
    id: 'sample-a3',
    title: 'Untitled grid',
    lotLabel: 'English · Lot 3',
    currentBid: '1.05 ETH',
    endsIn: '5d',
  },
]

export function isHomePreviewMode(searchPreview: string | null): boolean {
  if (searchPreview === '1' || searchPreview === 'true') return true
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HOME_PREVIEW === '1') {
    return true
  }
  return false
}
