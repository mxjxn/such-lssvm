'use client'

import { useState, useEffect } from 'react'
import { Address, isAddress, parseEther, formatUnits } from 'viem'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getBondingCurveAddress, PoolType, BONDING_CURVES, ERC721_ABI, ERC1155_ABI, getFactoryAddress } from '@/lib/contracts'
import { ERC20_ABI } from '@/lib/contracts'
import { getPublicClient } from '@/lib/wagmi'
import { useERC1155TokenInfo } from '@/hooks/useERC1155TokenInfo'
import { useQuery } from '@tanstack/react-query'

export interface CreatePoolFormData {
  nftType: 'ERC721' | 'ERC1155'
  paymentToken: 'ETH' | 'ERC20'
  nftContract: Address
  erc20Token: Address | null
  bondingCurve: 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA'
  spotPrice: string // In ETH/ERC20 units (e.g., "1.0")
  delta: string // In ETH/ERC20 units
  fee: string // In basis points (e.g., "100" = 1%)
  // ERC721 fields
  initialNFTIds: string // Comma-separated token IDs
  // ERC1155 fields
  nftId: string
  initialNFTBalance: string
  // ERC20 fields
  initialTokenBalance: string
}

interface CreatePoolFormProps {
  chainId: number
  onSubmit: (data: CreatePoolFormData) => void
  isSubmitting?: boolean
  error?: string | null
  initialData?: Partial<CreatePoolFormData> | null
}

