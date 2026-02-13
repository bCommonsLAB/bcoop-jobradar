# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Build-Args für Umgebungsvariablen definieren
ARG MONGODB_URI
ARG MONGODB_DATABASE_NAME
ARG MONGODB_COLLECTION_NAME
ARG SECRETARY_SERVICE_URL
ARG SECRETARY_SERVICE_API_KEY
ARG ADMIN_PASSWORD

# Umgebungsvariablen setzen (mit Dummy-Werten als Fallback für den Build)
ENV MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/dummy}
ENV MONGODB_DATABASE_NAME=${MONGODB_DATABASE_NAME:-dummy}
ENV MONGODB_COLLECTION_NAME=${MONGODB_COLLECTION_NAME:-dummy}
ENV SECRETARY_SERVICE_URL=${SECRETARY_SERVICE_URL:-https://example.com}
ENV SECRETARY_SERVICE_API_KEY=${SECRETARY_SERVICE_API_KEY:-dummy}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD:-dummy}

# Build-Zeit Flag setzen
ENV NEXT_RUNTIME=build

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@9.15.3 --activate

# Nur die notwendigen Dateien kopieren
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Restlichen Code kopieren
COPY . .

# Next.js Build
RUN pnpm build

# --- Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Runtime-Umgebungsvariablen
ARG MONGODB_URI
ARG MONGODB_DATABASE_NAME
ARG MONGODB_COLLECTION_NAME
ARG SECRETARY_SERVICE_URL
ARG SECRETARY_SERVICE_API_KEY
ARG ADMIN_PASSWORD

# Umgebungsvariablen setzen (zur Runtime die echten Werte verwenden)
ENV MONGODB_URI=${MONGODB_URI}
ENV MONGODB_DATABASE_NAME=${MONGODB_DATABASE_NAME}
ENV MONGODB_COLLECTION_NAME=${MONGODB_COLLECTION_NAME}
ENV SECRETARY_SERVICE_URL=${SECRETARY_SERVICE_URL}
ENV SECRETARY_SERVICE_API_KEY=${SECRETARY_SERVICE_API_KEY}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_RUNTIME=runtime

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@9.15.3 --activate

# Nur die notwendigen Dateien kopieren
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Startbefehl
CMD ["pnpm", "start"]
