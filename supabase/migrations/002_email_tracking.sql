-- Email open tracking
create table email_opens (
  id uuid primary key default gen_random_uuid(),
  email_id text not null,
  opened_at timestamptz default now(),
  recipient_email text not null
);

create index idx_email_opens_email_id on email_opens(email_id);
create index idx_email_opens_recipient on email_opens(recipient_email);

-- Email suppressions (unsubscribes)
create table email_suppressions (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  suppressed_at timestamptz default now()
);

create index idx_email_suppressions_email on email_suppressions(email);
