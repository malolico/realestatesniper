-- =============================================================================
-- RealEstateSniper — Founder System Phase 1A
-- Table: founder_codes
--
-- Founder codes are ONE-TIME USE invitation codes for the private beta cohort.
-- The platform caps the beta at 10 founders (10 rows / 10 distinct codes).
-- When all 10 codes have used = true, the Founder entry button should disappear
-- from the UI (enforced in a future app + API layer — not wired in Phase 1A).
--
-- Run this script in the Supabase SQL editor or via migration tooling when ready.
-- Phase 1A: schema only — no frontend, Edge Functions, or RLS policies here yet.
-- =============================================================================

create table if not exists public.founder_codes (
  id uuid primary key default gen_random_uuid(),

  -- Unique invite code (e.g. RS-FOUNDER-001). One row per beta slot.
  code text not null,

  -- Optional pre-assignment to an investor email before redemption.
  assigned_email text,

  -- One-time redemption flag. Set true when a user successfully claims the code.
  used boolean not null default false,

  -- auth.users.id of the account that redeemed this code (nullable until used).
  used_by_user_id uuid references auth.users (id) on delete set null,

  -- Timestamp when the code was redeemed.
  used_at timestamptz,

  -- Optional expiry for the invite code itself (null = no expiry on code).
  expires_at timestamptz,

  created_at timestamptz not null default now(),

  constraint founder_codes_code_unique unique (code)
);

comment on table public.founder_codes is
  'One-time founder invitation codes for the 10-investor private beta. Each code can be redeemed once.';

comment on column public.founder_codes.code is
  'Unique founder invite string. One-time use: after used=true it must not be redeemable again.';

comment on column public.founder_codes.assigned_email is
  'Optional email the code was issued to before redemption (operations / audit).';

comment on column public.founder_codes.used is
  'False until redeemed. When all 10 rows are used=true, the founder cohort is full.';

comment on column public.founder_codes.used_by_user_id is
  'Supabase auth user who redeemed this code.';

comment on column public.founder_codes.used_at is
  'When the code was redeemed.';

comment on column public.founder_codes.expires_at is
  'Optional code-level expiry. Does not replace founder trial end in user metadata.';

-- Fast lookup by code during validation (modal / Edge Function).
create index if not exists founder_codes_code_idx
  on public.founder_codes (code);

-- Fast cohort-full checks: count where used = false vs all 10 used.
create index if not exists founder_codes_used_idx
  on public.founder_codes (used);

-- Optional: list unused codes for admin / inventory dashboards.
create index if not exists founder_codes_used_false_idx
  on public.founder_codes (used)
  where used = false;

-- -----------------------------------------------------------------------------
-- Beta cohort rule (documentation — enforce in application layer in a later phase):
--   SELECT count(*) FROM founder_codes WHERE used = true;
--   When count = 10 → hide Founder button; reject new redemptions.
-- -----------------------------------------------------------------------------
