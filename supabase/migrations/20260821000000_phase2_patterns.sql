create table public.patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  project_type text check (project_type in ('cardigan','sweater','blanket','bag','scarf','top','skirt','accessory','amigurumi','granny_square','custom')),
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  technique text,
  yarn_weight text check (yarn_weight in ('lace','fingering','sport','dk','worsted','bulky','super-bulky')),
  hook_size_mm numeric,
  gauge text,
  materials text,
  abbreviations text,
  instructions text not null,
  notes text,
  image_url text,
  origin text not null default 'human' check (origin in ('human','ai_generated')),
  ai_model text,
  visibility text not null default 'private' check (visibility in ('private','unlisted','public')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger patterns_set_updated_at
  before update on public.patterns
  for each row execute function public.set_updated_at();

create index patterns_public_idx on public.patterns (project_type, difficulty, created_at desc)
  where visibility = 'public' and deleted_at is null;
create index patterns_user_idx on public.patterns (user_id, created_at desc);

alter table public.patterns enable row level security;

create policy "Patterns are readable if public/unlisted or owned"
  on public.patterns for select
  using (visibility <> 'private' or (select auth.uid()) = user_id);

create policy "Owners insert their own patterns"
  on public.patterns for insert
  with check ((select auth.uid()) = user_id);

create policy "Owners update their own patterns"
  on public.patterns for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owners delete their own patterns"
  on public.patterns for delete
  using ((select auth.uid()) = user_id);
