-- Create contact_messages table
create table if not exists public.contact_messages (
    id uuid not null default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint contact_messages_pkey primary key (id)
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Policies
-- Allow anyone (anon) to insert messages
create policy "Anyone can insert messages"
    on public.contact_messages
    for insert
    with check (true);

-- Allow admins/editors to select (view) messages
create policy "Admins/Editors can view messages"
    on public.contact_messages
    for select
    using ( public.has_role(auth.uid(), 'admin'::public.app_role) or public.has_role(auth.uid(), 'editor'::public.app_role) );

-- Allow admins/editors to update (marking as read)
create policy "Admins/Editors can update messages"
    on public.contact_messages
    for update
    using ( public.has_role(auth.uid(), 'admin'::public.app_role) or public.has_role(auth.uid(), 'editor'::public.app_role) );

-- Allow admins/editors to delete messages
create policy "Admins/Editors can delete messages"
    on public.contact_messages
    for delete
    using ( public.has_role(auth.uid(), 'admin'::public.app_role) or public.has_role(auth.uid(), 'editor'::public.app_role) );
