create table public.yarn_stash (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  brand text,
  color_name text not null,
  color_code text,
  color_swatch_hex text,
  dye_lot text,
  weight_class text not null check (weight_class in ('lace','fingering','sport','dk','worsted','bulky','super-bulky')),
  fiber text,
  total_grams numeric not null check (total_grams >= 0),
  remaining_grams numeric not null check (remaining_grams >= 0),
  meters_per_100g numeric,
  cost_minor bigint,
  currency text not null default 'USD',
  purchase_date date,
  image_url text,
  notes text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint remaining_not_over_total check (remaining_grams <= total_grams)
);

create trigger yarn_stash_set_updated_at
  before update on public.yarn_stash
  for each row execute function public.set_updated_at();

create index yarn_stash_user_weight_idx on public.yarn_stash (user_id, weight_class);
create index yarn_stash_user_remaining_idx on public.yarn_stash (user_id) where remaining_grams > 0;

alter table public.yarn_stash enable row level security;

create policy "Users manage their own yarn stash"
  on public.yarn_stash for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Links a project's yarn requirement to a stash item (or leaves it unlinked
-- if the user doesn't have the yarn yet), tracking required vs reserved.
create table public.project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  yarn_stash_id uuid references public.yarn_stash(id) on delete set null,
  color_name text not null,
  weight_class text check (weight_class in ('lace','fingering','sport','dk','worsted','bulky','super-bulky')),
  required_grams numeric not null default 0,
  reserved_grams numeric not null default 0,
  created_at timestamptz not null default now()
);

create index project_materials_project_idx on public.project_materials (project_id);
create index project_materials_user_idx on public.project_materials (user_id);
create index project_materials_yarn_stash_idx on public.project_materials (yarn_stash_id);

alter table public.project_materials enable row level security;

create policy "Users manage their own project materials"
  on public.project_materials for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Consumption events: draws from a stash item toward a project
create table public.yarn_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  yarn_stash_id uuid not null references public.yarn_stash(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  grams_used numeric not null check (grams_used > 0),
  used_at timestamptz not null default now()
);

create index yarn_usage_stash_idx on public.yarn_usage (yarn_stash_id, used_at desc);
create index yarn_usage_project_idx on public.yarn_usage (project_id);
create index yarn_usage_user_idx on public.yarn_usage (user_id);

alter table public.yarn_usage enable row level security;

create policy "Users manage their own yarn usage"
  on public.yarn_usage for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
