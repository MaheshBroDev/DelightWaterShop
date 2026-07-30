# ==============================================================================
# DELIGHT WATER SHOP - PRODUCTION DOCKERFILE
# ==============================================================================

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Fail the image build if `next build` fails — the runner stage copies the
# standalone output below, so silently skipping here only defers the error.
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# NOTE: COPY does not run in a shell, so "|| true" fallbacks are not allowed.
# These paths are guaranteed to exist because next.config.js sets
# output: 'standalone' and the build above must succeed to reach this stage.
# The standalone output already includes server.js and a minimal package.json.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
