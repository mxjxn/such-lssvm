# Barter offers — design doc (post-launch)

**Status:** Design only. No implementation in this phase.  
**Product name:** **Barter** in nav; in copy use **barter offers** / **barter NFT platform** (not a general barter economy).

**Settlement:** [Seaport 1.6](https://github.com/ProjectOpenSea/seaport) canonical deployment on **Ethereum (1)**, **Base (8453)**, and **Base Sepolia (84532)**:

| Contract | Address (same on these chains) |
| --- | --- |
| Seaport 1.6 | `0x0000000000000068F116a894984e2DB1123eB395` |
| ConduitController | `0x00000000F9490004C11Cef243f5400493c00Ad63` |

Orders are **EIP-712 signed** and fulfilled on-chain via Seaport; such.market hosts the **off-chain order book**, matching UI, and indexer integration.

---

## Product decisions (Max)

| # | Decision |
| --- | --- |
| 1 | **Dedicated such.market conduit** on each supported chain (deploy via `ConduitController`; sole conduit promoted in UI). |
| 2 | **Fee recipient & bps:** TBD at launch config; likely **aligned with LSSVM protocol fee settings** (same recipient / similar bps). |
| 3 | **Fee payer:** **Taker (filler) pays by default**; UI may allow offerer-pays variant when building the order. |
| 4 | **Holdings index at launch:** **Connected wallets + offerers only** (no global watchlist crawl). |
| 5 | **Counters:** **Anyone** can post a counteroffer. |
| 6 | **ETH legs:** Use **WETH** (ERC-20), not native ETH, for all chains in v1. |
| 7 | **Trait wants:** **Later phase**; metadata from **our own indexed metadata** → token ID set → merkle (not third-party APIs). |
| 8 | **Zones:** **Launch with `zone = address(0)`**. Custom zones ship **later**, together with **barter metadata standards** for richer offer types. |
| 9 | **Compliance:** Required — see §Compliance. **Legal review before expanding** allowed barter types beyond Phase 1. |
| 10 | **Nav label:** **Barter** (not “Trade” / not “Barter offers” in the tab). |

---

## Gradual rollout

**Principle:** Introduce barter **types and metadata standards gradually** so users are not overwhelmed. Each phase adds UI labels, validation rules, and docs for how offers are described off-chain (`order_json` metadata schema version).

| Stage | User-facing scope |
| --- | --- |
| **Phase 1 (launch)** | **NFT-for-NFT / token bundles only** — specific ERC-721 / ERC-1155 IDs plus ERC-20 amounts; **WETH** for ETH-denominated value. All-or-nothing fills. |
| **Later** | Collection-wide criteria, ID merkle sets, partial fills, trait wants (our indexer), custom zones, and additional asset/policy types **after** legal sign-off per stage. |

Downstream sections describe the **full target**; implementation tracks the table above unless a phase note says otherwise.

---

## 1. Product placement vs pools & auctions

| Surface | Mechanism | User intent |
| --- | --- | --- |
| **Pools** | LSSVM + VeryFastRouter | Buy/sell NFTs against pool liquidity (AMM pricing). |
| **Auctions** | cryptoart.studio marketplace contract | Timed listings, bids, settlement to seller. |
| **Barter** | Seaport 1.6 | Peer barter offers: “I give bundle A for bundle B”. |

**Nav:** `Explore` · `Pools` · `Auctions` · **Barter** · `Create` (thin; studio deep-links where needed).

**Flows:**

- **Make offer:** Connect wallet → build offer bundle + want bundle → sign Seaport order → POST to API → **My offers**.
- **Fill offer:** **All offers** or **Offers you can fill** → `fulfill` tx via such.market conduit approvals.
- **Counteroffer:** **Anyone** may **Counter** from offer detail → new signed order, `parent_offer_id` thread.
- **Cross-links:** Collection pages show open barter offers; auctions stay on marketplace contract only.

---

## 2. Offer types (target; rollout per §Gradual rollout)

### 2.1 Bundle-for-bundle

Seaport **offer** and **consideration** item arrays:

| Asset | Seaport item type | Notes |
| --- | --- | --- |
| **WETH** | `ERC20` | **All “ETH value” legs use WETH** (per Max). Wrap/unwrap UX in flow. |
| ERC-20 | `ERC20` | Amount + token |
| ERC-721 | `ERC721` | Specific `identifier` or criteria (post–Phase 1) |
| ERC-1155 | `ERC1155` | `identifier` + amounts |

**Phase 1:** Specific IDs + ERC-20/WETH only (no criteria, no partial).

### 2.2 Criteria-based “wants” (post–Phase 1)

| Want pattern | Seaport encoding | When |
| --- | --- | --- |
| Any token in collection | Criteria item, collection-wide | Phase 2+ |
| Set of token IDs | Merkle root + proof | Phase 2+ |
| **Traits** | Our **indexed metadata** → ID set → merkle root; refresh when index updates | **Later phase** (after metadata indexer) |

### 2.3 Partial fills (post–Phase 1)

`allowPartialFills` optional; `fulfillAdvanced`; track fill fraction in `barter_fills`. Not in Phase 1.

### 2.4 Counteroffers

- **On-chain:** New signed order (new salt); no Seaport parent link.
- **Off-chain:** `parent_offer_id`, `root_offer_id`, status thread.
- **Policy:** **Any connected user may counter** (not limited to wallets that can fill the want side).

---

## 3. Dashboard: “Offers you can fill”

### 3.1 Holdings index (extends RPC indexer)

**At launch:** Index balances only for (**a**) wallets that **created a barter offer** on such.market and (**b**) wallets **currently connected** (session-scoped registration in `wallet_watchlist`). **No** full-chain or arbitrary address crawl.

Tables: `wallet_balances_erc20`, `wallet_nfts_721`, `wallet_nfts_1155`, `wallet_watchlist`.

**Invalidation:** Transfer logs since cursor; cancel/expiry/fill; **re-validate** via RPC before fill CTA.

### 3.2–3.3 Want denormalization & match

`barter_offer_wants` for SQL prefilter; merkle/criteria verification at fill time when enabled. Match materialization for **connected** wallets after indexer sync.

---

## 4. Off-chain order book

| Concern | Approach |
| --- | --- |
| **Storage** | Postgres: EIP-712 + signature + `order_hash`, status, `order_json`, metadata schema version. |
| **API routes (sketch)** | `POST/GET /api/barter/offers`, `match`, `cancel`, `counters`, `thread`. |
| **Validation** | Signer, counter, times; **ingest rejects unknown zones** until custom zones launch; contract blocklist (§Compliance). |
| **Fulfillability** | Conduit + WETH/ERC-20 approvals, balances, not cancelled. |
| **Cancellation / counter** | On-chain counter increment; DB status. |

---

## 5. Approval UX

| Goal | Design |
| --- | --- |
| **One approval per collection** | **such.market conduit only** (per chain, Max deploys). `setApprovalForAll(collection, suchMarketConduit)`. |
| **WETH / ERC-20** | `approve(Seaport, …)` or max; batch in readiness panel. |
| **Pain reduction** | Pre-flight readiness; multicall where possible. |

No third-party conduit keys in product UI.

---

## 6. Zones & future conditions

**Launch:** `zone = address(0)` for all barter orders.

**Later:** Custom **SuchMarket** zone(s) ship with **barter metadata standards** (expiry extensions, allowlisted takers, fee enforcement). Not coupled to Phase 1.

---

## 7. DB schema sketch

(Unchanged structurally; add fields as needed for compliance/spam: `hidden_by_admin`, `reputation_tier`, `metadata_schema_version`.)

```sql
CREATE TABLE barter_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_id INT NOT NULL,
  order_hash TEXT NOT NULL UNIQUE,
  offerer TEXT NOT NULL,
  seaport_address TEXT NOT NULL,
  zone TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
  -- ... status, parent_offer_id, signature, order_json, fee_payer enum, etc.
);

CREATE TABLE barter_policy_blocklist (
  chain_id INT,
  contract_address TEXT,
  reason TEXT,
  PRIMARY KEY (chain_id, contract_address)
);

CREATE TABLE barter_reports (
  id BIGSERIAL PRIMARY KEY,
  offer_id UUID REFERENCES barter_offers(id),
  reporter TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

See §Anti-spam for `barter_wallet_mutes`, rate-limit audit table.

---

## 8. Fees

- **Consideration leg** to such.market **fee recipient** (WETH or ERC-20).
- **Recipient & bps:** **TBD**; config should **mirror LSSVM `protocolFeeRecipient` / multiplier** where practical (`barter_fee_config` per chain).
- **Default payer:** **Taker**; configurable at order build (offerer pays = encoded in consideration layout).
- On-chain fee is explicit in the signed order, not a Seaport protocol hook.

---

## 9. Compliance & disallowed items

Compliance is **in scope from day one**, even when Phase 1 types are narrow.

| Control | Description |
| --- | --- |
| **Contract blocklist** | Postgres + config: banned **token/NFT contract addresses** per chain; reject at API ingest and hide in list APIs. |
| **Category policy** | Disallowed categories (e.g. unregistered securities, sanction-linked assets, stolen/scam labels) — enumerated in internal policy doc; **legal review** before enabling new categories or ERC-20 barter beyond allowlist. |
| **Report** | UI **Report** on offer detail → `barter_reports`; moderation queue (off-chain). |
| **Admin hide/delist** | Admin flag `hidden` / `delisted` on `barter_offers`; hidden offers cannot be fulfilled via such.market UI/API (on-chain order may still exist until cancelled). |
| **Expansion gate** | **No new barter type or metadata standard** in production without **legal review** (traits, permissive ERC-20, partial fills, zones, etc.). |

Phase 1 reduces risk by limiting to **specific NFT IDs + allowlisted ERC-20/WETH** where policy requires.

---

## 10. Anti-spam

| Measure | Notes |
| --- | --- |
| **Dust filter** | Minimum notional per offer (WETH/allowlisted ERC-20 floor and/or NFT count rules); reject below threshold at API. |
| **Rate limits** | Per-wallet cap on **new offers / hour** (and counters if abusive); HTTP 429 + soft warn in UI. |
| **Default dashboard filters** | Hide offers from **unknown/low-reputation** wallets and **collections not on allowlist**; user toggle **“Show all offers”** (persisted). |
| **Mute / block** | Wallet can mute offerers; muted hidden from feed and match (per-user, stored server-side). |
| **Stake / deposit (later)** | Optional small **refundable deposit** on offer creation to raise cost of spam — design TBD, not Phase 1. |

Reputation and collection allowlists tie to studio/cryptoart.social curation over time.

---

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| Stale match index | Re-validate before `fulfill`. |
| Merkle / criteria errors | Version roots; fail closed on bad proofs. |
| Conduit phishing | Single official conduit address per chain in UI. |
| Compliance gaps | Blocklist + legal gate on type expansion (§9). |
| Spam / noise | §10 filters + rate limits. |
| RPC load | Connected + offerers only at launch. |

---

## 12. Phased build plan

| Phase | Scope |
| --- | --- |
| **0** | This doc + ROADMAP |
| **1** | **Barter** nav; NFT↔NFT/token bundles, WETH, dedicated conduit, zone=0, order book API, cancel, **anyone counters**, compliance v1 (blocklist, report, admin hide), anti-spam v1 (dust, rate limit, default filters), taker-pays fee leg (recipient/bps TBD), holdings for connected + offerers |
| **2** | Criteria (collection + ID merkle), partial fills |
| **3** | “Offers you can fill” polish; counter threads |
| **4** | Trait wants (our metadata indexer); custom zones + metadata standards |

---

## 13. Open questions for Max

1. **Fee numbers:** Final **bps** and whether barter always shares **exact** LSSVM `protocolFeeRecipient` per chain when those addresses exist.
2. **Phase 1 ERC-20 allowlist:** Which tokens besides WETH are allowed on Base / Ethereum at launch?
3. **Collection allowlist:** Who maintains the curated collection list for default dashboard filters (studio vs manual admin)?
4. **Moderation:** Process for `barter_reports` (SLA, roles) and linkage to on-chain cancel requests.
5. **Refundable deposit:** If pursued post-launch, amount, token, and refund conditions.
6. **Legal review checklist:** Sign-off template before enabling Phase 2+ features.

---

## References

- [ProjectOpenSea/seaport](https://github.com/ProjectOpenSea/seaport)
- `apps/suchmarket/indexer/schema/001_initial.sql`
- [ROADMAP.md](./ROADMAP.md)