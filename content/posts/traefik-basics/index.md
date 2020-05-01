---
title: Traefik Basics
date: 2020-05-01
image: https://docs.traefik.io/assets/img/traefik-architecture.png
---

[Traefik](https://docs.traefik.io/) is a cloud native reverse proxy. Which is basically a fancy way of saying it's a reverse proxy with some fancy features. Namely fancy features around auto-discovery, and deep integration with technologies like Docker and Kubernetes.

## Basic concepts

Traefik has 4 fundamental concepts: Entrypoints, routers, middleware and services. In that order.

[Entrypoints](https://docs.traefik.io/routing/entrypoints/) are the ports Traefik listens for traffic on. Generally you'd want one for port 80 and another for 443.

[Routers](https://docs.traefik.io/routing/routers/) are what listen to entrypoints, and match domains and paths to services. A route has a rule, which identifies it, a service, and a set of middleware.

[Middleware](https://docs.traefik.io/middlewares/overview/) run in between the service and the router, and can modify the request or response. Traefik has a number of useful ones built in for adding headers, redirecting, rate limiting and more.

[Services](https://docs.traefik.io/routing/services/) are your applications to route traffic to. A service may be a single container, or multiple in a load-balancing setup. Services can be either HTTP, TCP or UDP.

## Running Traefik

Traefik is available as a single binary, but it runs best under Docker. You can create an incredibly simple docker-compose file to run Traefik correctly.

```yml
version: "2.3"

services:
  traefik:
    container_name: traefik
    image: traefik:v2.2.1
    network_mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik:/etc/traefik
    restart: unless-stopped
```

One thing to note about this is the `network_mode: host`. Traefik needs to be able to access your application containers over the network. You _can_ do this by creating a custom network and adding both traefik and your applications to it. Using host networking means you don't need to do this, as traefik can communicate to all the docker networks automatically. This isn't necessarily recommended, and definitely shouldn't be done for all containers, but I trust traefik not to be doing weird things.

## Traefik configuration

Traefik configuration is split in 2. Traefik's primary configuration can be either YAML or TOML. Configuration for the services themselves can live in many different places. For docker-compose, it's done using container labels.

Traefiks main configuration allows you to configure the entrypoints for traefik to listen on, how TLS is configured, and where traefik should look for services.

The docker configuration for traefik is probably what turns most people off of it. Traefik's configuration may seem verbose to achieve something which would be very straightforward with Nginx or alike. But if you approach things in a different way, they can be very clean.

My typical configuration is very simple:

```yml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.foo.rule=Host(`sub.example.com`)"
  - "traefik.http.routers.foo.tls=true"
  - "traefik.http.routers.foo.tls.certresolver=le"
```

Here, I instruct traefik to route traffic for `sub.example.com` to this container, and issue a certificate for it. Everything else, traefik works out for itself. Which port should traffic be routed to? Use the `EXPOSE` command from the Dockerfile!Which entrypoints to listen on? Listen on them all!

The obvious omission is HTTPS redirection. I do this using a service which listens on any domain, and issues a redirect, whether traefik knows about the domain or not. Since 2.2.0, traefik now as this [built in](https://docs.traefik.io/routing/entrypoints/#redirection).

## The dashboard

When getting started, and even long after that, the traefik dashboard is an incredible too. Listening by default on port 8080, traefik services a read-only web interface showing the current state including routers, services and middleware.

If you're trying to configure a service, and not sure how Traefik is seeing, if it sees it at all. The web interfaces shows you everything.

{{< resource src="traefik-router.png" >}}
Traefik router configuration for this website
{{< /resource >}}

{{< resource src="traefik-service.png" >}}
Traefik service configuration for this website
{{< /resource >}}

## TLS

Traefik supports TLS out the box, both with manually defined keys, and through LetsEncrypt.

When using LetsEncrypt, Traefik will automatically renew certificates when needed, and automatically provision them when new services are added.

On top of HTTP challenges, Traefik also supports DNS challenges, although [more configuration is required](https://docs.traefik.io/https/acme/#dnschallenge).

Unfortunately, Traefik doesn't store its certificates in the usual `.crt` and `.key` formats, instead they're stored in a custom JSON format. This isn't a massive issue, but something to keep in mind if you were hoping to reuse the certificates elsewhere (probably a bad idea anyway).

Configuring TLS is very simple. First, you need to tell Traefik how to generate certificates:

```yml
certificatesResolvers:
  le:
    acme:
      email: you@example.com
      storage: /etc/traefik/acme.json
      httpChallenge:
        entryPoint: web
```

This creates a resolver named `le`, which provisions LetsEncrypt certificates using the `web` entrypoint for HTTP challenges. Then, you tell each service where to get its certificates from:

```yml
labels:
  ...
  - "traefik.http.routers.website.tls=true"
  - "traefik.http.routers.website.tls.certresolver=le"
```

And that's it. After the container is restarted, traefik will issue it a certificate, and keep on top of renewals.

### HTTPS redirection

Now HTTPS is no good if it's not used, and the best way of ensuring that is to redirect HTTP connections to HTTPS automatically. This can be done at a service level, but it's very easy to set it up for all.

We'll do this using the [File provider](https://docs.traefik.io/providers/file/), and create a new router which just redirects all traffic.

```yml
http:
  middlewares:
    hsts:
      redirectScheme:
        scheme: https

  routers:
    hsts:
      service: ping@internal
      rule: PathPrefix(`/`)
      entryPoints:
        - web
      middlewares:
        - hsts
```

The services is set to `ping@internal` just because routers need a service. The ping service is built-in to Traefik, and just returns `200 OK` to all requests, not that it'll be hit, as the `redirectScheme` middleware will redirect traffic before it hits the service.

Now, we just add our newly created file provider:

```yml
providers:
  docker:
    endpoint: unix:///var/run/docker.sock
    watch: true
    exposedByDefault: false

  file:
    filename: /etc/traefik/file-provider.yml
```

And now, all traffic which hits our `web` endpoint will be immediately redirected to HTTPS.

## Traefik and routing to an application

So, what does a fully configured traefik setup look like? I'm glad you asked!

First, you'll need to setup and install traefik, which can be done with a very simple docker-compose file, as shown above. Your default configuration will need to define at least 1 entrypoint.

Once you already have traefik installed and setup, adding services is very simple:

Step 1, pick an application, find a container, and write a minimal compose file:

```yml
version: "2.3"

services:
  whoami:
    image: containous/whoami:latest
    container_name: whoami
    restart: unless-stopped
```

Step 2, add the absolute minimum traefik configuration:

```yml
version: "2.3"

services:
  whoami:
    image: containous/whoami:latest
    container_name: whoami
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(`whoami.example.com`)"
```

Step 3, start your new service with `docker-compose up -d`, and wait a few seconds for traefik to notice it. You can check on the progress of this by refreshing the dashboard until it appears.

Step 4, visit the URL in your browser, and notice traffic being routed correctly.

To add more applications, just start more compose files with more configuration. Traefik will pick up on new containers automatically and start routing traffic, no restart required.

## Should you use Traefik?

This is a more difficult question than it may seem. Personally I'm super happy I migrated from Nginx to traefik, and I know plenty of others you feel the same. If you're trying to manage a number of different docker containers on 1 machine, then traefik is something worth looking into.

However, if you've just got a couple services, and you're comfortable with Nginx, why rock the boat? Both traefik and nginx are reverse proxies, and they're both really good, you're not going to see performance, security, or really simplicity gains by switching. With that said if you're using docker, it's worth a look into anyway.

Using Traefik using only the file provider is definitely not a good idea, and nginx is definitely a better tool for the job!
