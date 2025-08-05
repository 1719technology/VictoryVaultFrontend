# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Accept build-time environment variables
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_API_BASE_URL

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm in the builder stage
RUN npm install -g pnpm

# Accept build-time environment variables
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY . .
# COPY .env .env
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Pass runtime env vars (for server-side usage)
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Don't run as root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

RUN npm install -g pnpm

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"] 