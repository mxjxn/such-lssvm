import Link from 'next/link'

/**
 * Placeholder — auction house moves under such.market later.
 * Nav and routing reserved so studio/social can link here early.
 */
export default function AuctionsPage() {
  return (
    <div className="sm-container py-16 max-w-xl">
      <p className="text-xs uppercase tracking-[0.14em] text-soft mb-2">Coming soon</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink">Auctions</h1>
      <p className="mt-4 text-mute text-sm leading-relaxed">
        The auction house will live here alongside bonding-curve pools — one sales home for the
        cryptoart ecosystem. Timed lots, English auctions, and studio launch paths will share this
        nav.
      </p>
      <Link href="/explore" className="sm-btn-primary inline-flex mt-8">
        Explore pools meanwhile
      </Link>
    </div>
  )
}
