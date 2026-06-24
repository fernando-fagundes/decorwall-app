-- DECORWALL - Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  product_id uuid references products(id) on delete set null,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists catalogs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists catalog_items (
  id uuid default gen_random_uuid() primary key,
  catalog_id uuid references catalogs(id) on delete cascade not null,
  category_id uuid references categories(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(catalog_id, category_id)
);

alter table products enable row level security;
alter table categories enable row level security;
alter table catalogs enable row level security;
alter table catalog_items enable row level security;

create policy "Produtos visiveis" on products for select using (true);
create policy "Categorias visiveis" on categories for select using (true);
create policy "Usuario ve seus catalogos" on catalogs for select using (auth.uid() = user_id);
create policy "Usuario cria seus catalogos" on catalogs for insert with check (auth.uid() = user_id);
create policy "Usuario deleta seus catalogos" on catalogs for delete using (auth.uid() = user_id);
create policy "Usuario ve itens" on catalog_items for select using (exists (select 1 from catalogs where catalogs.id = catalog_id and catalogs.user_id = auth.uid()));
create policy "Usuario adiciona itens" on catalog_items for insert with check (exists (select 1 from catalogs where catalogs.id = catalog_id and catalogs.user_id = auth.uid()));
create policy "Usuario remove itens" on catalog_items for delete using (exists (select 1 from catalogs where catalogs.id = catalog_id and catalogs.user_id = auth.uid()));
