'use client'

import { GradientHeader } from '../components/GradientHeader'
import { TerminalCard } from '../components/TerminalCard'
import { TerminalLink } from '../components/TerminalLink'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <GradientHeader className="text-5xl mb-4">
          LSSVM Development Suite
        </GradientHeader>
        <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
          Comprehensive documentation for the LSSVM (sudoAMM v2) protocol, 
          including smart contracts, Farcaster miniapp, Graph Protocol subgraph, 
          and deployment tooling.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        <TerminalCard title="PROTOCOL CONTRACTS">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            Full implementation of sudoAMM v2 with ERC721/ERC1155 support, 
            royalty handling, and advanced bonding curves.
          </p>
          <TerminalLink href="/contracts" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>

        <TerminalCard title="FARCASTER MINIAPP">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            User-friendly interface for trading NFTs through liquidity pools 
            with shopping cart, real-time quotes, and transaction tracking.
          </p>
          <TerminalLink href="/miniapp" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>

        <TerminalCard title="GRAPH PROTOCOL INDEXER">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            Subgraph for indexing pool events, swaps, deposits, and withdrawals 
            on Base Mainnet and testnet.
          </p>
          <TerminalLink href="/indexer" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>

        <TerminalCard title="DEPLOYMENT SCRIPTS">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            Comprehensive deployment tooling for Base Mainnet, testnet, 
            and local development environments.
          </p>
          <TerminalLink href="/deployment" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>

        <TerminalCard title="GETTING STARTED">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            Quick start guide to set up your development environment and 
            start building with LSSVM.
          </p>
          <TerminalLink href="/getting-started" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>

        <TerminalCard title="PROTOCOL OVERVIEW">
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            LSSVM is built directly on top of the original sudoswap sudoAMM v2 protocol, developed entirely by the sudoswap team. This project does not modify or change the underlying protocol in any way—full credit goes to sudoswap and their authors for creating sudoAMM v2 (licensed under AGPL-3.0).
          </p>
          <TerminalLink href="/protocol" className="text-sm uppercase">
            Learn more →
          </TerminalLink>
        </TerminalCard>
      </div>

      {/* Quick Links */}
      <TerminalCard className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase" style={{ color: 'var(--color-primary)' }}>
          Quick Links
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TerminalCard className="text-center">
            <div className="font-semibold mb-1 uppercase" style={{ color: 'var(--color-primary)' }}>
              GitHub Repository
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
              View source code
            </div>
            <TerminalLink href="https://github.com/mxjxn/such-lssvm" external className="text-xs mt-2 block">
              Open →
            </TerminalLink>
          </TerminalCard>
          
          <TerminalCard className="text-center">
            <div className="font-semibold mb-1 uppercase" style={{ color: 'var(--color-primary)' }}>
              sudoswap Docs
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
              Protocol documentation
            </div>
            <TerminalLink href="https://docs.sudoswap.xyz/" external className="text-xs mt-2 block">
              Open →
            </TerminalLink>
          </TerminalCard>
          
          <TerminalCard className="text-center">
            <div className="font-semibold mb-1 uppercase" style={{ color: 'var(--color-primary)' }}>
              Base Mainnet
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
              View contracts
            </div>
            <TerminalLink href="https://basescan.org/address/0xF6B4bDF778db19DD5928248DE4C18Ce22E8a5f5e" external className="text-xs mt-2 block">
              Open →
            </TerminalLink>
          </TerminalCard>
          
          <TerminalCard className="text-center">
            <div className="font-semibold mb-1 uppercase" style={{ color: 'var(--color-primary)' }}>
              Base Testnet
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
              Test environment
            </div>
            <TerminalLink href="https://sepolia.basescan.org/address/0x372990Fd91CF61967325dD5270f50c4192bfb892" external className="text-xs mt-2 block">
              Open →
            </TerminalLink>
          </TerminalCard>
        </div>
      </TerminalCard>

      {/* Related Projects */}
      <div className="mt-16">
        <TerminalCard className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center uppercase" style={{ color: 'var(--color-primary)' }}>
            Related Projects
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 pl-6" style={{ borderColor: 'var(--color-secondary)' }}>
              <h3 className="text-xl font-bold mb-2 uppercase" style={{ color: 'var(--color-secondary)' }}>
                Cryptoart Monorepo
              </h3>
              <p className="mb-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
                A comprehensive monorepo containing all projects related to the Cryptoart channel on Farcaster, 
                including creator tools, auctionhouse functionality, and NFT curation.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold uppercase" style={{ color: 'var(--color-text)' }}>
                  Key Projects:
                </p>
                <ul className="text-sm space-y-1 ml-4" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                  <li>• <strong>Cryptoart Studio App</strong> - Creator tools and subscription management</li>
                  <li>• <strong>Auctionhouse App</strong> - Auction functionality for NFTs</li>
                  <li>• <strong>Such Gallery</strong> - NFT curation and gallery with referral system</li>
                  <li>• <strong>Creator Core Contracts</strong> - ERC721/ERC1155 NFT framework</li>
                  <li>• <strong>Auctionhouse Contracts</strong> - Marketplace smart contracts</li>
                  <li>• <strong>Unified Indexer</strong> - Bridges LSSVM pools and Auctionhouse listings</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase" style={{ color: 'var(--color-text)' }}>
                  Integration:
                </p>
                <ul className="text-sm space-y-1 ml-4" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                  <li>• Uses <code style={{ backgroundColor: 'var(--color-background)', border: `1px solid var(--color-border)`, padding: '0.125rem 0.25rem' }}>@lssvm/abis</code> package for LSSVM contract interactions</li>
                  <li>• Unified indexer provides single interface for querying pools and auctions</li>
                  <li>• LSSVM pool creation integrated into collection deployment flow</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <TerminalLink href="https://github.com/mxjxn/cryptoart-studio" external className="font-semibold text-sm uppercase">
                  View Repository →
                </TerminalLink>
                <TerminalLink href="https://github.com/mxjxn/cryptoart-studio/blob/main/LSSVM_INTEGRATION.md" external className="font-semibold text-sm uppercase">
                  Integration Guide →
                </TerminalLink>
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>

      {/* Attribution */}
      <div className="mt-16 text-center">
        <TerminalCard className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 uppercase" style={{ color: 'var(--color-primary)' }}>
            Attribution
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-bold text-lg mb-2 uppercase" style={{ color: 'var(--color-primary)' }}>
                From sudoswap
              </h3>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                <li>• LSSVM protocol contracts</li>
                <li>• Protocol architecture & design</li>
                <li>• Security audits & testing</li>
                <li>• Original documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 uppercase" style={{ color: 'var(--color-secondary)' }}>
                From mxjxn
              </h3>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                <li>• Farcaster miniapp</li>
                <li>• Graph Protocol subgraph</li>
                <li>• Deployment scripts & tooling</li>
                <li>• Monorepo structure & docs</li>
              </ul>
            </div>
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}

