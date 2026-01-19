-- 1. Reset Table (Drop if exists)
drop table if exists budget;

-- 2. Create Table
create table budget (
  id bigint primary key, -- We will use ID 1 for the single record
  total_budget_per_person numeric,
  costs jsonb, -- Store flexible cost structure
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS (Optional, but good practice)
alter table budget enable row level security;

-- 4. Create Policy (Allow all access for simplicty, since we protect via Client Password)
create policy "Allow All Access" on budget for all using (true) with check (true);

-- 5. Insert Initial Record (Empty)
insert into budget (id, total_budget_per_person, costs)
values (1, 0, '{}'::jsonb);
