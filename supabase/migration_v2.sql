-- ================================================
-- DECORWALL - Migration v2
-- Executa no Supabase SQL Editor
-- Seguro rodar mais de uma vez (IF NOT EXISTS)
-- Não altera tabelas existentes (products, categories, catalogs, catalog_items)
-- ================================================

-- ================================================
-- 1. PROFILES — perfil do usuário com role e aprovação
-- ================================================
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  nome         text,
  email        text,
  telefone     text,
  role         text not null default 'agente'
                 check (role in ('admin', 'agente')),
  aprovado     boolean not null default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Cria perfil automaticamente quando um usuário se registra
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', new.email)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ================================================
-- 2. CLIENTES — empresas/revendedores com CNPJ
-- ================================================
create table if not exists clientes (
  id             uuid default gen_random_uuid() primary key,
  cnpj           text not null unique,
  razao_social   text,
  nome_fantasia  text,
  email          text,
  telefone       text,
  endereco       text,
  numero         text,
  complemento    text,
  bairro         text,
  cidade         text,
  estado         text,
  cep            text,
  situacao       text default 'ativa',
  created_at     timestamptz default now()
);

-- ================================================
-- 3. MATERIAIS — produtos independentes (ex: lona, vinil)
-- ================================================
create table if not exists materiais (
  id           uuid default gen_random_uuid() primary key,
  nome         text not null,
  descricao    text,
  ativo        boolean default true,
  created_at   timestamptz default now()
);

-- ================================================
-- 4. PRODUTOS — catálogo de produtos com preço
-- ================================================
create table if not exists produtos (
  id           uuid default gen_random_uuid() primary key,
  nome         text not null,
  preco        numeric(10,2) default 0,
  quantidade   int default 0,
  ativo        boolean default true,
  created_at   timestamptz default now()
);

-- ================================================
-- 5. ESTAMPAS — imagens vinculadas a categorias
-- ================================================
create table if not exists estampas (
  id           uuid default gen_random_uuid() primary key,
  nome         text not null,
  imagem_url   text,
  category_id  uuid references categories(id) on delete set null,
  ativo        boolean default true,
  created_at   timestamptz default now()
);

-- ================================================
-- 6. PEDIDOS — pedidos de revendedores (sem login)
-- ================================================
create sequence if not exists pedido_seq start 1000;

create table if not exists pedidos (
  id              uuid default gen_random_uuid() primary key,
  numero_pedido   text unique default 'PED-' || nextval('pedido_seq'),
  -- Dados do cliente (CNPJ preenchido no formulário)
  cliente_cnpj    text not null,
  cliente_nome    text,
  cliente_email   text,
  cliente_tel     text,
  -- Itens do pedido
  produto_id      uuid references produtos(id) on delete set null,
  produto_nome    text,  -- cópia do nome caso produto seja deletado
  material_id     uuid references materiais(id) on delete set null,
  material_nome   text,
  -- Especificações
  altura          numeric(10,2),
  largura         numeric(10,2),
  layout_url      text,
  transportadora  text,
  valor           numeric(10,2),
  observacoes     text,
  -- Controle
  status          text default 'novo'
                    check (status in ('novo', 'em_andamento', 'concluido', 'cancelado')),
  created_at      timestamptz default now()
);

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================

alter table profiles    enable row level security;
alter table clientes    enable row level security;
alter table materiais   enable row level security;
alter table produtos    enable row level security;
alter table estampas    enable row level security;
alter table pedidos     enable row level security;

-- Helper: retorna role do usuário autenticado
create or replace function get_my_role()
returns text language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- ── PROFILES ──
drop policy if exists "Usuário vê seu próprio perfil" on profiles;
create policy "Usuário vê seu próprio perfil" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Admin/agente vê todos os perfis" on profiles;
create policy "Admin/agente vê todos os perfis" on profiles
  for select using (get_my_role() in ('admin', 'agente'));

drop policy if exists "Usuário atualiza seu perfil" on profiles;
create policy "Usuário atualiza seu perfil" on profiles
  for update using (auth.uid() = id);

-- ── CLIENTES ──
drop policy if exists "Qualquer um pode cadastrar cliente" on clientes;
create policy "Qualquer um pode cadastrar cliente" on clientes
  for insert with check (true);

drop policy if exists "Admin/agente vê todos os clientes" on clientes;
create policy "Admin/agente vê todos os clientes" on clientes
  for select using (get_my_role() in ('admin', 'agente'));

drop policy if exists "Admin gerencia clientes" on clientes;
create policy "Admin gerencia clientes" on clientes
  for all using (get_my_role() = 'admin');

-- ── MATERIAIS ──
drop policy if exists "Todos lêem materiais" on materiais;
create policy "Todos lêem materiais" on materiais
  for select using (true);

drop policy if exists "Admin gerencia materiais" on materiais;
create policy "Admin gerencia materiais" on materiais
  for all using (get_my_role() = 'admin');

-- ── PRODUTOS ──
drop policy if exists "Todos lêem produtos" on produtos;
create policy "Todos lêem produtos" on produtos
  for select using (true);

drop policy if exists "Admin gerencia produtos" on produtos;
create policy "Admin gerencia produtos" on produtos
  for all using (get_my_role() = 'admin');

-- ── ESTAMPAS ──
drop policy if exists "Todos lêem estampas" on estampas;
create policy "Todos lêem estampas" on estampas
  for select using (true);

drop policy if exists "Admin gerencia estampas" on estampas;
create policy "Admin gerencia estampas" on estampas
  for all using (get_my_role() = 'admin');

-- ── PEDIDOS ──
drop policy if exists "Qualquer um pode criar pedido" on pedidos;
create policy "Qualquer um pode criar pedido" on pedidos
  for insert with check (true);

drop policy if exists "Admin/agente vê todos os pedidos" on pedidos;
create policy "Admin/agente vê todos os pedidos" on pedidos
  for select using (get_my_role() in ('admin', 'agente'));

drop policy if exists "Admin atualiza pedidos" on pedidos;
create policy "Admin atualiza pedidos" on pedidos
  for update using (get_my_role() in ('admin', 'agente'));

-- ================================================
-- ADMIN INICIAL
-- Após rodar, execute este UPDATE com o seu user_id:
-- update profiles set role = 'admin', aprovado = true
--   where email = 'nandomf2@gmail.com';
-- ================================================
