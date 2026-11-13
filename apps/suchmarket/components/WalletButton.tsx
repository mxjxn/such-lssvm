'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="sm-btn-secondary font-mono text-xs"
        title="Disconnect"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </button>
    )
  }

  const injected = connectors.find((c) => c.id === 'injected') || connectors[0]

  return (
    <button
      type="button"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected })}
      className="sm-btn-primary"
    >
      {isPending ? 'Connecting…' : 'Connect wallet'}
    </button>
  )
}
