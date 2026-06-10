-- Migration: Owner Backend Foundation V2 — RPCs for property review codes and owner portal
-- Depends on: 20260610120000_owner_foundation.sql
-- Spec: OWNER_BACKEND_FOUNDATION.md + Owner RPC Foundation Audit
-- Does NOT modify tables, deals, founder_codes, Edge Functions, or frontend.

-- =============================================================================
-- Extension (HMAC / digest for provisional code lookup + hash verification)
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- =============================================================================
-- Internal helpers — provisional pepper strategy (replace before production)
-- =============================================================================
--
-- !! PRODUCTION WARNING — DO NOT SHIP WITHOUT CONFIGURING PEPPER !!
--
-- The fallback string below is for LOCAL DEV ONLY.
-- It MUST NOT reach production. Anyone with repo access could derive code hashes.
--
-- Before production deploy, configure a strong secret pepper:
--   alter database postgres set app.property_review_code_pepper = '<long-random-secret>';
--   (or Supabase Dashboard → Database → Settings / Vault / Edge Function secret)
--
-- Until pepper is set, dev environments use the documented fallback so migrations apply.

create or replace function public._owner_review_code_pepper()
returns text
language sql
stable
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('app.property_review_code_pepper', true), ''),
    'PROVISIONAL_OWNER_REVIEW_CODE_PEPPER_REPLACE_BEFORE_PRODUCTION'
  );
$$;

comment on function public._owner_review_code_pepper() is
  'PROVISIONAL / DEV ONLY: returns pepper for property review code HMAC/digest. '
  'PRODUCTION REQUIREMENT: set app.property_review_code_pepper to a strong secret before deploy. '
  'The built-in fallback MUST NOT be used in production.';

create or replace function public.compute_property_review_code_lookup_key(p_code text)
returns text
language plpgsql
stable
strict
set search_path = public, extensions
as $$
declare
  v_norm text := upper(trim(p_code));
begin
  return encode(
    extensions.hmac(v_norm, public._owner_review_code_pepper(), 'sha256'),
    'hex'
  );
end;
$$;

comment on function public.compute_property_review_code_lookup_key(text) is
  'PROVISIONAL: HMAC-SHA256 hex lookup key for normalized Property Review Code. Used by validate/claim and by service role when inserting codes. Plaintext code never stored.';

create or replace function public._compute_property_review_code_hash(p_code text)
returns text
language plpgsql
stable
strict
set search_path = public, extensions
as $$
declare
  v_norm text := upper(trim(p_code));
begin
  return encode(
    extensions.digest(public._owner_review_code_pepper() || v_norm, 'sha256'),
    'hex'
  );
end;
$$;

comment on function public._compute_property_review_code_hash(text) is
  'PROVISIONAL: SHA256 hex hash for claim verification. Service role must set property_review_codes.code_hash to this value when creating codes.';

create or replace function public._auth_user_is_owner(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = p_user_id
      and coalesce(u.raw_user_meta_data->>'access_role', '') = 'owner'
  );
$$;

comment on function public._auth_user_is_owner(uuid) is
  'Returns true when auth user has access_role = owner in raw_user_meta_data.';

-- =============================================================================
-- 1) validate_property_review_code_public
-- =============================================================================

create or replace function public.validate_property_review_code_public(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_norm text := upper(trim(p_code));
  v_lookup text;
  v_row public.property_review_codes%rowtype;
begin
  if v_norm is null or v_norm = '' then
    return jsonb_build_object('status', 'invalid');
  end if;

  v_lookup := public.compute_property_review_code_lookup_key(v_norm);

  select *
  into v_row
  from public.property_review_codes
  where code_lookup_key = v_lookup;

  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_row.status <> 'pending' then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_row.expires_at < now() then
    update public.property_review_codes
    set status = 'expired'
    where id = v_row.id
      and status = 'pending';

    return jsonb_build_object('status', 'invalid');
  end if;

  return jsonb_build_object('status', 'valid');
exception
  when others then
    return jsonb_build_object('status', 'invalid');
end;
$$;

comment on function public.validate_property_review_code_public(text) is
  'Read-only Property Review Code check. Returns only valid|invalid. No PII, no owner_property_id, no detailed failure reason.';

-- =============================================================================
-- 2) claim_property_review_code
-- =============================================================================

