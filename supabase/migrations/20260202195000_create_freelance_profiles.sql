-- Create homepage_freelance_profiles table
create table if not exists public.homepage_freelance_profiles (
    id uuid not null default gen_random_uuid(),
    platform text not null,
    url text not null,
    icon_url text,
    display_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint homepage_freelance_profiles_pkey primary key (id)
);

-- Enable RLS
alter table public.homepage_freelance_profiles enable row level security;

-- Policies
-- Allow anyone to view freelance profiles
create policy "Freelance profiles are viewable by everyone"
    on public.homepage_freelance_profiles
    for select
    using (true);

-- Allow admins/editors to manage freelance profiles
create policy "Admins/Editors can manage freelance profiles"
    on public.homepage_freelance_profiles
    for all
    using ( public.has_role(auth.uid(), 'admin'::public.app_role) or public.has_role(auth.uid(), 'editor'::public.app_role) );

-- Trigger for updated_at
create trigger update_homepage_freelance_profiles_updated_at
    before update on public.homepage_freelance_profiles
    for each row
    execute function public.update_updated_at_column();
