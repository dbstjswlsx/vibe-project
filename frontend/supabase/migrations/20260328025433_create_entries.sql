-- Enable moddatetime extension for auto-updating updated_at
create extension if not exists moddatetime with schema extensions;

-- Create entries table
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  mood text not null check (mood in ('happy','neutral','sad','angry','tired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for listing entries per user ordered by date
create index entries_user_id_created_at_idx
  on public.entries (user_id, created_at desc);

-- Auto-update updated_at on row change
create trigger handle_updated_at
  before update on public.entries
  for each row
  execute procedure moddatetime(updated_at);

-- Enable Row Level Security
alter table public.entries enable row level security;

-- RLS policies: users can only access their own entries
create policy select_own on public.entries
  for select using (auth.uid() = user_id);

create policy insert_own on public.entries
  for insert with check (auth.uid() = user_id);

create policy update_own on public.entries
  for update using (auth.uid() = user_id);

create policy delete_own on public.entries
  for delete using (auth.uid() = user_id);
