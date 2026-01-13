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
turbo -F @mizu-hr/ui <command> # Run in UI package
```

### Testing

Testing libraries installed but no tests exist yet. `@testing-library/react`, `jsdom` available in web app. No test runner configured - will need vitest setup.

## Code Style Guidelines

### Linting & Formatting

- **Linter**: OxLint (not ESLint) - config in `.oxlintrc.jsonc`
- **Formatter**: OxFmt (not Prettier) - config in `.oxfmtrc.jsonc`
- Type-aware linting enabled: `oxlint --type-aware`
- Ignore patterns: `**/*.gen.ts` (generated files like `routeTree.gen.ts`)

### TypeScript Configuration

- Target: ESNext with bundler module resolution
- Strict mode enabled with additional checks:
  - `noUncheckedIndexedAccess`: Array/object index access returns `T | undefined`
  - `noImplicitOverride`: Require `override` keyword
  - `noFallthroughCasesInSwitch`: Prevent switch fallthrough
  - `verbatimModuleSyntax`: Explicit `type` imports required
- Path aliases: `@/*` maps to `./src/*` in each app

### Import Organization

```typescript
// 1. External packages (alphabetical)
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Plus } from "lucide-react";

// 2. Internal monorepo packages
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardHeader } from "@mizu-hr/ui/card";

// 3. Local aliases (@/)
import { Page } from "@/components/page";
import { orpc } from "@/utils/orpc-client";

// 4. Relative imports
import { protectedProcedure } from "../utils/orpc";
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `job-router.ts`, `org-menu.tsx` |
| Components | PascalCase | `JobsRoute`, `EmptyMedia` |
| Types/Interfaces | PascalCase | `EmploymentType`, `RouterAppContext` |
| Functions/Variables | camelCase | `formatSalary`, `jobsData` |
| Constants (maps) | camelCase | `employmentTypeLabels` |
| Database tables | snake_case | `organization_id`, `created_at` |
| Route components | `*Route` suffix | `JobsRoute`, `SettingsRoute` |

### Error Handling

Use the `tryCatch` utility (Result pattern) with `ORPCError`:

```typescript
import { tryCatch } from "@/utils/try-catch";
import { ORPCError } from "@orpc/server";

const { data, error } = await tryCatch(db.select().from(table));
if (error) {
  throw new ORPCError("INTERNAL_SERVER_ERROR", {
    message: "Failed to fetch data",
    cause: error,
  });
}
```

Error codes: `UNAUTHORIZED`, `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`

### API Development (oRPC)

Routes in `apps/api/src/routers/`. Use `protectedProcedure` for authenticated routes:

```typescript
import { protectedProcedure, publicProcedure } from "@/utils/orpc";
import { z } from "zod";

export const myRouter = {
  list: protectedProcedure.handler(async ({ context }) => {
    // context.user, context.session available
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .handler(async ({ input, context }) => { ... }),
};
```

### Database Schema (Drizzle)

Tables in `apps/api/src/schema/`. Use UUIDv7 for IDs, snake_case for columns:

```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUIDv7 } from "bun";

export const myTable = pgTable("my_table", {
  id: text("id").primaryKey().$defaultFn(() => randomUUIDv7()),
  name: text("name").notNull(),
  organizationId: text("organization_id").notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
    .$onUpdate(() => new Date()).notNull(),
});
```

### Frontend Routes (TanStack Start)

File-based routing in `apps/web/src/routes/`. `_app/` prefix = protected routes:

```typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/_app/jobs/")({
  component: JobsRoute,
});

function JobsRoute() {
  const jobs = useQuery(orpc.job.list.queryOptions());
  // ...
}
```

### UI Components

Import from `@mizu-hr/ui/<component>`. Button uses `render` prop (not `asChild`):

```typescript
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@mizu-hr/ui/card";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@mizu-hr/ui/empty";

// Link as button
<Button render={<Link to="/jobs/new" />}>Create Job</Button>

// Icon button
<Button size="icon" variant="ghost"><MoreHorizontal /></Button>
```

Use `cn()` for class merging, CVA for component variants. Icons from `lucide-react`.

## Project Structure

```
mizu-hr/
├── apps/
│   ├── api/              # Hono backend (port 3000)
│   │   └── src/
│   │       ├── routers/  # oRPC route handlers
│   │       ├── schema/   # Drizzle table definitions
│   │       └── utils/    # Auth, DB, procedures, tryCatch
│   ├── web/              # TanStack Start frontend (port 3001)
│   │   └── src/
│   │       ├── routes/   # File-based routing (_app/ = protected)
│   │       ├── components/
│   │       └── utils/    # oRPC client, auth client
│   ├── docs/             # Astro Starlight documentation
│   └── site/             # Marketing site
├── packages/
│   └── ui/               # Shared UI components (@mizu-hr/ui)
│       └── src/components/
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
| Icons | lucide-react |
