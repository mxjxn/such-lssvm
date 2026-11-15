import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export function SiteFooter() {
  return (
    <footer className="sm-footer-bar mt-auto">
      <div className="sm-container py-10 grid gap-6 md:grid-cols-2 text-sm text-white/85">
        <div>
          <p className="font-medium text-white">{CONFIG.APP_NAME}</p>
          <p className="mt-2 max-w-md leading-relaxed text-white/75">
            Reference UI for sudoAMM v2 (LSSVM): explore pools, trade on bonding curves, and create
            liquidity pairs. Deploy your own contracts and plug addresses in via environment variables.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <Link href="/explore" className="hover:text-white underline-offset-2 hover:underline">
            Explore pools
          </Link>
          <a
            href="https://github.com/sudoswap/lssvm"
            className="hover:text-white underline-offset-2 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            LSSVM protocol (sudoswap)
          </a>
          <a
            href="https://github.com/mxjxn/such.market"
            className="hover:text-white underline-offset-2 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            Canonical branded product: such.market
          </a>
        </div>
      </div>
    </footer>
  )
}