create or replace function public.claim_property_review_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_norm text := upper(trim(p_code));
  v_lookup text;
  v_code public.property_review_codes%rowtype;
  v_prop public.owner_properties%rowtype;
  v_default_scopes jsonb := '{
    "share_address": false,
    "share_financials": false,
    "share_investor_contact": false
  }'::jsonb;
begin
  if v_uid is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Authentication required.'
    );
  end if;

  if not public._auth_user_is_owner(v_uid) then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_norm is null or v_norm = '' then
    return jsonb_build_object('status', 'invalid');
  end if;

  v_lookup := public.compute_property_review_code_lookup_key(v_norm);

  select *
  into v_code
  from public.property_review_codes
  where code_lookup_key = v_lookup
  for update;

  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;

  select *
  into v_prop
  from public.owner_properties
  where id = v_code.owner_property_id
  for update;

  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Idempotency: same owner already claimed this property via this code path.
  if v_prop.owner_user_id = v_uid
     and v_prop.lifecycle_status = 'claimed'
     and v_code.status = 'claimed'
     and v_code.claimed_by_user_id = v_uid then
    return jsonb_build_object(
      'status', 'claimed',
      'owner_property_id', v_prop.id
    );
  end if;

  if v_prop.owner_user_id is not null and v_prop.owner_user_id <> v_uid then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_code.status <> 'pending' then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_code.expires_at < now() then
    update public.property_review_codes
    set status = 'expired'
    where id = v_code.id
      and status = 'pending';

    return jsonb_build_object('status', 'invalid');
  end if;

  if public._compute_property_review_code_hash(v_norm) <> v_code.code_hash then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_prop.lifecycle_status <> 'invited' then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_prop.owner_user_id is not null then
    return jsonb_build_object('status', 'invalid');
  end if;

  update public.property_review_codes
  set
    status = 'claimed',
    claimed_at = now(),
    claimed_by_user_id = v_uid
  where id = v_code.id;

  update public.owner_properties
  set
    lifecycle_status = 'claimed',
    owner_user_id = v_uid,
    claimed_at = now()
  where id = v_prop.id;

  insert into public.owner_authorizations (
    owner_property_id,
    owner_user_id,
    status,
    share_scopes
  )
  values (
    v_prop.id,
    v_uid,
    'pending',
    v_default_scopes
  )
  on conflict (owner_property_id) do nothing;

  return jsonb_build_object(
    'status', 'claimed',
    'owner_property_id', v_prop.id
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to claim property review code.'
    );
end;
$$;

comment on function public.claim_property_review_code(text) is
  'Atomic Property Review Code claim for authenticated owners. Links property, marks code claimed, creates pending authorization. Idempotent for same owner.';

-- =============================================================================
-- 3) get_my_owner_properties
-- =============================================================================

create or replace function public.get_my_owner_properties()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Authentication required.'
    );
  end if;

  if not public._auth_user_is_owner(v_uid) then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'lifecycle_status', p.lifecycle_status,
        'owner_source', p.owner_source,
        'city', p.city,
        'address_display', p.address_display,
        'property_type', p.property_type,
        'estimated_value', p.estimated_value,
        'purchase_price', p.purchase_price,
        'discount_percentage', p.discount_percentage,
        'detection_summary', p.detection_summary,
        'description', p.description,
        'owner_corrections', p.owner_corrections,
        'claimed_at', p.claimed_at,
        'created_at', p.created_at,
        'authorization_status', a.status,
        'share_scopes', a.share_scopes,
        'authorization_decided_at', a.decided_at
      )
      order by p.claimed_at desc nulls last, p.created_at desc
    ),
    '[]'::jsonb
  )
  into v_result
  from public.owner_properties p
  left join public.owner_authorizations a
    on a.owner_property_id = p.id
  where p.owner_user_id = v_uid;

  return v_result;
end;
$$;

