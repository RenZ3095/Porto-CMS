create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null check (category in ('ui-ux', 'web-app', 'full-stack')),
  title text not null check (char_length(trim(title)) between 1 and 120),
  short_description text not null check (char_length(trim(short_description)) between 1 and 260),
  tech text[] not null default '{}',
  image_url text not null check (image_url ~ '^https://'),
  github_url text check (github_url is null or github_url ~ '^https://'),
  live_url text check (live_url is null or live_url ~ '^https://'),
  featured boolean not null default false,
  problem text not null default '',
  process text not null default '',
  results text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

alter table public.projects enable row level security;
alter table public.projects force row level security;

revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false);
$$;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
on public.projects
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project images" on storage.objects;
create policy "Admins can upload project images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and public.is_admin()
);

drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-images'
  and public.is_admin()
)
with check (
  bucket_id = 'project-images'
  and public.is_admin()
);

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-images'
  and public.is_admin()
);
