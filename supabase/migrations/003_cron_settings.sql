-- Key-value settings for cron job state
create table cron_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);
