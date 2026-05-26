-- Migration: atomic founder redeem + activate RPC (see supabase/redeem_and_activate_founder_code.sql)

alter table public.founder_codes enable row level security;

drop policy if exists founder_codes_select_authenticated on public.founder_codes;

create policy founder_codes_select_authenticated
  on public.founder_codes
  for select
  to authenticated
  using (true);

create or replace function public.redeem_and_activate_founder_code(
  p_code text,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_code text := upper(trim(p_code));
  v_row public.founder_codes%rowtype;
  v_started timestamptz := now();
  v_ends timestamptz;
  v_meta jsonb;
  v_started_iso text;
  v_ends_iso text;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Authenticated user required.'
    );
  end if;

  if v_code is null or v_code = '' then
    return jsonb_build_object(
      'status', 'invalid',
      'message', 'Founder code is required.'
    );
  end if;

  select *
  into v_row
  from public.founder_codes
  where code = v_code
  for update;

  if not found then
    return jsonb_build_object(
      'status', 'invalid',
      'message', 'This founder code is not valid.'
    );
  end if;

  if v_row.used is true then
    return jsonb_build_object(
      'status', 'used',
      'message', 'This founder code has already been used.'
    );
  end if;

  if v_row.expires_at is not null and v_row.expires_at < now() then
    return jsonb_build_object(
      'status', 'expired',
      'message', 'This founder code has expired.'
    );
  end if;

  select coalesce(raw_user_meta_data, '{}'::jsonb)
  into v_meta
  from auth.users
  where id = p_user_id;

  if not found then
    return jsonb_build_object(
      'status', 'error',
      'message', 'User not found.'
    );
  end if;

  v_ends := coalesce(
    nullif(v_meta->>'founder_trial_ends_at', '')::timestamptz,
    now() + interval '30 days'
  );

  if v_meta ? 'founder_trial_started_at'
     and nullif(v_meta->>'founder_trial_started_at', '') is not null then
    v_started := (v_meta->>'founder_trial_started_at')::timestamptz;
  end if;

  v_started_iso := to_char(v_started at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"') || 'Z';
  v_ends_iso := to_char(v_ends at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"') || 'Z';

  update public.founder_codes
  set
    used = true,
    used_by_user_id = p_user_id,
    used_at = now()
  where id = v_row.id;

  update auth.users
  set raw_user_meta_data = v_meta || jsonb_build_object(
    'access_role', 'founder',
    'founder_trial_started_at', v_started_iso,
    'founder_trial_ends_at', v_ends_iso,
    'founder_trial_status', 'active'
  )
  where id = p_user_id;

  return jsonb_build_object(
    'status', 'activated',
    'message', 'Founder access activated successfully.',
    'success', true
  );
exception
  when others then
    return jsonb_build_object(
      'status', 'error',
      'message', coalesce(sqlerrm, 'Unable to redeem and activate founder access.')
    );
end;
$$;

revoke all on function public.redeem_and_activate_founder_code(text, uuid) from public;

grant execute on function public.redeem_and_activate_founder_code(text, uuid) to authenticated;
