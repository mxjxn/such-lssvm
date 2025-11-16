import { Address } from 'viem'
import { CONFIG } from './config'

// Contract addresses - these should be set via environment variables
// Format: NEXT_PUBLIC_ROUTER_ADDRESS_8453 for Base mainnet (chainId 8453)
export function getRouterAddress(chainId: number): Address {
  // Use config file which has the env vars embedded at build time
  let address: Address | undefined
  
  if (chainId === 8453) {
    address = CONFIG.ROUTER_ADDRESS_8453 as Address | undefined
  } else if (chainId === 84532) {
    address = CONFIG.ROUTER_ADDRESS_84532 as Address | undefined
  }
  
  // Fallback to direct env access (for other chains or if config didn't work)
  if (!address) {
    const envKey = `NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}`
    address = process.env[envKey] as Address | undefined
  }
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('=== Router Address Debug ===')
    console.log('Chain ID:', chainId)
    console.log('Address from CONFIG:', chainId === 8453 ? CONFIG.ROUTER_ADDRESS_8453 : chainId === 84532 ? CONFIG.ROUTER_ADDRESS_84532 : 'N/A')
    console.log('Address from env:', process.env[`NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}`])
    console.log('Final address:', address)
    console.log('===========================')
  }
  
  if (!address || address === '') {
    throw new Error(`Router address not configured for chain ${chainId}. Set NEXT_PUBLIC_ROUTER_ADDRESS_${chainId} in your environment variables.`)
  }
  return address
}

export function getFactoryAddress(chainId: number): Address {
  // Use config file which has the env vars embedded at build time
  let address: Address | undefined
  
  if (chainId === 8453) {
    address = CONFIG.FACTORY_ADDRESS_8453 as Address | undefined
  } else if (chainId === 84532) {
    address = CONFIG.FACTORY_ADDRESS_84532 as Address | undefined
  }
  
  // Fallback to direct env access
  if (!address) {
    const envKey = `NEXT_PUBLIC_FACTORY_ADDRESS_${chainId}`
    address = process.env[envKey] as Address | undefined
  }
  
  if (!address || address === '') {
    throw new Error(`Factory address not configured for chain ${chainId}. Set NEXT_PUBLIC_FACTORY_ADDRESS_${chainId} in your environment variables.`)
  }
  return address
}

// Pool Type enum
export enum PoolType {
  TOKEN = 0,
  NFT = 1,
  TRADE = 2,
}

// Curve Error Codes
export enum CurveError {
  OK = 0,
  INVALID_NUMITEMS = 1,
  SPOT_PRICE_OVERFLOW = 2,
  DELTA_OVERFLOW = 3,
  SPOT_PRICE_UNDERFLOW = 4,
  AUCTION_ENDED = 5,
}

