# Sito Simplyx — immagine statica, nginx senza privilegi di root
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY static ./static
ARG SITE_URL=https://simplyx.it
ARG NOINDEX=0
RUN SITE_URL="$SITE_URL" NOINDEX="$NOINDEX" node src/build.mjs

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