comment on function public.get_my_owner_properties() is
  'Returns owner-scoped properties for authenticated owner role. Includes authorization fields. '
  'No deals join and no deal_id in payload (Owner World / Investor World separation). Uses RLS via security invoker.';

-- =============================================================================
-- 4) set_owner_authorization
-- =============================================================================

create or replace function public.set_owner_authorization(
  p_owner_property_id uuid,
  p_status text,
  p_share_scopes jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_prop public.owner_properties%rowtype;
  v_auth public.owner_authorizations%rowtype;
  v_status text := lower(trim(coalesce(p_status, '')));
begin
  if v_uid is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Authentication required.'
    );
  end if;

  if not public._auth_user_is_owner(v_uid) then
    return jsonb_build_object('status', 'invalid');
  end if;

  if p_owner_property_id is null then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_status not in ('authorized', 'rejected') then
    return jsonb_build_object('status', 'invalid');
  end if;

  select *
  into v_prop
  from public.owner_properties
  where id = p_owner_property_id
    and owner_user_id = v_uid
  for update;

  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_prop.lifecycle_status <> 'claimed' then
    return jsonb_build_object('status', 'invalid');
  end if;

  select *
  into v_auth
  from public.owner_authorizations
  where owner_property_id = p_owner_property_id
    and owner_user_id = v_uid
  for update;

  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_auth.status <> 'pending' then
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_status = 'authorized' then
    if p_share_scopes is null or jsonb_typeof(p_share_scopes) <> 'object' then
      return jsonb_build_object('status', 'invalid');
    end if;

    if jsonb_typeof(p_share_scopes->'share_address') <> 'boolean'
       or jsonb_typeof(p_share_scopes->'share_financials') <> 'boolean'
       or jsonb_typeof(p_share_scopes->'share_investor_contact') <> 'boolean' then
      return jsonb_build_object('status', 'invalid');
    end if;

    update public.owner_authorizations
    set
      status = 'authorized',
      share_scopes = jsonb_build_object(
        'share_address', (p_share_scopes->>'share_address')::boolean,
        'share_financials', (p_share_scopes->>'share_financials')::boolean,
        'share_investor_contact', (p_share_scopes->>'share_investor_contact')::boolean
      ),
      decided_at = now()
    where id = v_auth.id;

    return jsonb_build_object(
      'status', 'ok',
      'authorization_status', 'authorized'
    );
  end if;

  -- rejected
  update public.owner_authorizations
  set
    status = 'rejected',
    decided_at = now()
  where id = v_auth.id;

  update public.owner_properties
  set
    lifecycle_status = 'closed',
    closed_at = now(),
    close_reason = 'owner_rejected'
  where id = v_prop.id;

  return jsonb_build_object(
    'status', 'ok',
    'authorization_status', 'rejected'
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to update owner authorization.'
    );
end;
$$;

comment on function public.set_owner_authorization(uuid, text, jsonb) is
  'Owner consent decision on claimed property. authorized keeps property claimed; rejected closes with owner_rejected. Never promotes to diamond_candidate or touches deals.';

-- =============================================================================
-- Grants
-- =============================================================================

revoke all on function public._owner_review_code_pepper() from public;
revoke all on function public.compute_property_review_code_lookup_key(text) from public;
revoke all on function public._compute_property_review_code_hash(text) from public;
revoke all on function public._auth_user_is_owner(uuid) from public;
grant execute on function public._auth_user_is_owner(uuid) to authenticated;

revoke all on function public.validate_property_review_code_public(text) from public;
grant execute on function public.validate_property_review_code_public(text) to anon;
grant execute on function public.validate_property_review_code_public(text) to authenticated;

revoke all on function public.claim_property_review_code(text) from public;
grant execute on function public.claim_property_review_code(text) to authenticated;

revoke all on function public.get_my_owner_properties() from public;
grant execute on function public.get_my_owner_properties() to authenticated;

revoke all on function public.set_owner_authorization(uuid, text, jsonb) from public;
grant execute on function public.set_owner_authorization(uuid, text, jsonb) to authenticated;
