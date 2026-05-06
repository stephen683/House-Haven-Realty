-- Migration 011 (Phase 1.5b cosmetic) — enable RLS on PostGIS spatial_ref_sys
--
-- ⚠️  REQUIRES MANUAL APPLY VIA SUPABASE DASHBOARD SQL EDITOR.
--
-- The Supabase MCP `apply_migration` endpoint runs as a less-privileged role
-- that does not own `spatial_ref_sys`. PostGIS installs the table as owned by
-- `supabase_admin` and PostgreSQL requires the table owner (or a superuser)
-- to ALTER … ENABLE ROW LEVEL SECURITY. MCP attempt on 2026-05-06 returned:
--   "ERROR: 42501: must be owner of table spatial_ref_sys"
--
-- Stephen: paste the SQL below into the Supabase Dashboard SQL Editor for
-- project `eefqcgetyxdrvchkwhrq`. The Dashboard runs as the postgres
-- superuser context and will succeed.
--
-- Why this migration exists at all: the Supabase advisor flags
-- spatial_ref_sys as RLS-disabled on every list_tables call. The table is
-- the standard PostGIS spatial reference system catalog (8500 SRID rows
-- ship with the PostGIS extension) and is read-only in normal application
-- use. Enabling RLS with a public-read policy preserves PostGIS spatial
-- query functionality while clearing the advisor warning. The
-- cosmetic-but-correct fix matters so real warnings later are not
-- desensitized by permanent advisor noise.
--
-- Notes after apply:
--  - superuser/postgres role bypasses RLS; manual SRID maintenance via the
--    Supabase SQL Editor will still work.
--  - anon / authenticated roles get SELECT only — what PostGIS needs.
--  - DROP POLICY IF EXISTS / CREATE POLICY for idempotency.

ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS spatial_ref_sys_public_read ON public.spatial_ref_sys;
CREATE POLICY spatial_ref_sys_public_read
  ON public.spatial_ref_sys FOR SELECT USING (true);
