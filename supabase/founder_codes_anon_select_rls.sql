-- =============================================================================
-- Founder counter (public) — allow anon SELECT on founder_codes.used
-- Run after founder_codes_apply.sql so getFounderCodesStatus works for visitors.
-- Does not grant INSERT/UPDATE/DELETE to anon.
-- =============================================================================

alter table public.founder_codes enable row level security;

drop policy if exists founder_codes_select_anon on public.founder_codes;

create policy founder_codes_select_anon
  on public.founder_codes
  for select
  to anon
  using (true);
