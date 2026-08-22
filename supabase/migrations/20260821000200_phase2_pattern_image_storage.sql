insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pattern-images', 'pattern-images', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

create policy "Public read access to pattern images"
  on storage.objects for select
  using (bucket_id = 'pattern-images');

create policy "Users upload their own pattern images"
  on storage.objects for insert
  with check (
    bucket_id = 'pattern-images'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users delete their own pattern images"
  on storage.objects for delete
  using (
    bucket_id = 'pattern-images'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );
