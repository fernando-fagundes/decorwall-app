# DecorWall - Guia de Deploy

## Stack
- Next.js 14 (App Router) + TypeScript
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- Vercel (hosting)

## 1. Banco de Dados (Supabase)

Execute na ordem no SQL Editor do Supabase:
1. `supabase/schema.sql` - cria as tabelas e RLS
2. `supabase/seed.sql` - insere produtos e categorias

## 2. Deploy no Vercel

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em "Add New Project"
3. Importe o repositório `fernando-fagundes/decorwall-app`
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave anon do Supabase
5. Clique em "Deploy"

## 3. Variáveis de Ambiente

Crie um arquivo `.env.local` (não commitar):
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse http://localhost:3000
