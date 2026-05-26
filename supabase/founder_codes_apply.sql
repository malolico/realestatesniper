-- =============================================================================
-- Founder System Phase 1A — APPLY (paste in Supabase Dashboard → SQL Editor)
--
-- Creates public.founder_codes + indexes + seeds 10 codes.
-- Safe to re-run: IF NOT EXISTS / ON CONFLICT DO NOTHING.
--
-- After run:
--   select count(*) from public.founder_codes;  -- expect 10
--   select count(*) filter (where not used) from public.founder_codes;  -- remaining
-- =============================================================================

-- ---------- schema ----------
create table if not exists public.founder_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  assigned_email text,
  used boolean not null default false,
  used_by_user_id uuid references auth.users (id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint founder_codes_code_unique unique (code)
);

comment on table public.founder_codes is
  'One-time founder invitation codes for the 10-investor private beta. Each code can be redeemed once.';

create index if not exists founder_codes_code_idx on public.founder_codes (code);
create index if not exists founder_codes_used_idx on public.founder_codes (used);
create index if not exists founder_codes_used_false_idx on public.founder_codes (used) where used = false;

-- ---------- seed ----------
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
