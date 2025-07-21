FROM node:20-alpine AS base

ARG CONVEX_DEPLOY_KEY

RUN if [ -n "$CONVEX_DEPLOY_KEY" ]; then \
      echo $CONVEX_DEPLOY_KEY; \
    else \
      echo "KEY NOT SET"; \
    fi

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Copy the monorepo structure needed for installation
COPY package.json yarn.lock* turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ ./packages/


RUN echo $CONVEX_DEPLOY_KEY

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules and project files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build only the frontend application
WORKDIR /app
# Copy the env file to the correct location
COPY apps/frontend/environments/prod/.env ./apps/frontend/environments/prod/.env

# Use the build script to build
WORKDIR /app/apps/frontend
RUN yarn run build:prod

# Deploy Convex functions
WORKDIR /app/packages/convex
RUN ls -la
RUN npx convex deploy --yes

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory if it exists

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Copy the entire standalone directory, which includes server.js and node_modules
COPY --from=builder /app/apps/frontend/.next/standalone/ ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/.next/cache ./apps/frontend/.next/cache
COPY --from=builder /app/apps/frontend/.next/static ./.next/static
COPY --from=builder /app/apps/frontend/.next/cache ./.next/cache

COPY --from=builder /app/apps/frontend/public ./public

COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node apps/frontend/server.js