-- Migration: FASE III — Legal Evidence Engine RPC Foundation V1
-- Depends on: 20260706140000_legal_evidence_foundation.sql
-- Spec: Legal Evidence Engine — approved architecture (RPC layer, no frontend wiring)
-- Does NOT modify tables, App, Auth UI, Stripe, Edge Functions, or prior migrations.

-- =============================================================================
-- Internal helpers (not exposed to clients)
-- =============================================================================

create or replace function public._legal_resolve_active_version(
  p_document_key text,
  p_jurisdiction_code text default 'global'
)
returns public.legal_document_versions
language sql
stable
security definer
set search_path = public
as $$
  select v.*
  from public.legal_document_versions v
  where v.document_key = p_document_key
    and v.jurisdiction_code = coalesce(nullif(trim(p_jurisdiction_code), ''), 'global')
    and v.effective_until is null
  limit 1;
$$;

comment on function public._legal_resolve_active_version(text, text) is
  'Internal: returns the active published legal_document_versions row for a document/jurisdiction.';

create or replace function public._legal_required_document_keys(p_action_type text)
returns text[]
language plpgsql
immutable
security definer
set search_path = public
as $$
begin
  case p_action_type
    when 'signup' then
      return array['terms_of_service', 'privacy_policy'];
    when 'subscription_checkout' then
      return array['subscription_terms', 'terms_of_service'];
    when 'premium_checkout' then
      return array['premium_purchase_terms', 'terms_of_service'];
    when 'diamond_checkout' then
      return array['diamond_purchase_terms', 'terms_of_service'];
    else
      raise exception 'legal: unsupported action_type: %', p_action_type;
  end case;
end;
$$;

comment on function public._legal_required_document_keys(text) is
  'Internal: maps pilot action_type values to required document_key list (current catalog versions).';

create or replace function public._legal_is_service_role_caller()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.role(), '') = 'service_role';
$$;

comment on function public._legal_is_service_role_caller() is
  'Internal: true when the current JWT role is service_role.';

-- =============================================================================
-- 1) get_published_legal_document_version
-- =============================================================================

create or replace function public.get_published_legal_document_version(
  p_document_key text,
  p_jurisdiction_code text default 'global'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_key text := nullif(trim(p_document_key), '');
  v_jurisdiction text := coalesce(nullif(trim(p_jurisdiction_code), ''), 'global');
  v_row public.legal_document_versions%rowtype;
begin
  if v_key is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'document_key is required.'
    );
  end if;

  select *
  into v_row
  from public._legal_resolve_active_version(v_key, v_jurisdiction);

  if not found then
    return jsonb_build_object(
      'status', 'not_found',
      'document_key', v_key,
      'jurisdiction_code', v_jurisdiction
    );
  end if;

  return jsonb_build_object(
    'status', 'ok',
    'document', jsonb_build_object(
      'id', v_row.id,
      'document_key', v_row.document_key,
      'version', v_row.version,
      'content_hash', v_row.content_hash,
      'effective_from', v_row.effective_from,
      'published_at', v_row.published_at,
      'jurisdiction_code', v_row.jurisdiction_code,
      'locale', v_row.locale,
      'requires_reacceptance', v_row.requires_reacceptance
    )
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to resolve published legal document version.'
    );
end;
$$;

comment on function public.get_published_legal_document_version(text, text) is
  'Returns the active published legal document version from catalog (normative server truth).';

-- =============================================================================
-- 2) record_legal_acceptance
-- =============================================================================

