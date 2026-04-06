# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a pnpm monorepo with two apps:

- **`apps/api`** — NestJS backend (TypeScript), runs on port 3000 by default. Follows NestJS module/controller/service conventions.
- **`apps/web`** — React 19 + Vite + TypeScript frontend with HMR.

## Commands

All commands can be run from the repo root or scoped per app.

### Root (runs across both apps)
```bash
pnpm dev          # run both apps in parallel (watch mode)
pnpm build        # build all apps
pnpm lint         # lint all apps
pnpm test         # test all apps
```

### API (`apps/api`)
```bash
pnpm api:dev      # watch mode (nest start --watch)
pnpm api:build    # compile to dist/
pnpm api:test     # jest unit tests
pnpm api:lint     # eslint with auto-fix

# Run a single test file
cd apps/api && pnpm test -- --testPathPattern=app.controller
# E2E tests
cd apps/api && pnpm test:e2e
```

### Web (`apps/web`)
```bash
pnpm web:dev      # vite dev server
pnpm web:build    # tsc + vite build
pnpm web:preview  # preview production build
pnpm web:lint     # eslint
```

## API Structure

NestJS uses a module-centric structure. New features should follow this pattern:
- Create a feature module (e.g. `src/users/users.module.ts`)
- Add controller (`users.controller.ts`) and service (`users.service.ts`) within it
- Import the feature module in `AppModule`

Unit tests live alongside source files as `*.spec.ts`. E2E tests are in `apps/api/test/`.

### REST Principles

Controllers must be strictly RESTful:
- **Resources as nouns**: routes name resources, not actions (e.g. `/users`, not `/getUsers`)
- **HTTP verbs**: `GET` read, `POST` create, `PUT/PATCH` update, `DELETE` remove — never use a verb to compensate for a wrong method
- **Status codes**: `200` OK, `201` Created (with `Location` header), `204` No Content, `400` Bad Request, `404` Not Found, `409` Conflict, `422` Unprocessable Entity — be precise, never return `200` for errors
- **Stateless**: no session state on the server; all context needed to process a request must come in the request itself
- **Consistent response shape**: collections return arrays; single resources return objects; errors return `{ message, statusCode }`
- **Versioning**: prefix routes with `/v1/` from the start

## Web Structure

### Atomic Design

Components in `apps/web/src/components/` are organized by Atomic Design levels:

```
src/
  components/
    atoms/       # base elements: Button, Input, Label, Icon
    molecules/   # combinations of atoms: FormField, SearchBar
    organisms/   # complex UI sections: Header, ProductCard, UserForm
    templates/   # page layouts (slot-based, no data fetching)
  pages/         # route-level components that compose templates + organisms
```

Rules:
- An atom must not import from molecules/organisms/templates
- A molecule can only import atoms
- An organism can import atoms and molecules
- Templates are layout-only — no business logic, no API calls
- Pages are the only layer that fetches data and passes it down

### Tailwind

All styling is done via Tailwind utility classes. No separate CSS files for component styles (global styles in `index.css` only). Avoid inline `style` props.

### Component Tests

Every component must have a co-located test file (`ComponentName.test.tsx`) covering its essential usage. Use the testing library available in the project. Tests must cover at minimum: renders without crashing, and the primary interactive behavior if any.

## Git — Conventional Commits

All commits in both `apps/api` and `apps/web` must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

**Types**: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`, `perf`, `ci`

**Scope**: use the app or module name (e.g. `api`, `web`, `users`, `auth`)

Examples:
```
feat(api): add POST /v1/users endpoint
fix(web): correct Button disabled state styling
test(api): add unit tests for UsersService
refactor(web): extract FormField molecule from LoginForm
```

Breaking changes: append `!` after the type/scope and add a `BREAKING CHANGE:` footer.

## Requirements

- Node >= 22.12.0
- pnpm 9.0.0 (enforced via `packageManager` field)
