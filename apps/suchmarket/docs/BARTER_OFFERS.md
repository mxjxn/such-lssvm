# Barter offers — design doc (post-launch)

**Status:** Design only. No implementation in this phase.  
**Product name:** **Barter offers** (a barter NFT platform inside such.market — not a general barter economy).

**Settlement:** [Seaport 1.6](https://github.com/ProjectOpenSea/seaport) canonical deployment on **Ethereum (1)**, **Base (8453)**, and **Base Sepolia (84532)**:

| Contract | Address (same on these chains) |
| --- | --- |
| Seaport 1.6 | `0x0000000000000068F116a894984e2DB1123eB395` |
| ConduitController | `0x00000000F9490004C11Cef243f5400493c00Ad63` |

Orders are **EIP-712 signed** and fulfilled on-chain via Seaport; such.market hosts the **off-chain order book**, matching UI, and indexer integration.

---

## 1. Product placement vs pools & auctions

| Surface | Mechanism | User intent |
| --- | --- | --- |
| **Pools** | LSSVM + VeryFastRouter | Buy/sell NFTs against pool liquidity (AMM pricing). |
| **Auctions** | cryptoart.studio marketplace contract | Timed listings, bids, settlement to seller. |
| **Barter offers** | Seaport 1.6 | Peer offers: “I give bundle A for bundle B” (no pool, no auction clock unless added via zone/expiry). |

**Nav (proposed):** `Explore` · `Pools` · `Auctions` · **Barter offers** · `Create` (stays thin; deep-links to studio where needed).

**Flows:**

- **Make offer:** Connect wallet → build offer bundle + want bundle → sign Seaport order → POST to API → appears under **My offers**.
- **Fill offer:** Browse **All offers** or **Offers you can fill** → review bundle match → single Seaport `fulfill` / `fulfillAdvanced` tx (taker may counter-sign if required by order type).
- **Counteroffer:** From offer detail → **Counter** → new bundle + new signature → stored with `parent_offer_id` → thread in UI.
- **Cross-links:** Pool/collection pages show “Open barter offers” for that contract; auction pages do not mix settlement paths (auction stays on marketplace contract).

---

## 2. Offer types (all supported, per Max)

### 2.1 Bundle-for-bundle

Both sides are Seaport **offer** and **consideration** item arrays. Supported item types:

| Asset | Seaport item type | Notes |
| --- | --- | --- |
| ETH | `NATIVE` / amount in consideration or offer | WETH path avoided on Base where possible; document chain preference. |
| ERC-20 | `ERC20` | Amount + `token` |
| ERC-721 | `ERC721` | Specific `identifier` or criteria (below) |
| ERC-1155 | `ERC1155` | `identifier` + `startAmount` / `endAmount` |

**Order shape:** `contract` = Seaport 1.6, `offer` = what offerer gives, `consideration` = what offerer wants (plus optional fee item — §8). Taker fulfills by supplying consideration items (NFTs/tokens/ETH) in the fulfillment call.

### 2.2 Criteria-based “wants” (and gives)

| Want pattern | Seaport encoding | such.market UI |
| --- | --- | --- |
| **Any token in collection** | Offer or consideration item: `itemType` ERC721/ERC1155 **with criteria**, `identifierOrCriteria` = `0` (collection-wide) or contract-specific rules per Seaport spec | “Any from collection X” |
| **One of a set of token IDs** | Merkle root in `identifierOrCriteria`; fulfillment includes **proof** | “One of IDs {…}” or uploaded allowlist → we build merkle root client- or server-side |
| **Traits (feasibility)** | **Not native in Seaport 1.6.** Feasible approach: (1) **metadata indexer** resolves trait → token ID set → **merkle root** over IDs (same as ID set); (2) refresh root when metadata or supply changes; (3) cap collection size / use lazy merkle updates. **V1:** collection-wide + explicit ID sets; **V1.5:** trait → merkle pipeline. | “Has trait T” = derived ID set |

Criteria apply to **either side** (e.g. “I offer any CryptoArt # from this merkle set” or “I want any token from collection Y”).

### 2.3 Partial fills

- Order field: `allowPartialFills: true` when user opts in; otherwise full fill only.
- UI: toggle **“Allow partial fill”**; show remaining amounts after fractional fulfillment (track via Seaport order hash + `numerator`/`denominator` on 1155/ERC20 legs).
- Fulfillment: `fulfillAdvanced` / partial fulfillment API per Seaport 1.6 docs; indexer listens to `OrderFulfilled` and updates `filled_amounts` in Postgres.

### 2.4 Counteroffers

- **On-chain:** Counter = **new** signed order (new salt, nonce); no Seaport parent pointer.
- **Off-chain:** `barter_offers.parent_offer_id` (nullable FK), `root_offer_id` for threading, `status` (`open` \| `countered` \| `superseded` \| `filled` \| `cancelled` \| `expired`).
- UX: Offer detail shows chain of counters; maker can accept a counter by filling the counter-order; original order marked `superseded` when maker explicitly replaces or cancels.

---

## 3. Dashboard: “Offers you can fill”

**Goal:** Logged-in user sees offers whose **want** side their wallet can satisfy (holdings + criteria + partial state).

### 3.1 Holdings index (extends existing RPC indexer)

New tables + cron job (same Postgres as `pools` / `marketplace_listings`):

1. **Global / subscribed wallets:** Index `Transfer` (ERC-721/1155), `Transfer` (ERC-20), native balance snapshots for wallets that (a) posted offers, (b) connected in last N days (opt-in list in DB), or (c) explicit “watch my wallet” — **no full-chain wallet crawl**.

2. **Tables (sketch):** `wallet_balances_erc20`, `wallet_nfts_721`, `wallet_nfts_1155` — `(chain_id, wallet, token, token_id, amount, updated_at)`.

3. **Invalidation:** On each indexer tick, process new logs since cursor; on `Transfer`, update balances; on offer **cancel/expiry/fill**, remove from match set; before fill CTA, **re-validate** via RPC `balanceOf` / `ownerOf` (stale index guard).

### 3.2 Want-side denormalization

`barter_offer_wants` — one row per atomic want leg, flattened from signed order:

- `offer_id`, `chain_id`, `item_type`, `token`, `token_id` (nullable), `criteria_root` (nullable), `amount_min`, `amount_max`, `partial_ok`.

### 3.3 Match query (simplified)

For wallet `W`:

```sql
-- Pseudologic: specific ID wants
SELECT o.* FROM barter_offers o
JOIN barter_offer_wants w ON w.offer_id = o.id
JOIN wallet_nfts_721 h ON h.chain_id = w.chain_id AND h.wallet = $W
  AND h.token = w.token AND h.token_id = w.token_id
WHERE o.status = 'open' AND o.expires_at > now();

-- Criteria / merkle: candidate filter in SQL (collection + root), then verify proof in app worker or at fill time
```

**Performance:** Partial indexes on `(chain_id, status, expires_at)`; materialized view `offer_match_candidates(chain_id, wallet, offer_id)` refreshed post-sync for connected users only.

---

## 4. Off-chain order book

| Concern | Approach |
| --- | --- |
| **Storage** | Postgres: full EIP-712 struct + signature bytes + `order_hash`, `chain_id`, `offerer`, timestamps, status, JSON mirror of offer/consideration for API speed. |
| **API routes (sketch)** | `POST /api/barter/offers` (create signed), `GET /api/barter/offers`, `GET /api/barter/offers/:id`, `GET /api/barter/offers/match?wallet=`, `POST /api/barter/offers/:id/cancel` (records cancel + on-chain `cancel` tx hash), `POST /api/barter/counters`, `GET /api/barter/offers/:id/thread`. |
| **Validation on ingest** | Recover signer = offerer; domain matches chain + Seaport 1.6; `counter` matches on-chain `getCounter(offerer)` (RPC); `startTime`/`endTime` sane; zone address allowed list (future). |
| **Fulfillability** | Background job + pre-fill RPC: approvals/conduit, balances, not cancelled, not fully filled, `block.timestamp` within window. Expose `fulfillable: boolean` + `reason` on read API. |
| **Cancellation** | On-chain `incrementCounter` or order-specific cancel; store `cancel_tx`, set `status=cancelled`; hide from match index immediately. |
| **Nonce / counter** | Seaport **counter** per offerer (not JSON nonce); UI reads `getCounter` before sign; after cancel/increment, reject stale signatures. |

**Source of truth:** On-chain Seaport state wins on conflict; DB is cache for browse/match.

---

## 5. Approval UX

| Goal | Design |
| --- | --- |
| **One approval per collection** | Recommend **such.market conduit** (deployed via `ConduitController`, Max-owned) — users `setApprovalForAll(collection, conduit)` once per chain. |
| **Conduit choice** | Default: platform conduit. Power users: “use existing OpenSea conduit” only if we explicitly support that conduit key (document security tradeoff). |
| **ERC-20** | `approve(seaport, amount)` or max; batch UI “approve all tokens in this offer”. |
| **ETH** | No approval; offerer/taker sends value in fulfillment. |
| **Pain reduction** | Pre-offer **readiness panel**: green/yellow per asset; link to single multicall approve tx where possible; persist “approved collections” in localStorage + optional server flag (not authority). |

---

## 6. Zones & future conditions (forward-looking)

Seaport **zone** on the order can enforce extra rules at fill time:

| Condition | Zone pattern |
| --- | --- |
| Expiry / time windows | Already in order `startTime`/`endTime`; zone optional for stricter clocks. |
| Allowlisted takers | Custom zone: `authorizeOrder` / `validateOrder` only passes for `fulfiller ∈ allowlist`. |
| Restricted resale / hold period | Zone tied to transfer hook or off-chain policy (heavy); defer. |
| such.market fee enforcement | Zone + fee item in consideration (§8). |

**Phase 1:** `zone = address(0)` (open fulfillment). **Phase 4:** deploy `SuchMarketBarterZone` — allowlist + optional “studio only” takers for curated barter.

---

## 7. DB schema sketch

```sql
-- Orders (off-chain book)
CREATE TABLE barter_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_id INT NOT NULL,
  order_hash TEXT NOT NULL UNIQUE,
  offerer TEXT NOT NULL,
  counterparty TEXT,           -- optional restrict (rare)
  seaport_address TEXT NOT NULL,
  zone TEXT,
  salt TEXT NOT NULL,
  counter BIGINT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  allow_partial_fills BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL,
  parent_offer_id UUID REFERENCES barter_offers(id),
  root_offer_id UUID REFERENCES barter_offers(id),
  signature BYTEA NOT NULL,
  order_json JSONB NOT NULL,   -- full Seaport order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancel_tx TEXT,
  fill_tx TEXT
);

CREATE TABLE barter_offer_items (
  id BIGSERIAL PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES barter_offers(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('offer', 'consideration')),
  item_type SMALLINT NOT NULL,
  token TEXT NOT NULL,
  identifier NUMERIC,
  criteria_root TEXT,
  start_amount NUMERIC NOT NULL,
  end_amount NUMERIC NOT NULL,
  sort_index INT NOT NULL
);

CREATE TABLE barter_offer_wants (
  offer_id UUID NOT NULL REFERENCES barter_offers(id) ON DELETE CASCADE,
  -- denormalized want legs for matching (mirror consideration or offer side per "who fills")
  ...
);

CREATE TABLE barter_fills (
  id BIGSERIAL PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES barter_offers(id),
  filler TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  numerator INT,
  denominator INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Holdings (indexer extension)
CREATE TABLE wallet_nfts_721 (...);
CREATE TABLE wallet_nfts_1155 (...);
CREATE TABLE wallet_balances_erc20 (...);
CREATE TABLE wallet_watchlist (chain_id INT, wallet TEXT, PRIMARY KEY (chain_id, wallet));

CREATE INDEX idx_barter_offers_open ON barter_offers (chain_id, status, end_time);
CREATE INDEX idx_barter_offer_items_token ON barter_offer_items (chain_id, token, identifier);
```

`indexer_cursors` gains keys e.g. `seaport_order_fulfilled`, `wallet_transfers_721`.

---

## 8. Fees

- **Model:** Additional **consideration** item (ERC-20 or ETH) payable to **such.market fee recipient**, configured per chain (env / admin config — not in this doc’s scope).
- **Who pays:** Default — **taker** (filler) pays fee on top of want bundle, or **offerer** reduces consideration via UI toggle (encoded in order at sign time).
- **Amount:** Basis points on “notional” — for NFT-NFT barter, use user-declared **floor estimate** or USD input for display only; on-chain fee is fixed token amount from builder.
- **Config table:** `barter_fee_config(chain_id, fee_recipient, bps, min_fee_wei, enabled)` — Max sets recipient addresses.

Seaport does not extract protocol fee automatically; fee is enforced as an explicit consideration leg (and optionally zone validation later).

---

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| Stale match index leads to failed txs | Re-validate balances immediately before `fulfill`; show “last indexed at”. |
| Criteria merkle wrong / outdated | Version merkle roots; show root hash in UI; reject fills when proof fails. |
| Trait wants misleading | Label as “ID set derived from metadata”; refresh job + disclaimer. |
| Partial fill accounting bugs | Index `OrderFulfilled` carefully; unit tests against Seaport test vectors. |
| Conduit / approval phishing | Only promote such.market conduit address in UI; block unknown zones in v1 ingest. |
| Legal / sanctions | Off-chain policy + optional zone allowlist (Max/compliance). |
| RPC load | Bound wallet watchlist; no chain-wide holdings scan. |

---

## 10. Phased build plan

| Phase | Scope | Depends on |
| --- | --- | --- |
| **0** | This doc + ROADMAP link | — |
| **1a** | Fixed bundle ↔ bundle, all-or-nothing, sign + POST + list + fulfill, ETH/721/1155/20 | Postgres, Seaport SDK, conduit address |
| **1b** | Cancel, counter read, basic fees (consideration leg) | Fee recipient per chain |
| **2** | Criteria (collection + ID merkle), partial fills | Merkle builder, `fulfillAdvanced` |
| **3** | Counteroffers + thread UI; “Offers you can fill” v1 | Holdings tables, match job |
| **4** | Trait → merkle pipeline; custom zone (allowlist, taker restrictions) | Metadata indexer, zone deploy (**Max**) |

---

## 11. Open questions for Max

1. **Conduit:** Deploy a dedicated such.market conduit on each chain, or reuse an existing conduit key?
2. **Fee recipient & default bps** per chain (ETH vs USDC on Base)?
3. **Who pays fee** by default — offerer or taker?
4. **Wallet indexing scope:** Only connected wallets + offerers, or allow “email me matches” with watchlist?
5. **Counters:** Anyone can counter, or only users who can already fill the want side?
6. **WETH:** Require WETH for ETH-denominated legs on all chains, or native ETH only where Seaport allows?
7. **Trait wants:** Minimum metadata source (studio API vs OpenSea-style indexer vs on-chain only)?
8. **Zone deploy:** Timeline for allowlisted-taker zone vs shipping zone=0?
9. **Legal:** Any barter offer types to disallow (e.g. unregistered securities tokens)?
10. **Brand:** Tab name “Barter offers” vs “Trade” to avoid confusion with pool **Trade** panel?

---

## References

- Seaport 1.6 repo & deployment table: [ProjectOpenSea/seaport](https://github.com/ProjectOpenSea/seaport)
- Existing indexer: `apps/suchmarket/indexer/schema/001_initial.sql`
- ROADMAP: [ROADMAP.md](./ROADMAP.md)