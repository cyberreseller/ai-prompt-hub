# Multi-stage Dockerfile for AI Prompt & Tool Hub
# Production image suitable for Trivy scanning in Lab 6

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/prisma/dev.db"
RUN npx prisma generate
# Create SQLite schema + demo data so the image ships with a ready dev.db
RUN npx prisma db push --accept-data-loss
RUN node prisma/seed.js
RUN npm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/prisma/dev.db"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# public/ is an (intentionally empty) static-assets dir, kept for Next standalone layout
COPY --from=builder /app/public ./public
# prisma/ includes schema.prisma, seed.js and the migrated dev.db
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
