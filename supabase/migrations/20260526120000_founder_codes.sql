-- Migration: Founder System Phase 1A — founder_codes table
-- Apply via: Supabase Dashboard → SQL, or `supabase db push` when CLI is configured.

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

create index if not exists founder_codes_code_idx on public.founder_codes (code);
create index if not exists founder_codes_used_idx on public.founder_codes (used);
create index if not exists founder_codes_used_false_idx on public.founder_codes (used) where used = false;
