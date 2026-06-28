# Production web image for Dokploy (build from repo root).
# Full stack also needs deploy/docker-compose.dokploy.yml for postgres + PostgREST.
#
#   docker build -t event-system-pro-web .

FROM node:22-alpine AS build

WORKDIR /app

COPY front-ends/front-end-cursor/package.json front-ends/front-end-cursor/package-lock.json ./
RUN npm ci

COPY front-ends/front-end-cursor/ ./

ARG VITE_POSTGREST_URL=https://imake.wtf/api
ARG VITE_MAILER_URL=https://imake.wtf/mailer
ARG VITE_REALTIME_WS_URL=wss://imake.wtf/realtime/ws
ENV VITE_POSTGREST_URL=$VITE_POSTGREST_URL
ENV VITE_MAILER_URL=$VITE_MAILER_URL
ENV VITE_REALTIME_WS_URL=$VITE_REALTIME_WS_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
