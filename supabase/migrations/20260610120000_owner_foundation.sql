-- Migration: Owner Backend Foundation V1 — owner_properties, property_review_codes, owner_authorizations
-- Spec: OWNER_BACKEND_FOUNDATION.md + Owner SQL Foundation Design V2
-- Apply via: Supabase Dashboard → SQL, or `supabase db push` when CLI is configured.
-- Does NOT include RPCs, deals alterations, or Edge Functions (later phases).

-- =============================================================================
-- D) updated_at helper
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger helper: sets updated_at to now() on row update.';

-- =============================================================================
-- A) owner_properties
-- =============================================================================

create table public.owner_properties (
  id uuid primary key default gen_random_uuid(),
  lifecycle_status text not null default 'detected',
  owner_source text not null default 'detected',
  owner_user_id uuid references auth.users (id) on delete set null,
  deal_id uuid references public.deals (id) on delete set null,
  city text not null,
  address_display text,
  property_type text not null default 'Unknown',
  estimated_value numeric(14, 2),
  purchase_price numeric(14, 2),
  discount_percentage numeric(5, 2) default 0,
  detection_summary text,
  description text,
  owner_corrections jsonb default '{}'::jsonb,
  invited_at timestamptz,
  claimed_at timestamptz,
  closed_at timestamptz,
  close_reason text,
  created_by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint owner_properties_lifecycle_status_check check (
    lifecycle_status in (
      'detected',
      'invited',
      'claimed',
      'diamond_candidate',
      'diamond_active',
      'closed'
    )
  ),

  constraint owner_properties_owner_source_check check (
    owner_source in ('detected', 'organic')
  ),

  constraint owner_properties_claimed_owner_check check (
    lifecycle_status not in ('claimed', 'diamond_candidate', 'diamond_active')
    or owner_user_id is not null
  ),

  constraint owner_properties_diamond_active_deal_check check (
    lifecycle_status <> 'diamond_active'
    or deal_id is not null
  )
);

comment on table public.owner_properties is
  'Owner World: detected or organic properties. Separate from investor marketplace deals until admin publish.';

comment on column public.owner_properties.owner_source is
  'detected = engine/admin outreach with review code; organic = owner-submitted (future Submit New Property).';

comment on column public.owner_properties.deal_id is
  'Set when lifecycle_status is diamond_active after admin publishes to marketplace (Phase 6).';

create index owner_properties_owner_user_id_idx
  on public.owner_properties (owner_user_id);

create index owner_properties_lifecycle_status_idx
  on public.owner_properties (lifecycle_status);

create index owner_properties_owner_source_idx
  on public.owner_properties (owner_source);

create index owner_properties_lifecycle_claimed_at_idx
  on public.owner_properties (lifecycle_status, claimed_at desc nulls last);

create index owner_properties_city_idx
  on public.owner_properties (city);

create index owner_properties_deal_id_idx
  on public.owner_properties (deal_id)
  where deal_id is not null;

create trigger owner_properties_set_updated_at
  before update on public.owner_properties
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- B) property_review_codes
-- =============================================================================

create table public.property_review_codes (
  id uuid primary key default gen_random_uuid(),
  owner_property_id uuid not null references public.owner_properties (id) on delete cascade,
  code_lookup_key text not null,
  code_hash text not null,
  status text not null default 'pending',
  contact_method text not null,
  outreach_sent_at timestamptz,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  claimed_by_user_id uuid references auth.users (id) on delete set null,
  revoked_at timestamptz,
  assigned_email text,
  created_at timestamptz not null default now(),

  constraint property_review_codes_code_lookup_key_unique unique (code_lookup_key),

  constraint property_review_codes_status_check check (
    status in ('pending', 'claimed', 'expired', 'revoked')
  ),

  constraint property_review_codes_contact_method_check check (
    contact_method in ('email', 'phone', 'whatsapp', 'letter', 'manual')
  ),

  constraint property_review_codes_claimed_check check (
    status <> 'claimed'
    or (claimed_at is not null and claimed_by_user_id is not null)
  ),

  constraint property_review_codes_revoked_check check (
    status <> 'revoked'
    or revoked_at is not null
  ),

  constraint property_review_codes_expires_after_created_check check (
    expires_at > created_at
  )
);

comment on table public.property_review_codes is
  'One-time Property Review Codes (hashed). Owner interaction via RPCs only — no direct client access.';

comment on column public.property_review_codes.code_lookup_key is
  'HMAC/digest of normalized code for indexed lookup. Plaintext code never stored.';

comment on column public.property_review_codes.code_hash is
  'bcrypt or argon2id hash of normalized code for verification.';

comment on column public.property_review_codes.contact_method is
  'Outreach channel used to deliver the code (audit and conversion metrics).';

create index property_review_codes_owner_property_id_idx
  on public.property_review_codes (owner_property_id);

create unique index property_review_codes_one_pending_per_property_idx
  on public.property_review_codes (owner_property_id)
  where status = 'pending';

create index property_review_codes_status_expires_at_idx
  on public.property_review_codes (status, expires_at);

create index property_review_codes_contact_method_idx
  on public.property_review_codes (contact_method);

-- =============================================================================
-- C) owner_authorizations
-- =============================================================================

create table public.owner_authorizations (
  id uuid primary key default gen_random_uuid(),
  owner_property_id uuid not null unique references public.owner_properties (id) on delete cascade,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',
  share_scopes jsonb not null default '{
  "share_address": false,
  "share_financials": false,
  "share_investor_contact": false
}'::jsonb,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint owner_authorizations_status_check check (
    status in ('pending', 'authorized', 'rejected')
  ),

  constraint owner_authorizations_decided_check check (
    status = 'pending'
    or decided_at is not null
  )
);

comment on table public.owner_authorizations is
  'Owner consent for sharing property data with investors. One row per property in MVP.';

create index owner_authorizations_owner_user_id_idx
  on public.owner_authorizations (owner_user_id);

create index owner_authorizations_status_idx
  on public.owner_authorizations (status);

create trigger owner_authorizations_set_updated_at
  before update on public.owner_authorizations
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- E) RLS
-- =============================================================================

alter table public.owner_properties enable row level security;

create policy owner_properties_select_own
  on public.owner_properties
  for select
  to authenticated
  using (owner_user_id = auth.uid());

alter table public.owner_authorizations enable row level security;

create policy owner_authorizations_select_own
  on public.owner_authorizations
  for select
  to authenticated
  using (owner_user_id = auth.uid());

alter table public.property_review_codes enable row level security;

-- No policies for anon/authenticated on property_review_codes.
-- All client access will go through security definer RPCs in a later migration.
-- Service role retains full access for admin/code creation.
