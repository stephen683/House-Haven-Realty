-- Migration 010 (Phase 1.5 cleanup) — drop the v1 valuation_requests table.
--
-- Why: the table was created in migration 001 to back the v1 /home-valuation
-- form. That page was deleted in Phase 0 (commit 6d4e21e — /value
-- consolidation), and migration 003 introduced cma_requests as the v2
-- replacement (richer schema: TCPA fields, estimate_low/mid/high, hubspot
-- contact id, page url, notification timestamp). The v1 table sat empty
-- (0 rows) with no remaining code consumers.
--
-- Apply via Supabase MCP. Idempotent (IF EXISTS).
-- Applied: 2026-05-06

DROP TABLE IF EXISTS public.valuation_requests CASCADE;