create or replace function public.record_legal_acceptance(
  p_document_key text,
  p_canonical_event_name text,
  p_action_type text,
  p_correlation_id uuid,
  p_idempotency_key text,
  p_acceptance_method text default 'checkbox',
  p_emission_source text default 'rpc',
  p_occurred_at timestamptz default now(),
  p_journey_id uuid default null,
  p_session_id text default null,
  p_subject_type text default null,
  p_subject_id uuid default null,
  p_related_entity_type text default null,
  p_related_entity_id text default null,
  p_legal_context text default null,
  p_product_line text default null,
  p_jurisdiction_code text default 'global',
  p_country_code text default null,
  p_locale text default null,
  p_ip_address text default null,
  p_user_agent text default null,
  p_presentation_surface text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_parent_evidence_id uuid default null,
  p_actor_role_context text default null,
  p_admission_status text default 'accepted',
  p_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_caller_uid uuid := auth.uid();
  v_user_id uuid;
  v_actor_type text;
  v_actor_id uuid;
  v_key text := nullif(trim(p_document_key), '');
  v_event_name text := nullif(trim(p_canonical_event_name), '');
  v_action_type text := nullif(trim(p_action_type), '');
  v_idempotency text := nullif(trim(p_idempotency_key), '');
  v_jurisdiction text := coalesce(nullif(trim(p_jurisdiction_code), ''), 'global');
  v_catalog public.legal_document_versions%rowtype;
  v_existing public.legal_acceptance_evidence%rowtype;
  v_inserted public.legal_acceptance_evidence%rowtype;
  v_required text[];
  v_occurred_at timestamptz := coalesce(p_occurred_at, now());
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
begin
  if v_key is null then
    return jsonb_build_object('status', 'error', 'message', 'document_key is required.');
  end if;

  if v_event_name is null then
    return jsonb_build_object('status', 'error', 'message', 'canonical_event_name is required.');
  end if;

  if v_action_type is null then
    return jsonb_build_object('status', 'error', 'message', 'action_type is required.');
  end if;

  if p_correlation_id is null then
    return jsonb_build_object('status', 'error', 'message', 'correlation_id is required.');
  end if;

  if v_idempotency is null then
    return jsonb_build_object('status', 'error', 'message', 'idempotency_key is required.');
  end if;

  if p_acceptance_method not in ('checkbox', 'clickwrap', 'reacceptance_forced') then
    return jsonb_build_object('status', 'error', 'message', 'Invalid acceptance_method.');
  end if;

  if p_emission_source not in ('web_client', 'edge_function', 'webhook', 'admin_panel', 'rpc') then
    return jsonb_build_object('status', 'error', 'message', 'Invalid emission_source.');
  end if;

  if p_admission_status not in ('accepted', 'provisional', 'disputed') then
    return jsonb_build_object('status', 'error', 'message', 'Invalid admission_status.');
  end if;

  if jsonb_typeof(v_metadata) is distinct from 'object' then
    return jsonb_build_object('status', 'error', 'message', 'metadata must be a JSON object.');
  end if;

  begin
    v_required := public._legal_required_document_keys(v_action_type);
  exception
    when others then
      return jsonb_build_object('status', 'error', 'message', 'Unsupported action_type.');
  end;

  if not (v_key = any (v_required)) then
    return jsonb_build_object(
      'status', 'error',
      'message', 'document_key is not required for this action_type.',
      'document_key', v_key,
      'action_type', v_action_type
    );
  end if;

  if v_caller_uid is not null then
    if p_user_id is not null and p_user_id <> v_caller_uid then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Cannot record legal acceptance for another user.'
      );
    end if;
    v_user_id := v_caller_uid;
    v_actor_type := 'user';
    v_actor_id := v_caller_uid;
  elsif public._legal_is_service_role_caller() then
    if p_user_id is null then
      return jsonb_build_object(
        'status', 'error',
        'message', 'p_user_id is required for service_role emission.'
      );
    end if;
    v_user_id := p_user_id;
    v_actor_type := 'service';
    v_actor_id := p_user_id;
  else
    return jsonb_build_object('status', 'error', 'message', 'Authentication required.');
  end if;

  if v_caller_uid is not null then
    if p_emission_source not in ('web_client', 'rpc') then
      return jsonb_build_object(
        'status', 'error',
        'message', 'emission_source not permitted for authenticated callers.'
      );
    end if;

    if p_admission_status <> 'accepted' then
      return jsonb_build_object(
        'status', 'error',
        'message', 'admission_status must be accepted for authenticated callers.'
      );
    end if;
  end if;

  select *
  into v_existing
  from public.legal_acceptance_evidence
  where idempotency_key = v_idempotency;

  if found then
    if v_existing.user_id is distinct from v_user_id then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Idempotency key conflict.'
      );
    end if;

    return jsonb_build_object(
      'status', 'ok',
      'idempotent', true,
      'evidence_id', v_existing.id,
      'correlation_id', v_existing.correlation_id
    );
  end if;

  select *
  into v_catalog
  from public._legal_resolve_active_version(v_key, v_jurisdiction);

  if not found then
    return jsonb_build_object(
      'status', 'error',
      'message', 'No active published version for document_key.',
      'document_key', v_key
    );
  end if;

  if v_occurred_at > now() + interval '5 minutes' then
    return jsonb_build_object('status', 'error', 'message', 'occurred_at cannot be in the future.');
  end if;

  insert into public.legal_acceptance_evidence (
    occurred_at,
    recognized_at,
    schema_version,
    actor_type,
    actor_id,
    actor_role_context,
    user_id,
    canonical_event_name,
    action_type,
    admission_status,
    document_key,
    document_version,
    document_version_id,
    content_hash_at_acceptance,
    correlation_id,
    journey_id,
    session_id,
    idempotency_key,
    parent_evidence_id,
    subject_type,
    subject_id,
    related_entity_type,
    related_entity_id,
    legal_context,
    product_line,
    jurisdiction_code,
    country_code,
    locale,
    ip_address,
    user_agent,
    acceptance_method,
    presentation_surface,
    metadata,
    emission_source,
    emitted_by_service
  )
  values (
    v_occurred_at,
    now(),
    1,
    v_actor_type,
    v_actor_id,
    nullif(trim(p_actor_role_context), ''),
    v_user_id,
    v_event_name,
    v_action_type,
    p_admission_status,
    v_catalog.document_key,
    v_catalog.version,
    v_catalog.id,
    v_catalog.content_hash,
    p_correlation_id,
    p_journey_id,
    nullif(trim(p_session_id), ''),
    v_idempotency,
    p_parent_evidence_id,
    nullif(trim(p_subject_type), ''),
    p_subject_id,
    nullif(trim(p_related_entity_type), ''),
    nullif(trim(p_related_entity_id), ''),
    nullif(trim(p_legal_context), ''),
    nullif(trim(p_product_line), ''),
    v_jurisdiction,
    nullif(trim(p_country_code), ''),
    nullif(trim(p_locale), ''),
    nullif(trim(p_ip_address), ''),
    nullif(trim(p_user_agent), ''),
    p_acceptance_method,
    nullif(trim(p_presentation_surface), ''),
    v_metadata,
    p_emission_source,
    case when v_actor_type = 'service' then 'record_legal_acceptance' else null end
  )
  returning *
  into v_inserted;

  return jsonb_build_object(
    'status', 'ok',
    'idempotent', false,
    'evidence_id', v_inserted.id,
    'correlation_id', v_inserted.correlation_id,
    'document_key', v_inserted.document_key,
    'document_version', v_inserted.document_version,
    'content_hash_at_acceptance', v_inserted.content_hash_at_acceptance
  );
