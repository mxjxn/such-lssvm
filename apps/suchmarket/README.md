# Suchmarket

**Suchmarket** is the hyper-maximalist fine-art front end for the LSSVM protocol. It lives alongside the original `apps/miniapp` in this monorepo — same trading logic, an entirely new visual identity.

The miniapp remains unchanged. All redesign work happens here.

## Design direction

- Baroque / salon aesthetic: gilded frames, ornate corners, jewel tones
- Typography: Cinzel, Cormorant Garamond, Playfair Display, Italiana
- Palette: obsidian, imperial purple, burgundy, gold, champagne

## Run locally

From the monorepo root:

```bash
pnpm install
pnpm --filter @lssvm/suchmarket dev
```

Suchmarket runs on **port 3001** (miniapp uses the default 3000).

## Environment

Copy env vars from `apps/miniapp/ENV_VARS.md` into `apps/suchmarket/.env.local`:

```bash
NEXT_PUBLIC_ROUTER_ADDRESS_8453=0x...
NEXT_PUBLIC_FACTORY_ADDRESS_8453=0x...
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_IPFS_URL=https://your-ipfs-gateway.example.com
```

## Architecture

| Layer | Location | Notes |
|-------|----------|-------|
| Design system | `components/design/`, `app/globals.css` | Gilded frames, tokens, theme overrides |
| Shell | `SiteHeader`, `SiteFooter`, `PageChrome` | Salon chrome for all pages |
| Trading logic | `hooks/`, `lib/`, `contexts/`, `app/api/` | Copied from miniapp; update both when protocol changes |

## Future

- Extract shared `hooks/` + `lib/` into `packages/suchmarket-core` to avoid duplication
- Continue restyling trading components (`PoolDetails`, `Cart`, `CheckoutDialog`) beyond CSS overrides
