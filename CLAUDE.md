# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a TypeScript monorepo built with Turborepo that combines multiple technologies into a modern full-stack HR application:

- **Frontend (apps/web)**: React 19 + TanStack Start (SSR) + TailwindCSS + shadcn/ui
- **Backend (apps/api)**: Hono server + oRPC for type-safe APIs + Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Documentation (apps/docs)**: Astro Starlight
- **Shared Packages**: Authentication utilities in packages/auth
- **Tooling**: Biome for linting/formatting, Bun as package manager

The architecture follows a type-safe, end-to-end pattern where:
1. API routes are defined in `apps/api/src/routers/` using oRPC procedures
2. Frontend clients consume these APIs with full type safety via `@orpc/client`
3. Authentication is handled by Better Auth across both frontend and backend
4. Database operations use Drizzle ORM with PostgreSQL

## Essential Commands

### Development
```bash
bun install                    # Install all dependencies
bun dev                       # Start all services (web, api, db studio)
bun dev:web                   # Start only frontend (port 3001)
bun dev:api                   # Start only API server (port 3000)
bun db:studio                 # Open Drizzle database studio
bun dev:email                 # Start email preview server
```

### Database Operations
```bash
bun db:push                   # Push schema changes to database
bun db:generate               # Generate migrations from schema changes
bun db:migrate                # Run pending migrations
bun db:start                  # Start PostgreSQL via Docker Compose
bun db:stop                   # Stop PostgreSQL containers
bun db:down                   # Stop and remove PostgreSQL containers
```

### Build & Quality
```bash
bun build                     # Build all apps for production
bun check-types               # Type check all TypeScript code
bun check                     # Run Biome linting and formatting
```

## Key Patterns

### API Development
- API routes are defined using oRPC procedures in `apps/api/src/routers/`
- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated endpoints
- Context includes session data when authenticated

### Frontend Development
- Routes use TanStack Start file-based routing in `apps/web/src/routes/`
- Protected routes are wrapped with `_app` layout requiring authentication
- UI components use shadcn/ui patterns in `apps/web/src/components/ui/`
- API calls use oRPC client with TanStack Query integration

### Authentication
- Better Auth handles authentication flows
- Shared auth utilities in `packages/auth`
- Session management works across both client and server

### Database Schema
- Schema definitions in `apps/api/src/db/schema.ts`
- Always generate migrations with `bun db:generate` after schema changes
- Use `bun db:push` for development, `bun db:migrate` for production

## Project Structure

```
mizu-hr/
├── apps/
│   ├── web/         # React frontend (TanStack Start)
│   ├── api/         # Hono backend with oRPC
│   ├── docs/        # Astro documentation site
│   └── site/        # Additional site content
├── packages/
│   └── auth/        # Shared authentication utilities
└── [config files]   # Turbo, Biome, TypeScript configs
```