'use client'

import Link from 'next/link'
import { SAMPLE_AUCTIONS, type SampleAuction } from '@/lib/homeFixtures'

function AuctionCard({ auction, sample }: { auction: SampleAuction; sample?: boolean }) {
  return (
    <div className="relative border-b border-line last:border-0 py-4 first:pt-0 last:pb-0">
      {sample && (
        <span className="absolute top-0 right-0 text-[10px] uppercase tracking-wider text-soft">
          Sample
        </span>
      )}
      <p className="text-[11px] uppercase tracking-[0.1em] text-soft">{auction.lotLabel}</p>
      <p className="mt-1 font-display text-lg text-ink leading-snug">{auction.title}</p>
      <div className="mt-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-mute">
          Bid <span className="text-ink font-medium">{auction.currentBid}</span>
        </span>
        <span className="text-xs text-soft">{auction.endsIn} left</span>
      </div>
    </div>
  )
}

export function HomeListingsSection({ preview }: { preview: boolean }) {
  // No live auction data path yet — preview shows labeled samples; otherwise empty placeholder.
  const auctions = preview ? SAMPLE_AUCTIONS : []

  return (
    <section className="sm-container py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Featured auctions — wider */}
        <div className="lg:col-span-3">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">Featured auctions</h2>
              <p className="mt-1 text-sm text-mute">Timed lots from the auction house.</p>
            </div>
            <Link href="/auctions" className="text-sm text-forest hover:underline shrink-0">
              View all auctions
            </Link>
          </div>

          {preview && auctions.length > 0 && (
            <p className="mb-3 text-xs uppercase tracking-[0.12em] text-soft">
              Sample data · preview mode — not live lots
            </p>
          )}

          <div className="sm-card p-5 md:p-6">
            {auctions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-display text-lg text-ink">Auctions coming soon</p>
                <p className="mt-2 text-sm text-mute max-w-sm mx-auto leading-relaxed">
                  English auctions will list here beside pools. Browse the stub page for updates.
                </p>
                <Link href="/auctions" className="sm-btn-secondary inline-flex mt-6">
                  View all auctions
                </Link>
                {!preview && (
                  <p className="mt-4">
                    <Link href="/?preview=1" className="text-xs text-soft hover:text-mute">
                      Preview with sample lots
                    </Link>
                  </p>
                )}
              </div>
            ) : (
              <div>
                {auctions.map((a) => (
                  <AuctionCard key={a.id} auction={a} sample={preview} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create a listing — narrower */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-5">Create a listing</h2>
          <div className="sm-card p-5 md:p-6 h-full">
            <p className="text-sm text-mute leading-relaxed mb-5">
              List NFTs you already own. No minting or metadata edits here — those live in studio.
            </p>
            <ul className="space-y-3">
              <ListingOption
                href="/create"
                title="Pool"
                body="Bonding-curve liquidity. Always open to buy and sell."
                cta="Create pool"
              />
              <ListingOption
                href="/create/auction"
                title="Auction"
                body="Timed English auction for a piece you hold."
                cta="Coming soon"
                soon
              />
              <ListingOption
                href="/create/fixed-price"
                title="Fixed price"
                body="Set a single ask for one or more tokens."
                cta="Coming soon"
                soon
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function ListingOption({
  href,
  title,
  body,
  cta,
  soon,
}: {
  href: string
  title: string
  body: string
  cta: string
  soon?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg border border-line px-4 py-3.5 hover:border-ink/25 hover:bg-mist/50 transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-ink">{title}</p>
            <p className="mt-0.5 text-xs text-mute leading-relaxed">{body}</p>
          </div>
          <span
            className={`text-xs shrink-0 mt-0.5 ${soon ? 'text-soft uppercase tracking-wider' : 'text-forest'}`}
          >
            {cta}
          </span>
        </div>
      </Link>
    </li>
  )
}
