# Get Hugo
FROM jojomi/hugo:0.68.3 as hugo

RUN chmod 0777 /usr/local/sbin/hugo

# Site Build
FROM node:lts-slim as build

ENV NODE_ENV production

WORKDIR /app

COPY --from=hugo /usr/local/sbin/hugo /usr/local/bin/hugo

RUN apt-get update && apt-get install -y ca-certificates

COPY . /app

RUN npm ci --production

RUN ./scripts/release.sh

# Production run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/public/ /usr/share/nginx/html
