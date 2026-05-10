-- Run this in the Supabase SQL editor.
-- Create a public product table and a storage bucket for product images.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  brand text not null check (brand in ('Nike', 'Essentials', 'ASICS', 'Prada')),
  category text not null check (category in ('sneakers', 'hoodies', 'tracksuits', 'accessories')),
  price integer not null check (price >= 0),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  in_stock boolean not null default true,
  low_stock boolean not null default false,
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

alter table public.products
drop constraint if exists products_brand_check;

alter table public.products
add constraint products_brand_check
check (brand in ('Nike', 'Essentials', 'ASICS', 'Prada'));

alter table public.products
drop constraint if exists products_category_check;

alter table public.products
add constraint products_category_check
check (category in ('sneakers', 'hoodies', 'tracksuits', 'accessories'));

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can insert products" on public.products;
create policy "Authenticated users can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update products" on public.products;
create policy "Authenticated users can update products"
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
on public.products for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
