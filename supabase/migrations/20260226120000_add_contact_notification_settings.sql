alter table public.homepage_contact_info
  add column if not exists notification_email text default 'akmtasdikulislam@gmail.com',
  add column if not exists notify_on_message boolean default true;

create or replace function public.homepage_contact_info_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_contact_info_updated_at'
  ) then
    create trigger set_contact_info_updated_at
    before update on public.homepage_contact_info
    for each row
    execute function public.homepage_contact_info_updated_at();
  end if;
end;
$$;

create or replace function public.notify_contact_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_email text;
  should_notify boolean;
begin
  select notification_email, notify_on_message
  into target_email, should_notify
  from public.homepage_contact_info
  order by created_at asc
  limit 1;

  if should_notify and target_email is not null then
    perform pg_notify(
      'contact_message',
      json_build_object(
        'id', new.id,
        'name', new.name,
        'email', new.email,
        'subject', new.subject,
        'message', new.message,
        'created_at', new.created_at,
        'notification_email', target_email
      )::text
    );
  end if;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'notify_contact_message_insert'
  ) then
    create trigger notify_contact_message_insert
    after insert on public.contact_messages
    for each row
    execute function public.notify_contact_message();
  end if;
end;
$$;
