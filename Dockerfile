# Production web image for Dokploy (build from repo root).
# Full stack also needs deploy/docker-compose.dokploy.yml for postgres + PostgREST.
#
#   docker build -t event-system-pro-web .

FROM node:22-alpine AS build

WORKDIR /app

COPY front-ends/front-end-cursor/package.json front-ends/front-end-cursor/package-lock.json ./
RUN npm ci

COPY front-ends/front-end-cursor/ ./
COPY .git /.git-metadata

ARG VITE_POSTGREST_URL=https://eventsystem.fun/api
ARG VITE_MAILER_URL=https://eventsystem.fun/mailer
ARG VITE_REALTIME_WS_URL=wss://eventsystem.fun/realtime/ws
ARG DOKPLOY_COMMIT_HASH=
ARG GIT_COMMIT=unknown
ARG DOKPLOY_COMMIT_MESSAGE=
ARG GIT_COMMIT_MESSAGE=unknown
ARG GIT_BRANCH=local
ARG GITHUB_REPOSITORY=unknown
ARG BUILD_DATE=
ENV VITE_POSTGREST_URL=$VITE_POSTGREST_URL
ENV VITE_MAILER_URL=$VITE_MAILER_URL
ENV VITE_REALTIME_WS_URL=$VITE_REALTIME_WS_URL

RUN apk add --no-cache git && \
    RESOLVED_COMMIT="${DOKPLOY_COMMIT_HASH:-$GIT_COMMIT}" && \
    if [ -z "$RESOLVED_COMMIT" ] || [ "$RESOLVED_COMMIT" = "unknown" ]; then \
      RESOLVED_COMMIT=$(git --git-dir=/.git-metadata rev-parse --short HEAD 2>/dev/null || echo "unknown"); \
    fi && \
    RESOLVED_COMMIT_MSG="${DOKPLOY_COMMIT_MESSAGE:-$GIT_COMMIT_MESSAGE}" && \
    if [ -z "$RESOLVED_COMMIT_MSG" ] || [ "$RESOLVED_COMMIT_MSG" = "unknown" ]; then \
      RESOLVED_COMMIT_MSG=$(git --git-dir=/.git-metadata log -1 --pretty=%s 2>/dev/null || echo "Not available"); \
    fi && \
    BUILD_TS="${BUILD_DATE:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}" && \
    VITE_GIT_COMMIT="$RESOLVED_COMMIT" \
    VITE_GIT_COMMIT_MESSAGE="$RESOLVED_COMMIT_MSG" \
    VITE_GIT_BRANCH="$GIT_BRANCH" \
    VITE_GITHUB_REPOSITORY="$GITHUB_REPOSITORY" \
    VITE_BUILD_DATE="$BUILD_TS" \
    npm run build

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
