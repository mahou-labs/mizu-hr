# syntax=docker/dockerfile:1

# Build stage
FROM oven/bun:1.3.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (without lockfile since we only have api's package.json)
RUN bun install

# Copy source code
COPY . .

# Build the application (compiles to standalone binary)
RUN bun run build

# Production stage
FROM oven/bun:1.3.0-alpine AS production

WORKDIR /app

# Copy built binary
COPY --from=builder /app/server ./server

# Copy drizzle config and schema for migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/schema ./src/schema
COPY --from=builder /app/package.json ./package.json

# Install dependencies needed for drizzle-kit push
RUN bun install

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthcheck || exit 1

CMD ["sh", "-c", "bunx --bun drizzle-kit push --force && ./server"]
