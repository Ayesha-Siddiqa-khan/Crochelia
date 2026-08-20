create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_capabilities
    where user_id = auth.uid() and capability = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'total_projects', (select count(*) from public.projects where deleted_at is null),
    'active_projects', (select count(*) from public.projects where deleted_at is null and status = 'in_progress'),
    'total_yarn_items', (select count(*) from public.yarn_stash where deleted_at is null),
    'sellers', (select count(*) from public.user_capabilities where capability = 'seller'),
    'designers', (select count(*) from public.user_capabilities where capability = 'designer')
  );
end;
$$;

revoke execute on function public.admin_platform_stats() from public, anon;
grant execute on function public.admin_platform_stats() to authenticated;

create or replace function public.admin_grant_capability(target_user_id uuid, cap text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if cap not in ('designer','seller','admin') then
    raise exception 'Invalid capability' using errcode = '22023';
  end if;

  insert into public.user_capabilities (user_id, capability)
  values (target_user_id, cap)
  on conflict do nothing;

  insert into public.audit_log (actor_id, action, target_table, target_id, detail)
  values (auth.uid(), 'grant_capability', 'user_capabilities', target_user_id, jsonb_build_object('capability', cap));
end;
$$;

revoke execute on function public.admin_grant_capability(uuid, text) from public, anon;
grant execute on function public.admin_grant_capability(uuid, text) to authenticated;

create or replace function public.admin_revoke_capability(target_user_id uuid, cap text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  delete from public.user_capabilities
  where user_id = target_user_id and capability = cap;

  insert into public.audit_log (actor_id, action, target_table, target_id, detail)
  values (auth.uid(), 'revoke_capability', 'user_capabilities', target_user_id, jsonb_build_object('capability', cap));
end;
$$;

revoke execute on function public.admin_revoke_capability(uuid, text) from public, anon;
grant execute on function public.admin_revoke_capability(uuid, text) to authenticated;

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_created_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "Admins can read the audit log"
  on public.audit_log for select
  using (public.is_admin());

-- No insert/update/delete policy for audit_log: rows are written only by the
-- SECURITY DEFINER admin functions above, never directly by clients.
