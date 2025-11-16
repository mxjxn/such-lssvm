import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  NewERC721Pair,
  NewERC1155Pair,
  ERC20Deposit,
  NFTDeposit,
  ERC1155Deposit,
} from "../generated/LSSVMPairFactory/LSSVMPairFactory"
import { Pool, Deposit } from "../generated/schema"
import { LSSVMPair } from "../generated/templates"
import { LSSVMPair as LSSVMPairContract } from "../generated/LSSVMPairFactory/LSSVMPair"

export function handleNewERC721Pair(event: NewERC721Pair): void {
  let poolAddress = event.params.poolAddress
  let poolId = poolAddress.toHex()
  
  // Create pool entity
  let pool = new Pool(poolId)
  
  // Load pair contract to get initial state
  let pairContract = LSSVMPairContract.bind(poolAddress)
  
  // Get pool configuration
  pool.nftContract = pairContract.nft()
  pool.spotPrice = pairContract.spotPrice()
  pool.delta = pairContract.delta()
  pool.fee = pairContract.fee()
  pool.bondingCurve = pairContract.bondingCurve()
  pool.owner = pairContract.owner()
  
  // Get pool type
  let poolTypeResult = pairContract.try_poolType()
  if (poolTypeResult.reverted) {
    pool.poolType = 0
  } else {
    pool.poolType = poolTypeResult.value
  }
  
  // Get pool variant - ERC721 pairs are either 0 (ETH) or 1 (ERC20)
  let pairVariantResult = pairContract.try_pairVariant()
  if (pairVariantResult.reverted) {
    pool.poolVariant = 0 // Default to ERC721_ETH
  } else {
    pool.poolVariant = pairVariantResult.value
  }
  
  // For ERC721_ERC20 pools, try to get token contract
  // Note: token() only exists on ERC20 pairs, so we use try_ pattern
  if (pool.poolVariant == 1) {
    // Try to call token() - this will only work on ERC20 pairs
    // We'll need to check the actual contract type, but for now leave null
    // The token contract can be set later if needed
    pool.tokenContract = null
  } else {
    pool.tokenContract = null
  }
  
  pool.nftId = null // ERC721 pools don't have a single NFT ID
  pool.createdAt = event.block.timestamp
  pool.createdAtBlock = event.block.number
  pool.createdAtTx = event.transaction.hash
  
  // Initialize balances to zero (never null)
  pool.currentTokenBalance = BigInt.fromI32(0)
  pool.currentNFTBalance = BigInt.fromI32(event.params.initialIds.length)
  
  pool.save()
  
  // Create dynamic data source for this pair
  LSSVMPair.create(poolAddress)
}

export function handleNewERC1155Pair(event: NewERC1155Pair): void {
  let poolAddress = event.params.poolAddress
  let poolId = poolAddress.toHex()
  
  // Create pool entity
  let pool = new Pool(poolId)
  
  // Load pair contract to get initial state
  let pairContract = LSSVMPairContract.bind(poolAddress)
  
  // Get pool configuration
  pool.nftContract = pairContract.nft()
  pool.spotPrice = pairContract.spotPrice()
  pool.delta = pairContract.delta()
  pool.fee = pairContract.fee()
  pool.bondingCurve = pairContract.bondingCurve()
  pool.owner = pairContract.owner()
  
  // Get pool type
  let poolTypeResult = pairContract.try_poolType()
  if (poolTypeResult.reverted) {
    pool.poolType = 0
  } else {
    pool.poolType = poolTypeResult.value
  }
  
  // Get pool variant - ERC1155 pairs are either 2 (ETH) or 3 (ERC20)
  let pairVariantResult = pairContract.try_pairVariant()
  if (pairVariantResult.reverted) {
    pool.poolVariant = 2 // Default to ERC1155_ETH
  } else {
    pool.poolVariant = pairVariantResult.value
  }
  
  // For ERC1155 pools, nftId and token are stored in the contract but not accessible via base interface
  // We'll leave these as null for now - they can be populated later if needed via direct contract calls
  pool.nftId = null
  pool.tokenContract = null
  
  pool.createdAt = event.block.timestamp
  pool.createdAtBlock = event.block.number
  pool.createdAtTx = event.transaction.hash
  
  // Initialize balances (never null)
  pool.currentTokenBalance = BigInt.fromI32(0)
  pool.currentNFTBalance = event.params.initialBalance
  
  pool.save()
  
  // Create dynamic data source for this pair
  LSSVMPair.create(poolAddress)
}

export function handleERC20Deposit(event: ERC20Deposit): void {
  let poolId = event.params.poolAddress.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Update pool balance - use zero if null
  let currentBalance = pool.currentTokenBalance
  if (currentBalance === null) {
    pool.currentTokenBalance = event.params.amount
  } else {
    pool.currentTokenBalance = currentBalance.plus(event.params.amount)
  }
  pool.save()
  
  // Create deposit entity
  let depositId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let deposit = new Deposit(depositId)
  deposit.pool = poolId
  deposit.type = "token"
  deposit.tokenAmount = event.params.amount
  deposit.timestamp = event.block.timestamp
  deposit.blockNumber = event.block.number
  deposit.txHash = event.transaction.hash
  deposit.from = event.transaction.from
  deposit.nftIds = []
  deposit.nftId = null
  deposit.nftAmount = null
  deposit.save()
}

export function handleNFTDeposit(event: NFTDeposit): void {
  let poolId = event.params.poolAddress.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Update pool balance - use zero if null
  let nftCount = BigInt.fromI32(event.params.ids.length)
  let currentBalance = pool.currentNFTBalance
  if (currentBalance === null) {
    pool.currentNFTBalance = nftCount
  } else {
    pool.currentNFTBalance = currentBalance.plus(nftCount)
  }
  pool.save()
  
  // Create deposit entity
  let depositId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let deposit = new Deposit(depositId)
  deposit.pool = poolId
  deposit.type = "nft"
  deposit.nftIds = event.params.ids
  deposit.timestamp = event.block.timestamp
  deposit.blockNumber = event.block.number
  deposit.txHash = event.transaction.hash
  deposit.from = event.transaction.from
  deposit.tokenAmount = null
  deposit.nftId = null
  deposit.nftAmount = null
  deposit.save()
}

export function handleERC1155Deposit(event: ERC1155Deposit): void {
  let poolId = event.params.poolAddress.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Update pool balance - use zero if null
  let currentBalance = pool.currentNFTBalance
  if (currentBalance === null) {
    pool.currentNFTBalance = event.params.amount
  } else {
    pool.currentNFTBalance = currentBalance.plus(event.params.amount)
  }
  pool.save()
  
  // Create deposit entity
  let depositId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let deposit = new Deposit(depositId)
  deposit.pool = poolId
  deposit.type = "erc1155"
  deposit.nftId = event.params.id
  deposit.nftAmount = event.params.amount
  deposit.timestamp = event.block.timestamp
  deposit.blockNumber = event.block.number
  deposit.txHash = event.transaction.hash
  deposit.from = event.transaction.from
  deposit.tokenAmount = null
  deposit.nftIds = []
  deposit.save()
}
