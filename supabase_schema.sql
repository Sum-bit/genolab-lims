-- Run this in Supabase SQL Editor → New Query

create table if not exists samples (
  id               bigint generated always as identity primary key,
  sample_id        text not null unique,
  patient_name     text not null,
  test_type        text not null check (test_type in ('Blood Count','DNA Sequencing','Urinalysis','Tissue Biopsy','Hormone Panel')),
  date_received    date not null,
  collection_center text not null,
  status           text not null default 'Received' check (status in ('Received','In Testing','Completed','Flagged')),
  result           text,
  created_at       timestamptz default now()
);

-- Row Level Security
alter table samples enable row level security;

create policy "Authenticated users can read samples"
  on samples for select to authenticated using (true);

create policy "Authenticated users can insert samples"
  on samples for insert to authenticated with check (true);

create policy "Authenticated users can update samples"
  on samples for update to authenticated using (true);

create policy "Authenticated users can delete samples"
  on samples for delete to authenticated using (true);
