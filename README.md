# Academy — Frontend

Frontend multi-tenant da Academy: treinamentos e catálogos (upload e listagem de PDF). Autenticação com Clerk e controle de acesso por roles (RBAC).

## Stack

- Next.js 15 (App Router)
- TypeScript, Tailwind CSS v4, ShadCN (Radix UI)
- Clerk (auth), Axios, React Query, Zod

## Setup

1. **Dependências**

   ```bash
   npm install
   ```

2. **Variáveis de ambiente**

   Copie `.env.example` para `.env.local` e preencha:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`: obtidos no [Clerk Dashboard](https://dashboard.clerk.com).
   - `NEXT_PUBLIC_API_URL`: URL do backend (ex.: `http://localhost:3001`). Opcional até o backend existir; a listagem usa mock.

3. **Executar**

   ```bash
   npm run dev
   ```

   Acesse `http://localhost:3000`. A raiz redireciona para `/sign-in` ou `/dashboard`.

## Rotas

- `/` — Redireciona para `/dashboard` (logado) ou `/sign-in`
- `/sign-in`, `/sign-up` — Clerk
- `/dashboard` — Home do dashboard
- `/catalogos` — Listagem de catálogos (requer role que pode listar)
- `/catalogos/upload` — Upload de PDF (requer admin ou manager)

## RBAC

Roles em `src/types/auth.ts`: `admin`, `manager`, `viewer`. O frontend lê o role de `user.publicMetadata.role` (Clerk). Configure no Clerk Dashboard ou via backend ao criar/atualizar usuários.

## Design

Paleta pastel + preto e uso no código em [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## Backend

A API e o banco ainda não existem. Documentação para outro agente implementar:

- [docs/backend/API_SPEC.md](docs/backend/API_SPEC.md) — Endpoints e contratos
- [docs/backend/DATABASE.md](docs/backend/DATABASE.md) — Entidades e migrations
- [docs/backend/AUTH_AND_RBAC.md](docs/backend/AUTH_AND_RBAC.md) — Auth Clerk e RBAC

## Scripts

- `npm run dev` — Desenvolvimento
- `npm run build` — Build de produção (funciona sem env; com Clerk configurado, auth e rotas protegidas funcionam)
- `npm run start` — Servir build
- `npm run lint` — ESLint
