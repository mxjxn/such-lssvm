import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  SwapNFTInPair,
  SwapNFTInPair1,
  SwapNFTOutPair,
  SwapNFTOutPair1,
  SpotPriceUpdate,
  TokenDeposit,
  TokenWithdrawal,
  NFTWithdrawal,
  NFTWithdrawal1,
  DeltaUpdate,
  FeeUpdate,
  AssetRecipientChange,
} from "../generated/templates/LSSVMPair/LSSVMPair"
import { Pool, Swap, Deposit, Withdrawal } from "../generated/schema"

export function handleSwapNFTInPair(event: SwapNFTInPair): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // This is a "buy" - NFTs are being swapped INTO the pool
  // The pool receives NFTs and pays out tokens
  let swapId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let swap = new Swap(swapId)
  swap.pool = poolId
  swap.type = "buy"
  swap.tokenAmount = event.params.amountOut
  
  // Handle array variant (ERC721)
  if (event.params.ids != null && event.params.ids.length > 0) {
    swap.nftIds = event.params.ids
    swap.nftAmount = null
    
    // Update pool NFT balance (increase)
    let nftCount = BigInt.fromI32(event.params.ids.length)
    let currentNFTBalance = pool.currentNFTBalance
    if (currentNFTBalance === null) {
      pool.currentNFTBalance = nftCount
    } else {
      pool.currentNFTBalance = currentNFTBalance.plus(nftCount)
    }
    
    // Update pool token balance (decrease)
    let currentTokenBalance = pool.currentTokenBalance
    if (currentTokenBalance === null) {
      pool.currentTokenBalance = BigInt.fromI32(0)
    } else {
      pool.currentTokenBalance = currentTokenBalance.minus(event.params.amountOut)
    }
  } else {
    swap.nftIds = []
    swap.nftAmount = null
  }
  
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.txHash = event.transaction.hash
  swap.from = event.transaction.from
  swap.save()
  
  pool.save()
}

export function handleSwapNFTInPairAmount(event: SwapNFTInPair1): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // This is a "buy" - ERC1155 NFTs are being swapped INTO the pool
  let swapId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let swap = new Swap(swapId)
  swap.pool = poolId
  swap.type = "buy"
  swap.tokenAmount = event.params.amountOut
  swap.nftAmount = event.params.numNFTs
  swap.nftIds = []
  
  // Update pool balances with null checks
  let currentNFTBalance = pool.currentNFTBalance
  if (currentNFTBalance === null) {
    pool.currentNFTBalance = event.params.numNFTs
  } else {
    pool.currentNFTBalance = currentNFTBalance.plus(event.params.numNFTs)
  }
  
  let currentTokenBalance = pool.currentTokenBalance
  if (currentTokenBalance === null) {
    pool.currentTokenBalance = BigInt.fromI32(0)
  } else {
    pool.currentTokenBalance = currentTokenBalance.minus(event.params.amountOut)
  }
  
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.txHash = event.transaction.hash
  swap.from = event.transaction.from
  swap.save()
  
  pool.save()
}

export function handleSwapNFTOutPair(event: SwapNFTOutPair): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // This is a "sell" - NFTs are being swapped OUT OF the pool
  // The pool receives tokens and pays out NFTs
  let swapId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let swap = new Swap(swapId)
  swap.pool = poolId
  swap.type = "sell"
  swap.tokenAmount = event.params.amountIn
  
  // Handle array variant (ERC721)
  if (event.params.ids != null && event.params.ids.length > 0) {
    swap.nftIds = event.params.ids
    swap.nftAmount = null
    
    // Update pool NFT balance (decrease)
    let nftCount = BigInt.fromI32(event.params.ids.length)
    let currentNFTBalance = pool.currentNFTBalance
    if (currentNFTBalance === null) {
      pool.currentNFTBalance = BigInt.fromI32(0)
    } else {
      pool.currentNFTBalance = currentNFTBalance.minus(nftCount)
    }
    
    // Update pool token balance (increase)
    let currentTokenBalance = pool.currentTokenBalance
    if (currentTokenBalance === null) {
      pool.currentTokenBalance = event.params.amountIn
    } else {
      pool.currentTokenBalance = currentTokenBalance.plus(event.params.amountIn)
    }
  } else {
    swap.nftIds = []
    swap.nftAmount = null
  }
  
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.txHash = event.transaction.hash
  swap.from = event.transaction.from
  swap.save()
  
  pool.save()
}

