# LSSVM pool indexer (optional)

Lightweight Postgres indexer for **factory pool creation** and **spot/delta** refresh on configured chains. It does not index marketplace or auction contracts.

## Setup

```bash
psql "$DATABASE_URL" -f apps/web/indexer/schema/001_initial.sql
```

## Run sync

```bash
DATABASE_URL=... pnpm --filter @lssvm/web run indexer:sync
```

Set `INDEXER_FACTORY_START_BLOCK_<chainId>` to your factory deployment block for faster backfill.