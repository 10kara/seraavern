-- Jedi Archives: Storage setup
-- Run this in Supabase SQL Editor once.
insert into storage.buckets (id, name, public)
values ('archive', 'archive', true)
on conflict (id) do update set public = true;

drop policy if exists "Archive public read" on storage.objects;
create policy "Archive public read"
on storage.objects for select
using (bucket_id = 'archive');

drop policy if exists "Archive authenticated upload" on storage.objects;
create policy "Archive authenticated upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'archive');

drop policy if exists "Archive authenticated update" on storage.objects;
create policy "Archive authenticated update"
on storage.objects for update
to authenticated
using (bucket_id = 'archive')
with check (bucket_id = 'archive');

drop policy if exists "Archive authenticated delete" on storage.objects;
create policy "Archive authenticated delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'archive');