// ILSSVMPair ABI
export const LSSVM_PAIR_ABI = [
  {
    inputs: [],
    name: 'poolType',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'spotPrice',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'delta',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [{ internalType: 'uint96', name: '', type: 'uint96' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nft',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bondingCurve',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pairVariant',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nftId',
    outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAssetRecipient',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'assetId', type: 'uint256' },
      { internalType: 'uint256', name: 'numItems', type: 'uint256' },
    ],
    name: 'getBuyNFTQuote',
    outputs: [
      { internalType: 'uint8', name: 'error', type: 'uint8' },
      { internalType: 'uint256', name: 'newSpotPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'newDelta', type: 'uint256' },
      { internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
      { internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'assetId', type: 'uint256' },
      { internalType: 'uint256', name: 'numNFTs', type: 'uint256' },
    ],
    name: 'getSellNFTQuote',
    outputs: [
      { internalType: 'uint8', name: 'error', type: 'uint8' },
      { internalType: 'uint256', name: 'newSpotPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'newDelta', type: 'uint256' },
      { internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
      { internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
      { internalType: 'uint256', name: 'maxExpectedTokenInput', type: 'uint256' },
      { internalType: 'address', name: 'nftRecipient', type: 'address' },
      { internalType: 'bool', name: 'isRouter', type: 'bool' },
      { internalType: 'address', name: 'routerCaller', type: 'address' },
    ],
    name: 'swapTokenForSpecificNFTs',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
      { internalType: 'uint256', name: 'minExpectedTokenOutput', type: 'uint256' },
      { internalType: 'address payable', name: 'tokenRecipient', type: 'address' },
      { internalType: 'bool', name: 'isRouter', type: 'bool' },
      { internalType: 'address', name: 'routerCaller', type: 'address' },
    ],
    name: 'swapNFTsForToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllIds',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// LSSVMRouter ABI
export const LSSVM_ROUTER_ABI = [
  {
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'contract ILSSVMPairFactoryLike', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'contract LSSVMPair', name: 'pair', type: 'address' },
          { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
        ],
        internalType: 'struct LSSVMRouter.PairSwapSpecific[]',
        name: 'swapList',
        type: 'tuple[]',
      },
      { internalType: 'address payable', name: 'ethRecipient', type: 'address' },
      { internalType: 'address', name: 'nftRecipient', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapETHForSpecificNFTs',
    outputs: [{ internalType: 'uint256', name: 'remainingValue', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'contract LSSVMPair', name: 'pair', type: 'address' },
              { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
            ],
            internalType: 'struct LSSVMRouter.PairSwapSpecific',
            name: 'swapInfo',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'maxCost', type: 'uint256' },
        ],
        internalType: 'struct LSSVMRouter.RobustPairSwapSpecific[]',
        name: 'swapList',
        type: 'tuple[]',
      },
      { internalType: 'address payable', name: 'ethRecipient', type: 'address' },
      { internalType: 'address', name: 'nftRecipient', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'robustSwapETHForSpecificNFTs',
    outputs: [{ internalType: 'uint256', name: 'remainingValue', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'contract LSSVMPair', name: 'pair', type: 'address' },
          { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
        ],
        internalType: 'struct LSSVMRouter.PairSwapSpecific[]',
        name: 'swapList',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
      { internalType: 'address', name: 'nftRecipient', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapERC20ForSpecificNFTs',
    outputs: [{ internalType: 'uint256', name: 'remainingValue', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'contract LSSVMPair', name: 'pair', type: 'address' },
          { internalType: 'uint256[]', name: 'nftIds', type: 'uint256[]' },
        ],
        internalType: 'struct LSSVMRouter.PairSwapSpecific[]',
        name: 'swapList',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'minOutput', type: 'uint256' },
      { internalType: 'address', name: 'tokenRecipient', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapNFTsForToken',
    outputs: [{ internalType: 'uint256', name: 'outputAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// ERC721 ABI (minimal)
export const ERC721_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'uri',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'metadataURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllIds',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ERC1155 ABI (minimal)
export const ERC1155_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'uri',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// LSSVMPairFactory ABI
export const LSSVM_FACTORY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'router', type: 'address' }],
    name: 'routerStatus',
    outputs: [
      { internalType: 'bool', name: 'allowed', type: 'bool' },
      { internalType: 'bool', name: 'wasEverTouched', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'pairAddress', type: 'address' }],
    name: 'getPairNFTType',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC721', name: '_nft', type: 'address' },
      { internalType: 'contract ICurve', name: '_bondingCurve', type: 'address' },
      { internalType: 'address payable', name: '_assetRecipient', type: 'address' },
      { internalType: 'uint8', name: '_poolType', type: 'uint8' },
      { internalType: 'uint128', name: '_delta', type: 'uint128' },
      { internalType: 'uint96', name: '_fee', type: 'uint96' },
      { internalType: 'uint128', name: '_spotPrice', type: 'uint128' },
      { internalType: 'address', name: '_propertyChecker', type: 'address' },
      { internalType: 'uint256[]', name: '_initialNFTIDs', type: 'uint256[]' },
    ],
    name: 'createPairERC721ETH',
    outputs: [{ internalType: 'contract LSSVMPairERC721ETH', name: 'pair', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'contract ERC20', name: 'token', type: 'address' },
          { internalType: 'contract IERC721', name: 'nft', type: 'address' },
          { internalType: 'contract ICurve', name: 'bondingCurve', type: 'address' },
          { internalType: 'address payable', name: 'assetRecipient', type: 'address' },
          { internalType: 'uint8', name: 'poolType', type: 'uint8' },
          { internalType: 'uint128', name: 'delta', type: 'uint128' },
          { internalType: 'uint96', name: 'fee', type: 'uint96' },
          { internalType: 'uint128', name: 'spotPrice', type: 'uint128' },
          { internalType: 'address', name: 'propertyChecker', type: 'address' },
          { internalType: 'uint256[]', name: 'initialNFTIDs', type: 'uint256[]' },
          { internalType: 'uint256', name: 'initialTokenBalance', type: 'uint256' },
        ],
        internalType: 'struct LSSVMPairFactory.CreateERC721ERC20PairParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'createPairERC721ERC20',
    outputs: [{ internalType: 'contract LSSVMPairERC721ERC20', name: 'pair', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC1155', name: '_nft', type: 'address' },
      { internalType: 'contract ICurve', name: '_bondingCurve', type: 'address' },
      { internalType: 'address payable', name: '_assetRecipient', type: 'address' },
      { internalType: 'uint8', name: '_poolType', type: 'uint8' },
      { internalType: 'uint128', name: '_delta', type: 'uint128' },
      { internalType: 'uint96', name: '_fee', type: 'uint96' },
      { internalType: 'uint128', name: '_spotPrice', type: 'uint128' },
      { internalType: 'uint256', name: '_nftId', type: 'uint256' },
      { internalType: 'uint256', name: '_initialNFTBalance', type: 'uint256' },
    ],
    name: 'createPairERC1155ETH',
    outputs: [{ internalType: 'contract LSSVMPairERC1155ETH', name: 'pair', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'contract ERC20', name: 'token', type: 'address' },
          { internalType: 'contract IERC1155', name: 'nft', type: 'address' },
          { internalType: 'contract ICurve', name: 'bondingCurve', type: 'address' },
          { internalType: 'address payable', name: 'assetRecipient', type: 'address' },
          { internalType: 'uint8', name: 'poolType', type: 'uint8' },
          { internalType: 'uint128', name: 'delta', type: 'uint128' },
          { internalType: 'uint96', name: 'fee', type: 'uint96' },
          { internalType: 'uint128', name: 'spotPrice', type: 'uint128' },
          { internalType: 'uint256', name: 'nftId', type: 'uint256' },
          { internalType: 'uint256', name: 'initialNFTBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'initialTokenBalance', type: 'uint256' },
        ],
        internalType: 'struct LSSVMPairFactory.CreateERC1155ERC20PairParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'createPairERC1155ERC20',
    outputs: [{ internalType: 'contract LSSVMPairERC1155ERC20', name: 'pair', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events for pool discovery
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'poolAddress', type: 'address' },
      { indexed: false, internalType: 'uint256[]', name: 'initialIds', type: 'uint256[]' },
    ],
    name: 'NewERC721Pair',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'poolAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'initialBalance', type: 'uint256' },
    ],
    name: 'NewERC1155Pair',
    type: 'event',
  },
  // Error definitions for better error messages
  {
    inputs: [],
    name: 'LSSVMPairFactory__BondingCurveNotWhitelisted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LSSVMPairFactory__ReentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LSSVMPairFactory__ZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LSSVMPair__InvalidDelta',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LSSVMPair__InvalidSpotPrice',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LSSVMPair__NftNotTransferred',
    type: 'error',
  },
] as const

// Bonding curve addresses by chain
export const BONDING_CURVES = {
  8453: {
    // Base Mainnet
    LINEAR: '0xe41352CB8D9af18231E05520751840559C2a548A' as Address,
    EXPONENTIAL: '0x9506C0E5CEe9AD1dEe65B3539268D61CCB25aFB6' as Address,
    XYK: '0xd0A2f4ae5E816ec09374c67F6532063B60dE037B' as Address,
    GDA: '0x4f1627be4C72aEB9565D4c751550C4D262a96B51' as Address,
  },
  84532: {
    // Base Sepolia Testnet
    LINEAR: '0x3F1E31d662eD24b6B69d73B07C98076d3814F8C0' as Address,
    EXPONENTIAL: '0x4637d06530d5D375B1D5dE1117C98b0c6EA7eDd1' as Address,
    XYK: '0xC4DfB54Ca18c9e5EC2a23e8DE09588982A6b2242' as Address,
    GDA: '0x60bAB2734eb85F07Ca93E3B7Fb1015fcc5e9CbA7' as Address,
  },
} as const

export function getBondingCurveAddress(chainId: number, curveType: 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA'): Address {
  const curves = BONDING_CURVES[chainId as keyof typeof BONDING_CURVES]
  if (!curves) {
    throw new Error(`Bonding curves not configured for chain ${chainId}`)
  }
  return curves[curveType]
}

// Types
export interface PairSwapSpecific {
  pair: Address
  nftIds: bigint[]
}

export interface BuyNFTQuote {
  error: CurveError
  newSpotPrice: bigint
  newDelta: bigint
  inputAmount: bigint
  protocolFee: bigint
  royaltyAmount: bigint
}

export interface SellNFTQuote {
  error: CurveError
  newSpotPrice: bigint
  newDelta: bigint
  outputAmount: bigint
  protocolFee: bigint
  royaltyAmount: bigint
}

export interface PoolData {
  address: Address
  poolType: PoolType
  spotPrice: bigint
  delta: bigint
  fee: bigint
  nft: Address
  token: Address
  bondingCurve: Address
}