export function handleSwapNFTOutPairAmount(event: SwapNFTOutPair1): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // This is a "sell" - ERC1155 NFTs are being swapped OUT OF the pool
  let swapId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let swap = new Swap(swapId)
  swap.pool = poolId
  swap.type = "sell"
  swap.tokenAmount = event.params.amountIn
  swap.nftAmount = event.params.numNFTs
  swap.nftIds = []
  
  // Update pool balances with null checks
  let currentNFTBalance = pool.currentNFTBalance
  if (currentNFTBalance === null) {
    pool.currentNFTBalance = BigInt.fromI32(0)
  } else {
    pool.currentNFTBalance = currentNFTBalance.minus(event.params.numNFTs)
  }
  
  let currentTokenBalance = pool.currentTokenBalance
  if (currentTokenBalance === null) {
    pool.currentTokenBalance = event.params.amountIn
  } else {
    pool.currentTokenBalance = currentTokenBalance.plus(event.params.amountIn)
  }
  
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.txHash = event.transaction.hash
  swap.from = event.transaction.from
  swap.save()
  
  pool.save()
}

export function handleSpotPriceUpdate(event: SpotPriceUpdate): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  pool.spotPrice = event.params.newSpotPrice
  pool.save()
}

export function handleTokenDeposit(event: TokenDeposit): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Update pool balance with null check
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

export function handleTokenWithdrawal(event: TokenWithdrawal): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Update pool balance with null check
  let currentBalance = pool.currentTokenBalance
  if (currentBalance === null) {
    pool.currentTokenBalance = BigInt.fromI32(0)
  } else {
    pool.currentTokenBalance = currentBalance.minus(event.params.amount)
  }
  pool.save()
  
  // Create withdrawal entity
  let withdrawalId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let withdrawal = new Withdrawal(withdrawalId)
  withdrawal.pool = poolId
  withdrawal.type = "token"
  withdrawal.tokenAmount = event.params.amount
  withdrawal.timestamp = event.block.timestamp
  withdrawal.blockNumber = event.block.number
  withdrawal.txHash = event.transaction.hash
  withdrawal.to = event.transaction.from
  withdrawal.nftIds = []
  withdrawal.nftAmount = null
  withdrawal.save()
}

export function handleNFTWithdrawal(event: NFTWithdrawal): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Handle array variant (ERC721)
  if (event.params.ids != null && event.params.ids.length > 0) {
    let nftCount = BigInt.fromI32(event.params.ids.length)
    
    // Update pool balance with null check
    let currentBalance = pool.currentNFTBalance
    if (currentBalance === null) {
      pool.currentNFTBalance = BigInt.fromI32(0)
    } else {
      pool.currentNFTBalance = currentBalance.minus(nftCount)
    }
    pool.save()
    
    // Create withdrawal entity
    let withdrawalId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    let withdrawal = new Withdrawal(withdrawalId)
    withdrawal.pool = poolId
    withdrawal.type = "nft"
    withdrawal.nftIds = event.params.ids
    withdrawal.timestamp = event.block.timestamp
    withdrawal.blockNumber = event.block.number
    withdrawal.txHash = event.transaction.hash
    withdrawal.to = event.transaction.from
    withdrawal.tokenAmount = null
    withdrawal.nftAmount = null
    withdrawal.save()
  }
}

export function handleNFTWithdrawalAmount(event: NFTWithdrawal1): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  // Handle amount variant (ERC1155)
  // Update pool balance with null check
  let currentBalance = pool.currentNFTBalance
  if (currentBalance === null) {
    pool.currentNFTBalance = BigInt.fromI32(0)
  } else {
    pool.currentNFTBalance = currentBalance.minus(event.params.numNFTs)
  }
  pool.save()
  
  // Create withdrawal entity
  let withdrawalId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let withdrawal = new Withdrawal(withdrawalId)
  withdrawal.pool = poolId
  withdrawal.type = "nft"
  withdrawal.nftAmount = event.params.numNFTs
  withdrawal.timestamp = event.block.timestamp
  withdrawal.blockNumber = event.block.number
  withdrawal.txHash = event.transaction.hash
  withdrawal.to = event.transaction.from
  withdrawal.nftIds = []
  withdrawal.tokenAmount = null
  withdrawal.save()
}

export function handleDeltaUpdate(event: DeltaUpdate): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  pool.delta = event.params.newDelta
  pool.save()
}

export function handleFeeUpdate(event: FeeUpdate): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  pool.fee = event.params.newFee
  pool.save()
}

export function handleAssetRecipientChange(event: AssetRecipientChange): void {
  let poolId = event.address.toHex()
  let pool = Pool.load(poolId)
  
  if (pool == null) {
    return
  }
  
  pool.assetRecipient = event.params.a
  pool.save()
}
