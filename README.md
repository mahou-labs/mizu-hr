<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/site/public/favicon.svg" />
    <source media="(prefers-color-scheme: light)" srcset=".github/logo-dark.svg" />
    <img alt="Mizu" src=".github/logo-dark.svg" width="48" />
  </picture>
</p>

<h1 align="center">Mizu HR</h1>

Mizu HR is an open-source applicant tracking system (ATS) and hiring platform. Built for modern teams who want full control over their recruitment process without vendor lock-in or per-seat pricing.

## Running Locally

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/mahou-labs/mizu-hr.git
cd mizu-hr
bun install
```

2. Start the PostgreSQL database:

```bash
bun db:start
```

3. Copy the environment files and configure them:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
```

4. Push the database schema:

```bash
bun db:push
```

5. Start the development servers:

```bash
bun dev
```

| App | URL |
|-----|-----|
| API | [http://localhost:3000](http://localhost:3000) |
| Admin | [http://localhost:3001](http://localhost:3001) |
| Site | [http://localhost:3002](http://localhost:3002) |
| Docs | [http://localhost:3003](http://localhost:3003) |

### Useful Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start all services |
| `bun build` | Build for production |
| `bun lint` | Run linter |
| `bun typecheck` | Check TypeScript types |
| `bun db:studio` | Open Drizzle Studio |

## Contributors

<a href="https://github.com/mahou-labs/mizu-hr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mahou-labs/mizu-hr" />
</