export function CreatePoolForm({ chainId, onSubmit, isSubmitting = false, error, initialData }: CreatePoolFormProps) {
  const { address: userAddress, isConnected } = useAccount()
  const { writeContract: writeApproval, data: approvalHash, isPending: isApproving } = useWriteContract()
  const { isSuccess: approvalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })
  
  const [formData, setFormData] = useState<CreatePoolFormData>({
    nftType: initialData?.nftType || 'ERC721',
    paymentToken: initialData?.paymentToken || 'ETH',
    nftContract: initialData?.nftContract || ('' as Address),
    erc20Token: initialData?.erc20Token || null,
    bondingCurve: initialData?.bondingCurve || 'LINEAR',
    spotPrice: initialData?.spotPrice || '0.002',
    delta: initialData?.delta || '0.01',
    fee: initialData?.fee || '100', // 1% default fee
    initialNFTIds: initialData?.initialNFTIds || '',
    nftId: initialData?.nftId || '0',
    initialNFTBalance: initialData?.initialNFTBalance || '0',
    initialTokenBalance: initialData?.initialTokenBalance || '0',
  })

  const [erc20Decimals, setErc20Decimals] = useState<number | null>(null)
  const [erc20Symbol, setErc20Symbol] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Update form when initialData first becomes available (from URL params)
  useEffect(() => {
    if (initialData && initialData.nftContract) {
      setFormData(prev => ({
        ...prev,
        nftContract: initialData.nftContract!,
        nftType: initialData.nftType || prev.nftType,
        paymentToken: initialData.paymentToken || prev.paymentToken,
        erc20Token: initialData.erc20Token !== undefined ? initialData.erc20Token : prev.erc20Token,
        bondingCurve: initialData.bondingCurve || prev.bondingCurve,
        spotPrice: initialData.spotPrice || prev.spotPrice,
        delta: initialData.delta || prev.delta,
        fee: initialData.fee || prev.fee,
        initialNFTIds: initialData.initialNFTIds !== undefined ? initialData.initialNFTIds : prev.initialNFTIds,
        nftId: initialData.nftId !== undefined ? initialData.nftId : prev.nftId,
        initialNFTBalance: initialData.initialNFTBalance !== undefined ? initialData.initialNFTBalance : prev.initialNFTBalance,
        initialTokenBalance: initialData.initialTokenBalance !== undefined ? initialData.initialTokenBalance : prev.initialTokenBalance,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.nftContract]) // Only re-run when NFT contract changes

  // Fetch ERC1155 token info when NFT ID is entered
  const { tokenInfo, isLoading: loadingTokenInfo, isDebouncing } = useERC1155TokenInfo(
    formData.nftContract && isAddress(formData.nftContract) && formData.nftType === 'ERC1155'
      ? formData.nftContract
      : undefined,
    formData.nftId,
    chainId
  )

  // Auto-populate balance when token info is loaded
  useEffect(() => {
    if (tokenInfo && tokenInfo.balance > 0n && (!formData.initialNFTBalance || formData.initialNFTBalance === '0')) {
      setFormData(prev => ({ ...prev, initialNFTBalance: tokenInfo.balance.toString() }))
    }
  }, [tokenInfo, formData.initialNFTBalance])

  // Check approval status
  const factoryAddress = formData.nftContract && isAddress(formData.nftContract) ? getFactoryAddress(chainId) : null
  const { data: isApproved, refetch: refetchApproval } = useQuery<boolean>({
    queryKey: ['nftApproval', formData.nftContract, formData.nftType, userAddress, factoryAddress, chainId, approvalSuccess],
    queryFn: async () => {
      if (!formData.nftContract || !isAddress(formData.nftContract) || !userAddress || !factoryAddress) {
        return false
      }

      try {
        const client = getPublicClient(chainId)
        const abi = formData.nftType === 'ERC721' ? ERC721_ABI : ERC1155_ABI
        const approved = await client.readContract({
          address: formData.nftContract,
          abi,
          functionName: 'isApprovedForAll',
          args: [userAddress, factoryAddress],
        })
        return approved as boolean
      } catch (err) {
        console.error('Error checking approval:', err)
        return false
      }
    },
    enabled: !!formData.nftContract && isAddress(formData.nftContract) && !!userAddress && !!factoryAddress,
    staleTime: 10 * 1000, // 10 seconds
  })

  // Refetch approval when approval transaction succeeds
  useEffect(() => {
    if (approvalSuccess) {
      refetchApproval()
    }
  }, [approvalSuccess, refetchApproval])

  // Handle approval
  const handleApprove = () => {
    if (!formData.nftContract || !isAddress(formData.nftContract) || !factoryAddress) {
      return
    }

    const abi = formData.nftType === 'ERC721' ? ERC721_ABI : ERC1155_ABI
    writeApproval({
      address: formData.nftContract,
      abi,
      functionName: 'setApprovalForAll',
      args: [factoryAddress, true],
    })
  }

  // Fetch ERC20 token info when token address changes
  useEffect(() => {
    if (formData.paymentToken === 'ERC20' && formData.erc20Token && isAddress(formData.erc20Token)) {
      const fetchTokenInfo = async () => {
        try {
          const client = getPublicClient(chainId)
          const [decimals, symbol] = await Promise.all([
            client.readContract({
              address: formData.erc20Token!,
              abi: ERC20_ABI,
              functionName: 'decimals',
            }),
            client.readContract({
              address: formData.erc20Token!,
              abi: ERC20_ABI,
              functionName: 'symbol',
            }),
          ])
          setErc20Decimals(Number(decimals))
          setErc20Symbol(symbol)
        } catch (err) {
          console.error('Error fetching ERC20 token info:', err)
          setErc20Decimals(null)
          setErc20Symbol(null)
        }
      }
      fetchTokenInfo()
    } else {
      setErc20Decimals(null)
      setErc20Symbol(null)
    }
  }, [formData.paymentToken, formData.erc20Token, chainId])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // NFT contract validation
    if (!formData.nftContract || !isAddress(formData.nftContract)) {
      errors.nftContract = 'Valid NFT contract address is required'
    }

    // ERC20 token validation
    if (formData.paymentToken === 'ERC20') {
      if (!formData.erc20Token || !isAddress(formData.erc20Token)) {
        errors.erc20Token = 'Valid ERC20 token address is required'
      }
    }

    // Spot price validation
    const spotPriceNum = parseFloat(formData.spotPrice)
    if (isNaN(spotPriceNum) || spotPriceNum <= 0) {
      errors.spotPrice = 'Spot price must be a positive number'
    }

    // Delta validation
    const deltaNum = parseFloat(formData.delta)
    if (isNaN(deltaNum) || deltaNum <= 0) {
      errors.delta = 'Delta must be a positive number'
    }

    // Fee validation (for TRADE pools, fee can be 0-10000 basis points)
    const feeNum = parseFloat(formData.fee)
    if (isNaN(feeNum) || feeNum < 0 || feeNum > 10000) {
      errors.fee = 'Fee must be between 0 and 10000 basis points (0-100%)'
    }

    // ERC721 validation
    if (formData.nftType === 'ERC721') {
      if (!formData.initialNFTIds.trim()) {
        errors.initialNFTIds = 'At least one initial NFT ID is required'
      } else {
        const ids = formData.initialNFTIds.split(',').map(id => id.trim()).filter(Boolean)
        if (ids.length === 0) {
          errors.initialNFTIds = 'At least one initial NFT ID is required'
        }
        // Validate each ID is a valid number
        for (const id of ids) {
          if (isNaN(parseInt(id, 10))) {
            errors.initialNFTIds = `Invalid NFT ID: ${id}`
            break
          }
        }
      }
    }

    // ERC1155 validation
    if (formData.nftType === 'ERC1155') {
      const nftIdNum = parseFloat(formData.nftId)
      if (isNaN(nftIdNum) || nftIdNum < 0) {
        errors.nftId = 'NFT ID must be a non-negative number'
      }

      const balanceNum = parseFloat(formData.initialNFTBalance)
      if (isNaN(balanceNum) || balanceNum <= 0) {
        errors.initialNFTBalance = 'Initial NFT balance must be a positive number'
      }
    }

    // ERC20 initial balance validation
    if (formData.paymentToken === 'ERC20') {
      const tokenBalanceNum = parseFloat(formData.initialTokenBalance)
      if (isNaN(tokenBalanceNum) || tokenBalanceNum < 0) {
        errors.initialTokenBalance = 'Initial token balance must be a non-negative number'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', { isConnected, formData })
    
    if (!isConnected) {
      setValidationErrors({ submit: 'Please connect your wallet' })
      return
    }

    const isValid = validateForm()
    console.log('Validation result:', isValid, validationErrors)
    
    if (isValid) {
      console.log('Calling onSubmit with:', formData)
      onSubmit(formData)
    } else {
      console.log('Validation failed:', validationErrors)
    }
  }

  const updateField = <K extends keyof CreatePoolFormData>(field: K, value: CreatePoolFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const bondingCurves = BONDING_CURVES[chainId as keyof typeof BONDING_CURVES]
  const hasBondingCurves = !!bondingCurves

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {validationErrors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{validationErrors.submit}</p>
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && !validationErrors.submit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-semibold mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field} className="text-yellow-700 text-sm">
                <strong>{field}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* NFT Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NFT Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateField('nftType', 'ERC721')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              formData.nftType === 'ERC721'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            ERC721
          </button>
          <button
            type="button"
            onClick={() => updateField('nftType', 'ERC1155')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              formData.nftType === 'ERC1155'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            ERC1155
          </button>
        </div>
      </div>

      {/* Payment Token Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Token
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateField('paymentToken', 'ETH')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              formData.paymentToken === 'ETH'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            ETH
          </button>
          <button
            type="button"
            onClick={() => updateField('paymentToken', 'ERC20')}
            className={`px-4 py-3 rounded-lg border-2 transition-colors ${
              formData.paymentToken === 'ERC20'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            ERC20
          </button>
        </div>
      </div>

      {/* NFT Contract Address */}
      <div>
        <label htmlFor="nftContract" className="block text-sm font-medium text-gray-700 mb-2">
          NFT Contract Address *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="nftContract"
            value={formData.nftContract}
            onChange={(e) => updateField('nftContract', e.target.value as Address)}
            placeholder="0x..."
            className={`flex-1 px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.nftContract ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formData.nftContract && isAddress(formData.nftContract) && userAddress && factoryAddress && (
            <div className="flex items-center">
              {isApproved ? (
                <div className="flex items-center gap-2 px-4 py-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Approved</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving || !isConnected}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isApproving || !isConnected
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
              )}
            </div>
          )}
        </div>
        {validationErrors.nftContract && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.nftContract}</p>
        )}
      </div>

      {/* ERC20 Token Address (conditional) */}
      {formData.paymentToken === 'ERC20' && (
        <div>
          <label htmlFor="erc20Token" className="block text-sm font-medium text-gray-700 mb-2">
            ERC20 Token Address *
          </label>
          <input
            type="text"
            id="erc20Token"
            value={formData.erc20Token || ''}
            onChange={(e) => updateField('erc20Token', e.target.value as Address)}
            placeholder="0x..."
            className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.erc20Token ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.erc20Token && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.erc20Token}</p>
          )}
          {erc20Symbol && (
            <p className="mt-1 text-sm text-gray-500">Token: {erc20Symbol}</p>
          )}
        </div>
      )}

      {/* Bonding Curve Selection */}
      {hasBondingCurves && (
        <div>
          <label htmlFor="bondingCurve" className="block text-sm font-medium text-gray-700 mb-2">
            Bonding Curve *
          </label>
          <select
            id="bondingCurve"
            value={formData.bondingCurve}
            onChange={(e) => updateField('bondingCurve', e.target.value as CreatePoolFormData['bondingCurve'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="LINEAR">Linear</option>
            <option value="EXPONENTIAL">Exponential</option>
            <option value="XYK">XYK</option>
            <option value="GDA">GDA</option>
          </select>
        </div>
      )}

      {/* Spot Price */}
      <div>
        <label htmlFor="spotPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Spot Price ({formData.paymentToken === 'ETH' ? 'ETH' : erc20Symbol || 'Tokens'}) *
        </label>
        <input
          type="number"
          id="spotPrice"
          step="0.0001"
          value={formData.spotPrice}
          onChange={(e) => updateField('spotPrice', e.target.value)}
          placeholder="0.002"
          className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.spotPrice ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.spotPrice && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.spotPrice}</p>
        )}
      </div>

      {/* Delta */}
      <div>
        <label htmlFor="delta" className="block text-sm font-medium text-gray-700 mb-2">
          Delta ({formData.paymentToken === 'ETH' ? 'ETH' : erc20Symbol || 'Tokens'}) *
        </label>
        <input
          type="number"
          id="delta"
          step="0.0001"
          value={formData.delta}
          onChange={(e) => updateField('delta', e.target.value)}
          placeholder="0.01"
          className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.delta ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.delta && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.delta}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Price adjustment per trade</p>
      </div>

      {/* Fee */}
      <div>
        <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
          Fee (basis points) *
        </label>
        <input
          type="number"
          id="fee"
          step="1"
          value={formData.fee}
          onChange={(e) => updateField('fee', e.target.value)}
          placeholder="100"
          className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.fee ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.fee && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.fee}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">100 = 1%, 1000 = 10%</p>
      </div>

      {/* ERC721: Initial NFT IDs */}
      {formData.nftType === 'ERC721' && (
        <div>
          <label htmlFor="initialNFTIds" className="block text-sm font-medium text-gray-700 mb-2">
            Initial NFT IDs (comma-separated) *
          </label>
          <input
            type="text"
            id="initialNFTIds"
            value={formData.initialNFTIds}
            onChange={(e) => updateField('initialNFTIds', e.target.value)}
            placeholder="1, 2, 3"
            className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.initialNFTIds ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.initialNFTIds && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.initialNFTIds}</p>
          )}
        </div>
      )}

      {/* ERC1155: NFT ID and Initial Balance */}
      {formData.nftType === 'ERC1155' && (
        <>
          <div>
            <label htmlFor="nftId" className="block text-sm font-medium text-gray-700 mb-2">
              NFT ID *
            </label>
            <input
              type="number"
              id="nftId"
              value={formData.nftId}
              onChange={(e) => updateField('nftId', e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.nftId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.nftId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.nftId}</p>
            )}
            {isDebouncing && formData.nftId && (
              <p className="mt-1 text-xs text-gray-500">Waiting for input to stop...</p>
            )}
          </div>

          {/* Token Info Display */}
          {formData.nftId && (loadingTokenInfo || tokenInfo) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {loadingTokenInfo ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                  <p className="text-sm text-gray-600">Loading token info...</p>
                </div>
              ) : tokenInfo ? (
                <div className="space-y-3">
                  {/* Image */}
                  {tokenInfo.metadata?.image && (
                    <div className="w-full max-w-xs mx-auto">
                      <img
                        src={tokenInfo.metadata.image}
                        alt={tokenInfo.metadata.name || `Token #${formData.nftId}`}
                        className="w-full h-auto rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Title */}
                  {tokenInfo.metadata?.name ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{tokenInfo.metadata.name}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Token ID: #{formData.nftId}</p>
                      <p className="text-xs text-gray-500 mt-1">Metadata not available for this token</p>
                    </div>
                  )}

                  {/* Balance */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Your Balance:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tokenInfo.balance.toString()}
                    </span>
                  </div>

                  {tokenInfo.balance === 0n && (
                    <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                      You don't own any of this token. Make sure you have the correct token ID.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Could not fetch token info.</p>
                  <p className="text-xs text-gray-500">
                    The token ID might be invalid, or the contract might not support metadata queries. 
                    You can still proceed if you know the token ID is correct.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="initialNFTBalance" className="block text-sm font-medium text-gray-700 mb-2">
              Initial NFT Balance *
            </label>
            <input
              type="number"
              id="initialNFTBalance"
              step="1"
              value={formData.initialNFTBalance}
              onChange={(e) => updateField('initialNFTBalance', e.target.value)}
              placeholder={tokenInfo ? tokenInfo.balance.toString() : "10"}
              min="1"
              max={tokenInfo ? tokenInfo.balance.toString() : undefined}
              className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.initialNFTBalance ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.initialNFTBalance && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.initialNFTBalance}</p>
            )}
            {tokenInfo && tokenInfo.balance > 0n && (
              <p className="mt-1 text-xs text-gray-500">
                Maximum: {tokenInfo.balance.toString()} (your balance)
              </p>
            )}
          </div>
        </>
      )}

      {/* ERC20: Initial Token Balance */}
      {formData.paymentToken === 'ERC20' && (
        <div>
          <label htmlFor="initialTokenBalance" className="block text-sm font-medium text-gray-700 mb-2">
            Initial Token Balance ({erc20Symbol || 'Tokens'})
          </label>
          <input
            type="number"
            id="initialTokenBalance"
            step="0.0001"
            value={formData.initialTokenBalance}
            onChange={(e) => updateField('initialTokenBalance', e.target.value)}
            placeholder="0"
            className={`w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.initialTokenBalance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.initialTokenBalance && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.initialTokenBalance}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || !isConnected}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
            isSubmitting || !isConnected
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Creating Pool...' : isConnected ? 'Create Pool' : 'Connect Wallet to Continue'}
        </button>
      </div>
    </form>
  )
}

