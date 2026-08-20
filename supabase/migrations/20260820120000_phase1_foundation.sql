-- Shared trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles: 1:1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cover_url text,
  skill_level text check (skill_level in ('beginner','hobbyist','experienced','designer')) default 'beginner',
  years_crocheting numeric,
  location text,
  display_unit text check (display_unit in ('metric','imperial')) default 'metric',
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users manage their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id);

create policy "Users insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New maker')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Additive role capabilities: designer | seller | admin (base "user" is implicit)
create table public.user_capabilities (
  user_id uuid not null references public.profiles(id) on delete cascade,
  capability text not null check (capability in ('designer','seller','admin')),
  granted_at timestamptz not null default now(),
  primary key (user_id, capability)
);

alter table public.user_capabilities enable row level security;

create policy "Users can read their own capabilities"
  on public.user_capabilities for select
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policy: capabilities are granted only via service-role
-- (admin action), never self-assignable from the client. PROJECT.md §10.4.