exception
  when unique_violation then
    select *
    into v_existing
    from public.legal_acceptance_evidence
    where idempotency_key = v_idempotency;

    if found then
      if v_existing.user_id is distinct from v_user_id then
        return jsonb_build_object(
          'status', 'error',
          'message', 'Idempotency key conflict.'
        );
      end if;

      return jsonb_build_object(
        'status', 'ok',
        'idempotent', true,
        'evidence_id', v_existing.id,
        'correlation_id', v_existing.correlation_id
      );
    end if;

    return jsonb_build_object(
      'status', 'error',
      'message', 'Idempotency conflict without resolvable evidence row.'
    );
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to record legal acceptance.'
    );
end;
$$;

comment on function public.record_legal_acceptance(
  text, text, text, uuid, text, text, text, timestamptz, uuid, text, text, uuid, text, text,
  text, text, text, text, text, text, text, text, jsonb, uuid, text, text, uuid
) is
  'Append-only legal acceptance intake. Validates active catalog version, copies content_hash, enforces idempotency and correlation_id.';

-- =============================================================================
-- 3) check_required_legal_acceptances
-- =============================================================================

create or replace function public.check_required_legal_acceptances(
  p_action_type text,
  p_correlation_id uuid,
  p_product_line text default null,
  p_jurisdiction_code text default 'global',
  p_user_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid;
  v_action_type text := nullif(trim(p_action_type), '');
  v_jurisdiction text := coalesce(nullif(trim(p_jurisdiction_code), ''), 'global');
  v_required text[];
  v_required_json jsonb := '[]'::jsonb;
  v_missing jsonb := '[]'::jsonb;
  v_doc_key text;
  v_catalog public.legal_document_versions%rowtype;
  v_has_evidence boolean;
  v_all_accepted boolean := true;
begin
  if v_action_type is null then
    return jsonb_build_object('status', 'error', 'message', 'action_type is required.');
  end if;

  if p_correlation_id is null then
    return jsonb_build_object('status', 'error', 'message', 'correlation_id is required.');
  end if;

  if auth.uid() is not null then
    v_uid := auth.uid();
    if p_user_id is not null and p_user_id <> v_uid then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Cannot check legal acceptances for another user.'
      );
    end if;
  elsif public._legal_is_service_role_caller() then
    if p_user_id is null then
      return jsonb_build_object(
        'status', 'error',
        'message', 'p_user_id is required for service_role checks.'
      );
    end if;
    v_uid := p_user_id;
  else
    return jsonb_build_object('status', 'error', 'message', 'Authentication required.');
  end if;

  begin
    v_required := public._legal_required_document_keys(v_action_type);
  exception
    when others then
      return jsonb_build_object('status', 'error', 'message', 'Unsupported action_type.');
  end;

  foreach v_doc_key in array v_required
  loop
    select *
    into v_catalog
    from public._legal_resolve_active_version(v_doc_key, v_jurisdiction);

    if not found then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Active catalog version missing for required document.',
        'document_key', v_doc_key
      );
    end if;

    v_required_json := v_required_json || jsonb_build_array(
      jsonb_build_object(
        'document_key', v_catalog.document_key,
        'version', v_catalog.version,
        'content_hash', v_catalog.content_hash
      )
    );

    if v_uid is not null then
      select exists (
        select 1
        from public.legal_acceptance_evidence e
        where e.user_id = v_uid
          and e.document_key = v_catalog.document_key
          and e.document_version = v_catalog.version
          and e.content_hash_at_acceptance = v_catalog.content_hash
          and e.correlation_id = p_correlation_id
          and e.action_type = v_action_type
          and e.admission_status = 'accepted'
      )
      into v_has_evidence;
    else
      v_has_evidence := false;
    end if;

    if not coalesce(v_has_evidence, false) then
      v_all_accepted := false;
      v_missing := v_missing || jsonb_build_array(
        jsonb_build_object(
          'document_key', v_catalog.document_key,
          'version', v_catalog.version
        )
      );
    end if;
  end loop;

  return jsonb_build_object(
    'status', case when v_all_accepted then 'ok' else 'missing' end,
    'all_accepted', v_all_accepted,
    'action_type', v_action_type,
    'product_line', nullif(trim(p_product_line), ''),
    'correlation_id', p_correlation_id,
    'required_documents', v_required_json,
    'missing_documents', v_missing
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to check required legal acceptances.'
    );
