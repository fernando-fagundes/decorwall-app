# Como fazer o deploy do DecorWall

Siga estes passos na ordem. São 4 etapas simples.

---

## Etapa 1 — Configurar o Supabase

1. Acesse https://supabase.com e entre na sua conta
2. Crie um novo projeto (ex: `decorwall`)
3. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
4. Depois execute o conteúdo de `supabase/seed.sql` (dados iniciais)
5. Vá em **Project Settings > API** e copie:
   - `Project URL`
   - `anon public key`

---

## Etapa 2 — Configurar as variáveis de ambiente

Renomeie o arquivo `.env.local.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## Etapa 3 — Subir para o GitHub

Abra o terminal dentro da pasta `decorwall-app` e execute:

```bash
git init
git add .
git commit -m "Primeiro commit - DecorWall"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/decorwall-app.git
git push -u origin main
```

> Crie o repositório no GitHub antes (https://github.com/new)

---

## Etapa 4 — Deploy no Vercel

1. Crie uma conta em https://vercel.com (pode entrar com o GitHub)
2. Clique em **"Add New Project"**
3. Importe o repositório `decorwall-app` do GitHub
4. Na seção **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy**

Em menos de 2 minutos o site estará no ar com uma URL como:
`https://decorwall-app.vercel.app`

---

## Rodar localmente (opcional)

```bash
cd decorwall-app
npm install
npm run dev
```

Acesse http://localhost:3000

---

## Estrutura do projeto

```
decorwall-app/
├── app/
│   ├── decorwall/      → Homepage
│   ├── catalogo/       → Catálogo + criador de catálogos
│   ├── revendedor/     → Página "Seja um Revendedor"
│   └── login/          → Login / Cadastro
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/supabase/       → Configuração do banco
└── supabase/
    ├── schema.sql      → Tabelas e permissões
    └── seed.sql        → Dados iniciais (produtos e categorias)
```
