-- Businesses table
create table businesses (
  id uuid primary key default gen_random_uuid(),
  google_place_id text unique not null,
  name text not null,
  slug text unique not null,
  trade text not null,
  town text not null,
  address text,
  phone text,
  website text,
  google_maps_url text,
  lat float,
  lng float,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Scores table (current score)
create table scores (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  score integer not null,
  band text not null, -- 'poor' | 'fair' | 'good' | 'excellent'
  star_rating float,
  review_count integer,
  recency_score integer,
  completeness_score integer,
  response_rate_score integer,
  activity_score integer,
  last_active_at timestamptz,
  calculated_at timestamptz default now(),
  unique(business_id)
);

-- Score history (weekly snapshots)
create table score_history (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  score integer not null,
  rank_in_town_trade integer,
  week_of date not null,
  created_at timestamptz default now()
);

-- Rankings table (current position)
create table rankings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  trade text not null,
  town text not null,
  rank integer not null,
  previous_rank integer,
  movement integer,
  updated_at timestamptz default now(),
  unique(business_id, trade, town)
);

-- Claimed listings
create table claimed_listings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  email text not null,
  claimed_at timestamptz default now(),
  chocka_customer boolean default false
);

-- Newsletter subscribers
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  town text not null,
  trade text,
  subscribed_at timestamptz default now()
);

-- Indexes
create index idx_businesses_trade_town on businesses(trade, town);
create index idx_rankings_trade_town_rank on rankings(trade, town, rank);
create index idx_score_history_business_week on score_history(business_id, week_of);