end;
$$;

comment on function public.check_required_legal_acceptances(text, uuid, text, text, uuid) is
  'Verifies pilot-flow required acceptances for action_type against active catalog versions and correlation_id.';

-- =============================================================================
-- 4) get_my_legal_acceptance_evidence
-- =============================================================================

create or replace function public.get_my_legal_acceptance_evidence(
  p_limit integer default 50,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_limit integer := greatest(1, least(coalesce(p_limit, 50), 100));
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
  v_rows jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('status', 'error', 'message', 'Authentication required.');
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'evidence_id', e.id,
        'occurred_at', e.occurred_at,
        'recognized_at', e.recognized_at,
        'canonical_event_name', e.canonical_event_name,
        'action_type', e.action_type,
        'admission_status', e.admission_status,
        'document_key', e.document_key,
        'document_version', e.document_version,
        'content_hash_at_acceptance', e.content_hash_at_acceptance,
        'correlation_id', e.correlation_id,
        'journey_id', e.journey_id,
        'product_line', e.product_line,
        'subject_type', e.subject_type,
        'subject_id', e.subject_id,
        'created_at', e.created_at
      )
      order by e.recognized_at desc
    ),
    '[]'::jsonb
  )
  into v_rows
  from (
    select *
    from public.legal_acceptance_evidence e
    where e.user_id = v_uid
    order by e.recognized_at desc
    limit v_limit
    offset v_offset
  ) e;

  return jsonb_build_object(
    'status', 'ok',
    'limit', v_limit,
    'offset', v_offset,
    'evidence', v_rows
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Unable to load legal acceptance evidence.'
    );
end;
$$;

comment on function public.get_my_legal_acceptance_evidence(integer, integer) is
  'Returns paginated legal acceptance evidence for the authenticated user (append-only read).';

-- =============================================================================
-- Grants
-- =============================================================================

revoke all on function public._legal_resolve_active_version(text, text) from public;
revoke all on function public._legal_required_document_keys(text) from public;
revoke all on function public._legal_is_service_role_caller() from public;

revoke all on function public.get_published_legal_document_version(text, text) from public;
grant execute on function public.get_published_legal_document_version(text, text) to anon;
grant execute on function public.get_published_legal_document_version(text, text) to authenticated;

revoke all on function public.record_legal_acceptance(
  text, text, text, uuid, text, text, text, timestamptz, uuid, text, text, uuid, text, text,
  text, text, text, text, text, text, text, text, jsonb, uuid, text, text, uuid
) from public;
grant execute on function public.record_legal_acceptance(
  text, text, text, uuid, text, text, text, timestamptz, uuid, text, text, uuid, text, text,
  text, text, text, text, text, text, text, text, jsonb, uuid, text, text, uuid
) to authenticated;
grant execute on function public.record_legal_acceptance(
  text, text, text, uuid, text, text, text, timestamptz, uuid, text, text, uuid, text, text,
  text, text, text, text, text, text, text, text, jsonb, uuid, text, text, uuid
) to service_role;

revoke all on function public.check_required_legal_acceptances(text, uuid, text, text, uuid) from public;
grant execute on function public.check_required_legal_acceptances(text, uuid, text, text, uuid) to authenticated;
grant execute on function public.check_required_legal_acceptances(text, uuid, text, text, uuid) to service_role;

revoke all on function public.get_my_legal_acceptance_evidence(integer, integer) from public;
grant execute on function public.get_my_legal_acceptance_evidence(integer, integer) to authenticated;
