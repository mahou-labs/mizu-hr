# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

TypeScript monorepo (Turborepo + Bun) for a full-stack HR application:
- **Frontend**: React 19 + TanStack Start (SSR) + TailwindCSS v4
- **Backend**: Hono + oRPC (type-safe APIs) + Better Auth
- **Database**: PostgreSQL + Drizzle ORM
- **UI Package**: Base UI + CVA + Tailwind Merge

## Build & Development Commands

```bash
bun install                    # Install dependencies
bun dev                        # Start all services (web:3001, api:3000, db studio)
bun dev:web                    # Start frontend only
bun dev:api                    # Start API only
bun lint                       # Run OxLint across all apps
bun format                     # Run OxFmt across all apps
bun check-types                # TypeScript type checking
bun build                      # Build all apps for production

# Database
bun db:start                   # Start PostgreSQL via Docker
bun db:push                    # Push schema changes (development)
bun db:generate                # Generate migrations
bun db:migrate                 # Run migrations (production)
bun db:studio                  # Open Drizzle Studio

# Run commands in specific apps
turbo -F api <command>         # Run in API app
turbo -F web <command>         # Run in web app
```

### Testing

Testing libraries installed but no tests exist yet. `@testing-library/react`, `jsdom` available in web app. No test runner configured - will need vitest setup.

## Code Style Guidelines

### Linting & Formatting

- **Linter**: OxLint (not ESLint) - config: `.oxlintrc.jsonc`
- **Formatter**: OxFmt (not Prettier) - config: `.oxfmtrc.jsonc`
- Ignore patterns: `**/*.gen.ts` (generated files)

### TypeScript Configuration

- Target: ESNext with bundler module resolution, strict mode
- Additional checks: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`
- Path aliases: `@/*` maps to `./src/*`

### Import Organization

```typescript
// 1. External packages
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
// 2. Internal aliases
import { orpc } from "@/utils/orpc-client";
import { Button } from "@mizu-hr/ui/button";
// 3. Relative imports
import { protectedProcedure } from "../utils/orpc";
```

### Naming Conventions

- **Files**: kebab-case (`job-router.ts`)
- **Components/Types**: PascalCase (`JobsRoute`, `EmploymentType`)
- **Functions/Variables**: camelCase (`formatSalary`)
- **Database columns**: snake_case (`organization_id`, `created_at`)

### Error Handling

Use the `tryCatch` utility (Result pattern) with `ORPCError`:
```typescript
import { tryCatch } from "@/utils/try-catch";
import { ORPCError } from "@orpc/server";

const { data, error } = await tryCatch(db.select().from(table));
if (error) {
  throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed", cause: error });
}
```

Error codes: `UNAUTHORIZED`, `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`

### API Development (oRPC)

Routes in `apps/api/src/routers/`:
```typescript
import { protectedProcedure, publicProcedure } from "@/utils/orpc";
import { z } from "zod";

export const myRouter = {
  list: publicProcedure.handler(async () => { ... }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      // context.user, context.session available
    }),
};
```

### Database Schema (Drizzle)

Tables in `apps/api/src/schema/`:
```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const myTable = pgTable("my_table", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
```

Always use UUIDv7 for IDs, snake_case for column names.

### Frontend Routes (TanStack Start)

File-based routing in `apps/web/src/routes/`. `_app/` prefix = protected routes.
```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/_app/jobs/")({
  component: JobsRoute,
});

function JobsRoute() {
  const jobs = useQuery(orpc.job.list.queryOptions());
}
```

### UI Components

Use shared UI package:
```typescript
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardHeader } from "@mizu-hr/ui/card";
```

Components use CVA for variants, `cn()` for class merging.

## Project Structure

```
mizu-hr/
├── apps/
│   ├── api/              # Hono backend
│   │   └── src/
│   │       ├── routers/  # oRPC route handlers
│   │       ├── schema/   # Drizzle table definitions
│   │       └── utils/    # Auth, DB, procedures
│   ├── web/              # TanStack Start frontend
│   │   └── src/
│   │       ├── routes/   # File-based routing
│   │       ├── components/
│   │       └── utils/    # oRPC client, auth
│   ├── docs/             # Astro Starlight docs
│   └── site/             # Marketing site
├── packages/
│   └── ui/               # Shared UI components
└── [config files]
```

## Key Libraries

| Purpose | Library |
|---------|---------|
| API Framework | Hono |
| Type-safe RPC | oRPC |
| Auth | Better Auth |
| Database ORM | Drizzle |
| Frontend | TanStack Start/Router/Query/Form |
| UI Base | Base UI React |
| Styling | Tailwind v4 + CVA |
| Validation | Zod v4 |
