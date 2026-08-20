create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cardigan','sweater','blanket','bag','scarf','top','skirt','accessory','amigurumi','granny_square','custom')),
  description text,
  size text check (size in ('xs','s','m','l','xl','2xl','custom')),
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  status text not null default 'planning' check (status in ('planning','in_progress','paused','completed','archived')),
  hook_size_mm numeric,
  square_size_cm numeric,
  colors text[],
  stitch_types text[],
  estimated_time_hours numeric,
  estimated_cost_minor bigint,
  currency text not null default 'USD',
  calculator_input jsonb,
  calculator_result jsonb,
  total_squares integer,
  completed_squares integer not null default 0,
  notes text,
  cover_image_url text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index projects_user_status_idx on public.projects (user_id, status, updated_at desc);

alter table public.projects enable row level security;

create policy "Users manage their own projects"
  on public.projects for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Progress history: every increment is a row, never overwritten
create table public.project_progress (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_squares integer,
  note text,
  photo_url text,
  created_at timestamptz not null default now()
);

create index project_progress_project_idx on public.project_progress (project_id, created_at desc);
create index project_progress_user_idx on public.project_progress (user_id);

alter table public.project_progress enable row level security;

create policy "Users manage their own project progress"
  on public.project_progress for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Per-piece checklist (front, back, sleeve, etc.)
create table public.project_pieces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  squares_required integer not null default 0,
  squares_completed integer not null default 0,
  is_complete boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_pieces_project_idx on public.project_pieces (project_id, sort_order);
create index project_pieces_user_idx on public.project_pieces (user_id);

alter table public.project_pieces enable row level security;

create policy "Users manage their own project pieces"
  on public.project_pieces for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  caption text,
  taken_at timestamptz not null default now(),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, taken_at desc);
create index project_images_user_idx on public.project_images (user_id);

alter table public.project_images enable row level security;

create policy "Users manage their own project images"
  on public.project_images for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
