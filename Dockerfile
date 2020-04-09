# Site Build
FROM node:lts-slim as build

ENV NODE_ENV production

ENV HUGO_VERSION=0.68.3

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates

ADD https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb /tmp/hugo.deb
RUN dpkg -i /tmp/hugo.deb

COPY . /app

RUN npm ci --production

RUN ./scripts/release.sh

# Production run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/public/ /usr/share/nginx/html
