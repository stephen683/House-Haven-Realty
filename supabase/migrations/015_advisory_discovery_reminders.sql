-- Migration 015 (Phase 9) — discovery-call reminder columns
--
-- Phase 9 introduces the free 15-minute discovery-call flow alongside
-- the paid Decision Brief. Discovery calls fire reminders at 24h and 1h
-- (paid Briefs already use 48h and 2h on the existing columns). Adding
-- two columns is non-destructive and keeps the cron logic simple — one
-- column per reminder window.
--
-- Apply via Supabase MCP. Idempotent.
-- Target: 2026-05-08

ALTER TABLE public.advisory_bookings
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_1h_sent_at timestamptz;
