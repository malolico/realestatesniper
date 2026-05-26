-- =============================================================================
-- Founder System Phase 1A — seed 10 beta codes
-- Run AFTER founder_codes_schema.sql (or migration 20260526120000_founder_codes.sql)
--
-- Safe to re-run: skips rows that already exist (on conflict on code).
-- All codes start used=false. Redeem via future Edge Function / RPC (Phase 1B+).
-- =============================================================================

insert into public.founder_codes (code, used)
values
  ('RS-FOUNDER-001', false),
  ('RS-FOUNDER-002', false),
  ('RS-FOUNDER-003', false),
  ('RS-FOUNDER-004', false),
  ('RS-FOUNDER-005', false),
  ('RS-FOUNDER-006', false),
  ('RS-FOUNDER-007', false),
  ('RS-FOUNDER-008', false),
  ('RS-FOUNDER-009', false),
  ('RS-FOUNDER-010', false)
on conflict (code) do nothing;

-- Verify cohort inventory (optional):
-- select code, used, assigned_email, created_at from public.founder_codes order by code;
-- select count(*) filter (where not used) as remaining_spots from public.founder_codes;
