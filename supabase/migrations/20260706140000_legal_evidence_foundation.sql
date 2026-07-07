-- Migration: FASE III — Legal Evidence Engine Foundation V1
-- Spec: Legal Evidence Engine (first Black Box module) — approved architecture review 2026-07-06
-- Tables: legal_document_versions (normative catalog), legal_acceptance_evidence (append-only legal memory)
-- Apply via: Supabase Dashboard → SQL, or `supabase db push` when CLI is configured.
-- Does NOT include: RPCs, views, Edge Functions, frontend wiring (later phases).
-- Includes: updated_at trigger + catalog immutability guards on legal_document_versions;
-- append-only guards on legal_acceptance_evidence (INSERT only).
--
-- content_hash values: SHA-256 (hex) of canonical legal text extracted from src/legal/pages/*.jsx
-- Normalization: export body text only, strip JSX/tags/styles, decode entities, trim lines, LF newlines.
-- Recompute with the approved offline hash pipeline if legal page content changes.

-- =============================================================================
-- A) legal_document_versions — normative legal version catalog (server-side truth)
-- =============================================================================

create table if not exists public.legal_document_versions (
  id uuid primary key default gen_random_uuid(),

  document_key text not null,
  version text not null,

  effective_from timestamptz not null,
  effective_until timestamptz,

  jurisdiction_code text not null default 'global',
  locale text not null default 'en',

  content_hash text not null,

  requires_reacceptance boolean not null default false,
  supersedes_version_id uuid references public.legal_document_versions (id) on delete set null,

  published_at timestamptz not null,
  schema_version smallint not null default 1,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint legal_document_versions_document_version_jurisdiction_unique
    unique (document_key, version, jurisdiction_code),

  constraint legal_document_versions_content_hash_format_check check (
    content_hash ~ '^[a-f0-9]{64}$'
  ),

  constraint legal_document_versions_effective_range_check check (
    effective_until is null
    or effective_until > effective_from
  )
);

comment on table public.legal_document_versions is
  'Legal Evidence Engine — normative catalog of published legal document versions. '
  'Not event memory: defines which version is in force. Black Box Legal domain references this table.';

comment on column public.legal_document_versions.document_key is
  'Stable document identifier (snake_case), aligned with src/legal/legalPages.js registry.';

comment on column public.legal_document_versions.version is
  'Immutable version label once published (e.g. 1.0.0). New legal text = new row, never in-place edit.';

comment on column public.legal_document_versions.effective_from is
  'When this version became normatively effective.';

comment on column public.legal_document_versions.effective_until is
  'When this version ceased to be active for new acceptances. NULL = currently active.';

comment on column public.legal_document_versions.jurisdiction_code is
  'Jurisdiction scope (global until multi-jurisdiction rollout).';

comment on column public.legal_document_versions.content_hash is
  'SHA-256 hex of canonical legal text at publication. Mandatory from day one for version integrity.';

comment on column public.legal_document_versions.requires_reacceptance is
  'If true, material change requires new acceptance before continued governed participation.';

comment on column public.legal_document_versions.supersedes_version_id is
  'Optional lineage pointer to the prior catalog row this version replaces.';

comment on column public.legal_document_versions.published_at is
  'Authoritative publication timestamp for this catalog version.';

comment on column public.legal_document_versions.schema_version is
  'Catalog row schema version for forward-compatible evolution.';

create unique index if not exists legal_document_versions_one_active_per_jurisdiction_idx
  on public.legal_document_versions (document_key, jurisdiction_code)
  where effective_until is null;

create index if not exists legal_document_versions_document_effective_from_idx
  on public.legal_document_versions (document_key, effective_from desc);

create index if not exists legal_document_versions_supersedes_version_id_idx
  on public.legal_document_versions (supersedes_version_id)
  where supersedes_version_id is not null;

-- =============================================================================
-- A2) legal_document_versions — updated_at + catalog immutability guards
-- =============================================================================

-- Reuses the owner-foundation pattern. create or replace keeps this migration idempotent
-- when set_updated_at() already exists from a prior migration.
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

-- Guards published catalog rows: no DELETE; no silent edits; close only via effective_until.
create or replace function public._legal_document_versions_guard()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    raise exception
      'legal_document_versions: published catalog rows cannot be deleted';
  end if;

  if tg_op = 'UPDATE' then
    if old.effective_until is not null then
      raise exception
        'legal_document_versions: closed versions are immutable';
    end if;

    if new.document_key is distinct from old.document_key
      or new.version is distinct from old.version
      or new.content_hash is distinct from old.content_hash
      or new.effective_from is distinct from old.effective_from
      or new.jurisdiction_code is distinct from old.jurisdiction_code
      or new.locale is distinct from old.locale
      or new.requires_reacceptance is distinct from old.requires_reacceptance
      or new.supersedes_version_id is distinct from old.supersedes_version_id
      or new.published_at is distinct from old.published_at
      or new.schema_version is distinct from old.schema_version
      or new.created_at is distinct from old.created_at
    then
      raise exception
        'legal_document_versions: cannot modify immutable publication fields '
        '(document_key, version, content_hash, effective_from, jurisdiction_code, locale, '
        'requires_reacceptance, supersedes_version_id, published_at, schema_version, created_at)';
    end if;

    if new.effective_until is null then
      raise exception
        'legal_document_versions: only permitted update on an active version is '
        'setting effective_until to close it when a newer version is published';
    end if;

    if new.effective_until <= old.effective_from then
      raise exception
        'legal_document_versions: effective_until must be after effective_from';
    end if;
  end if;

  return new;
end;
$$;

comment on function public._legal_document_versions_guard() is
  'Catalog protection: blocks DELETE; blocks in-place edits to published legal text metadata; '
  'allows only closing an active version by setting effective_until.';

drop trigger if exists legal_document_versions_guard_delete on public.legal_document_versions;
create trigger legal_document_versions_guard_delete
  before delete on public.legal_document_versions
  for each row
  execute function public._legal_document_versions_guard();

drop trigger if exists legal_document_versions_guard_update on public.legal_document_versions;
create trigger legal_document_versions_guard_update
  before update on public.legal_document_versions
  for each row
  execute function public._legal_document_versions_guard();

drop trigger if exists legal_document_versions_set_updated_at on public.legal_document_versions;
create trigger legal_document_versions_set_updated_at
  before update on public.legal_document_versions
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- B) legal_acceptance_evidence — append-only legal acceptance memory (Black Box Legal module)
-- =============================================================================

create table if not exists public.legal_acceptance_evidence (
  id uuid primary key default gen_random_uuid(),

  occurred_at timestamptz not null,
  recognized_at timestamptz not null default now(),
  schema_version smallint not null default 1,

  actor_type text not null,
  actor_id uuid references auth.users (id) on delete set null,
  actor_role_context text,

  user_id uuid references auth.users (id) on delete set null,

  canonical_event_name text not null,
  action_type text not null,
  admission_status text not null default 'accepted',

  document_key text not null,
  document_version text not null,
  document_version_id uuid references public.legal_document_versions (id) on delete restrict,
  content_hash_at_acceptance text not null,

  correlation_id uuid not null,
  journey_id uuid,
  session_id text,

  idempotency_key text not null,

  parent_evidence_id uuid references public.legal_acceptance_evidence (id) on delete set null,
  black_box_intake_id uuid,

  subject_type text,
  subject_id uuid,
  related_entity_type text,
  related_entity_id text,

  legal_context text,
  product_line text,
  jurisdiction_code text,
  country_code text,
  locale text,

  ip_address text,
  user_agent text,
  acceptance_method text not null,
  presentation_surface text,

  metadata jsonb not null default '{}'::jsonb,

  emission_source text not null,
  emitted_by_service text,

  created_at timestamptz not null default now(),

  constraint legal_acceptance_evidence_idempotency_key_unique unique (idempotency_key),

  constraint legal_acceptance_evidence_actor_type_check check (
    actor_type in ('user', 'admin', 'service', 'system', 'external')
  ),

  constraint legal_acceptance_evidence_admission_status_check check (
    admission_status in ('accepted', 'provisional', 'disputed')
  ),

  constraint legal_acceptance_evidence_acceptance_method_check check (
    acceptance_method in ('checkbox', 'clickwrap', 'reacceptance_forced')
  ),

  constraint legal_acceptance_evidence_emission_source_check check (
    emission_source in ('web_client', 'edge_function', 'webhook', 'admin_panel', 'rpc')
  ),

  constraint legal_acceptance_evidence_content_hash_format_check check (
    content_hash_at_acceptance ~ '^[a-f0-9]{64}$'
  ),

  constraint legal_acceptance_evidence_temporal_order_check check (
    recognized_at >= occurred_at
  )
);

comment on table public.legal_acceptance_evidence is
  'Legal Evidence Engine — append-only institutional memory of legal acceptances. '
  'First physical Black Box module (Legal domain). No UPDATE/DELETE on historical rows.';

comment on column public.legal_acceptance_evidence.id is
  'Canonical permanent identity of the legal acceptance fact (evidence_id).';

comment on column public.legal_acceptance_evidence.occurred_at is
  'When the user/system recognized the acceptance act (fact time).';

comment on column public.legal_acceptance_evidence.recognized_at is
  'When the platform admitted this row into legal memory (ingestion time).';

comment on column public.legal_acceptance_evidence.actor_type is
  'Originator class: user, admin, service, system, or external authority.';

comment on column public.legal_acceptance_evidence.actor_id is
  'Actor identifier when attributable (often auth.users id for human actors).';

comment on column public.legal_acceptance_evidence.user_id is
  'Subject user for RLS and investigation; may match actor_id for user-initiated acceptances.';

comment on column public.legal_acceptance_evidence.canonical_event_name is
  'Registry-aligned Black Box legal event name (e.g. legal.terms.accepted).';

comment on column public.legal_acceptance_evidence.action_type is
  'Product flow context (signup, subscription_checkout, premium_checkout, etc.).';

comment on column public.legal_acceptance_evidence.admission_status is
  'Initial trust posture: accepted, provisional, or disputed.';

comment on column public.legal_acceptance_evidence.document_key is
  'Immutable copy of accepted document_key at acceptance time.';

comment on column public.legal_acceptance_evidence.document_version is
  'Immutable copy of accepted version label at acceptance time.';

comment on column public.legal_acceptance_evidence.document_version_id is
  'FK to catalog row that was active at acceptance (when resolvable).';

comment on column public.legal_acceptance_evidence.content_hash_at_acceptance is
  'Immutable SHA-256 hex of canonical legal text at acceptance — copied from catalog, never resolved dynamically.';

comment on column public.legal_acceptance_evidence.correlation_id is
  'Master Black Box correlation anchor for cross-domain journey reconstruction '
  '(Signup, Login, Founder, Owner, Stripe, Marketplace, Factory, IA, Admin). '
  'Not Stripe-specific. Propagate unchanged across an investigable episode.';

comment on column public.legal_acceptance_evidence.journey_id is
  'Optional sub-segment within a correlation_id for multi-step flows.';

comment on column public.legal_acceptance_evidence.idempotency_key is
  'Semantic idempotency for retries and double-submit convergence. Distinct from correlation_id.';

comment on column public.legal_acceptance_evidence.parent_evidence_id is
  'Prior acceptance row for re-acceptance chains (additive, never overwrite).';

comment on column public.legal_acceptance_evidence.black_box_intake_id is
  'Reserved link to future central Black Box intake record.';

comment on column public.legal_acceptance_evidence.subject_type is
  'Business subject class (deal, checkout_intent, owner_property, etc.).';

comment on column public.legal_acceptance_evidence.metadata is
  'Bounded JSON for external references (stripe_checkout_session_id, etc.) subordinate to correlation_id.';

comment on column public.legal_acceptance_evidence.emission_source is
  'How the acceptance entered memory: web_client, edge_function, webhook, admin_panel, rpc.';

create index if not exists legal_acceptance_evidence_correlation_id_idx
  on public.legal_acceptance_evidence (correlation_id);

create index if not exists legal_acceptance_evidence_user_document_occurred_idx
  on public.legal_acceptance_evidence (user_id, document_key, occurred_at desc);

create index if not exists legal_acceptance_evidence_actor_occurred_idx
  on public.legal_acceptance_evidence (actor_id, occurred_at desc)
  where actor_id is not null;

create index if not exists legal_acceptance_evidence_document_version_idx
  on public.legal_acceptance_evidence (document_key, document_version);

create index if not exists legal_acceptance_evidence_subject_idx
  on public.legal_acceptance_evidence (subject_type, subject_id)
  where subject_type is not null and subject_id is not null;

create index if not exists legal_acceptance_evidence_recognized_at_idx
  on public.legal_acceptance_evidence (recognized_at desc);

create index if not exists legal_acceptance_evidence_parent_evidence_id_idx
  on public.legal_acceptance_evidence (parent_evidence_id)
  where parent_evidence_id is not null;

create index if not exists legal_acceptance_evidence_action_product_idx
  on public.legal_acceptance_evidence (action_type, product_line);

create index if not exists legal_acceptance_evidence_metadata_gin_idx
  on public.legal_acceptance_evidence using gin (metadata);

-- =============================================================================
-- B2) legal_acceptance_evidence — append-only defense (INSERT only)
-- =============================================================================

create or replace function public._legal_acceptance_evidence_append_only_guard()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    raise exception
      'legal_acceptance_evidence: append-only institutional memory — DELETE is not permitted';
  end if;

  if tg_op = 'UPDATE' then
    raise exception
      'legal_acceptance_evidence: append-only institutional memory — UPDATE is not permitted';
  end if;

  return new;
end;
$$;

comment on function public._legal_acceptance_evidence_append_only_guard() is
  'Append-only protection for legal_acceptance_evidence: blocks UPDATE and DELETE; only INSERT is allowed.';

drop trigger if exists legal_acceptance_evidence_append_only_guard_delete
  on public.legal_acceptance_evidence;
create trigger legal_acceptance_evidence_append_only_guard_delete
  before delete on public.legal_acceptance_evidence
  for each row
  execute function public._legal_acceptance_evidence_append_only_guard();

drop trigger if exists legal_acceptance_evidence_append_only_guard_update
  on public.legal_acceptance_evidence;
create trigger legal_acceptance_evidence_append_only_guard_update
  before update on public.legal_acceptance_evidence
  for each row
  execute function public._legal_acceptance_evidence_append_only_guard();

-- =============================================================================
-- C) RLS — legal_document_versions
-- =============================================================================

alter table public.legal_document_versions enable row level security;

-- Published (active) versions are readable by anonymous and authenticated clients.
drop policy if exists legal_document_versions_select_published on public.legal_document_versions;
create policy legal_document_versions_select_published
  on public.legal_document_versions
  for select
  to anon, authenticated
  using (effective_until is null);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated → denied by default.
-- service_role bypasses RLS for catalog publication and historical reads.

-- =============================================================================
-- D) RLS — legal_acceptance_evidence
-- =============================================================================

alter table public.legal_acceptance_evidence enable row level security;

-- Users may read only their own acceptance evidence.
drop policy if exists legal_acceptance_evidence_select_own on public.legal_acceptance_evidence;
create policy legal_acceptance_evidence_select_own
  on public.legal_acceptance_evidence
  for select
  to authenticated
  using (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE for anon/authenticated → writes only via SECURITY DEFINER RPC (next migration).
-- service_role may insert for Edge Functions / backfill when explicitly authorized.

-- =============================================================================
-- E) Seed — 18 legal documents @ version 1.0.0 (global / en)
-- Pilot wiring uses 5 flows; full catalog born complete for future domains.
-- =============================================================================

insert into public.legal_document_versions (
  document_key,
  version,
  effective_from,
  effective_until,
  jurisdiction_code,
  locale,
  content_hash,
  requires_reacceptance,
  published_at
)
values
  (
    'legal_index',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '77be672beed8a3637a6d0331eadacba8383a79e62e4a77d0cefec1869b9005ba',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'terms_of_service',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'c1a9a1feb610050818348c531a29cb80ea23fb7fb4d6ca9006f9f91591aa6ec8',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'privacy_policy',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '0eac3783d424bddc35e59acb96979f38704e35b4c19f5a98e4b92cfdd25d26f0',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'cookie_policy',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '8ed50dd07756ad16959627ce901ad83bf8dc4e2d70e78afa9305aedc5ad4e5e6',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'investment_disclaimer',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'b9c5fde4d66207412df4525cfdc87b1ea3c6214ce763a3d0ed37717b84c5211c',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'subscription_terms',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'ee654fc31024d6f2471dd7d61129fe078d5fe18c9761ade22022ab07980d0570',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'premium_purchase_terms',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'ba722fd9289ec20f176cf1432e4bbe115e4c68d0a6027a8ef726df5d36d8d4e3',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'diamond_purchase_terms',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '1fba13be78c6df0e125f8042579343c6de6067d472815a5001cffcf15c3379f0',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'owner_agreement',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'e8bbbd1bce3813e7155cff2ec049ff504b150a5312e8c8ebc4567d8302d80e7d',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'acceptable_use_policy',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '934b1ba17eaded25815d53a7763542ba8feb0c6776363a6ff971568cfeb88001',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'legal_notice',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'a5191363f58d028522ece56bf2f164d1eb9a4e93d1467adf600b4d49faa45cbd',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'diamond_authorization_agreement',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '077aeac4531f11dffec65ae83f392ea929742a9fa5c09ba540c71cb7f7d03704',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'founder_program_terms',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'ec4d96f24c7253c295d06b4bf480664e4e62d8098040de78072027b7fd0160a9',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'marketplace_rules',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '4df59157dd4d219106116646ab4f4d989765d1c35d7140393ee4319d8724e7a9',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'refund_policy',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '3487ae5509ca3ca3283b8cbafe487f6de71bd7bfe6eff47aaea310e10dd73a58',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'data_retention_policy',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '82cbe0e02329f2c156f839e9bff5f73c8b46240b6c3206fbaf05cb4fc3bd44ff',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'ai_automation_disclosure',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    '9f98ce40fdfe859640778c267c82de675637d2d6cf25f66eed90e24f2acf43b5',
    false,
    '2026-07-06T00:00:00+00'
  ),
  (
    'legal_definitions',
    '1.0.0',
    '2026-07-06T00:00:00+00',
    null,
    'global',
    'en',
    'f7920168cf81b29312051119ad75a376c4ddf102db7df08f36e2a139b4be9358',
    false,
    '2026-07-06T00:00:00+00'
  )
on conflict on constraint legal_document_versions_document_version_jurisdiction_unique do nothing;
