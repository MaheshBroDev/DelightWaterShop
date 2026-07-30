-- ==============================================================================
-- DELIGHT WATER SHOP - INITIAL DATABASE SCHEMA & SEED DATA
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table if not exists public.products (
    id serial primary key,
    name text not null,
    description text,
    price decimal(10, 2) not null,
    category text not null,
    image text default '💧',
    in_stock boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    customer_name text,
    customer_email text,
    total_amount decimal(10, 2) not null,
    status text default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Products
insert into public.products (name, description, price, category, image, in_stock) values
('Delight Pure Drinking Water (19L Dispenser Bottle)', 'Pristine mineral-balanced drinking water in a reusable 19L bottle.', 3.50, 'Bottled Water', '💧', true),
('Advanced Reverse Osmosis (RO) Purification System', 'High-efficiency 5-stage RO water purification system for homes.', 299.00, 'Purification Systems', '⚙️', true),
('Hot & Cold Water Dispenser (Stainless Steel)', 'Floor-standing hot and cold water dispenser with stainless steel tanks.', 145.00, 'Dispensers', '🧊', true),
('UV Water Sterilizer Lamp Replacement', '11W UV replacement bulb for water sterilization systems.', 45.00, 'Accessories', '💡', true),
('Alkaline Mineral Filter Cartridge', 'Enhances water pH and adds essential beneficial minerals.', 35.00, 'Accessories', '🧪', true),
('Delight 500ml Bottled Water (Pack of 24)', 'Convenient 500ml pure drinking water bottles, pack of 24.', 8.99, 'Bottled Water', '📦', true)
on conflict do nothing;

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Policies
create policy "Allow public read access on products"
    on public.products for select
    using (true);

create policy "Allow public insert on orders"
    on public.orders for insert
    with check (true);

create policy "Allow public read access on orders"
    on public.orders for select
    using (true);
