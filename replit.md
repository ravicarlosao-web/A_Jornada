# Jornada

A football career simulation game where players manage their journey from draft to Hall of Fame. Supports two modes: Modo Rápido (quick sessions) and Carreira Completa (full career management with training, fitness, negotiations, dressing-room relationships, and coach interviews).

## Run & Operate

- `pnpm --filter @workspace/jornada run dev` — run the frontend game (port 18651, served at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — runtime-managed by Replit (auto-injected, do not set manually)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS 4, Wouter (routing), Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle for api-server)

## Where things live

- `artifacts/jornada/src/` — React frontend (game screens, state, engine)
- `artifacts/jornada/src/engine/engine.ts` — core simulation engine (client-side)
- `artifacts/jornada/src/state/useCareer.ts` — career state management
- `artifacts/jornada/src/state/hallDaFama.ts` — Hall of Fame (syncs to API + localStorage fallback)
- `artifacts/api-server/src/` — Express backend
- `lib/db/schema.ts` — Drizzle schema (source of truth for DB)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — generated React Query hooks (do not edit)
- `lib/api-zod/` — generated Zod schemas (do not edit)

## Architecture decisions

- Game engine is entirely client-side; the API is non-critical (Hall of Fame only falls back to localStorage if API is unreachable)
- `DATABASE_URL` is runtime-managed by Replit — never set it manually as a secret
- API codegen (Orval) generates hooks from `lib/api-spec/openapi.yaml`; always run codegen after changing the spec
- pnpm workspace enforces 1-day minimum release age for packages (supply-chain defense); `@replit/*` packages are excluded

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, always run codegen before touching generated files
- After changing `lib/db/schema.ts`, run `pnpm --filter @workspace/db run push` to sync the dev DB
- Do not edit files under `lib/api-client-react/` or `lib/api-zod/` — they are generated

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
