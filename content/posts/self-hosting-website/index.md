---
title: Self hosting my website
date: 2020-04-11
---

A few days ago, I was sharing a [blog post]({{< relref "wireguard-haproxy-gateway" >}}) to someone on the [self-hosted podcast](https://selfhosted.show/) discord, and they asked if I was self hosting my website. Unfortunately, and rather ironically, I had to answer no. I've been intending to move it over to my own server for a while, so this felt like as good of a push as any!

{{< resource src="chat-log.png" >}}
Chat log of me admitting shame
{{< /resource >}}

At the time, my website was hosted on [Netlify](https://www.netlify.com/). If you're looking to host a static site, and don't want to run your own servers, netlify is the right answer! The performance is great, the free plan is wonderful, and the fact content is distributed over their CDN is pretty nice!

## Build Modifications

To get the site working on my home server, the build process would need to change slightly. Netlify automatically discovers the tasks which need doing to install dependencies for your site, and then let you provide a single command to build the site. In my case, all I needed was [Hugo](https://gohugo.io/), NodeJS, and a [specific bash script](https://github.com/RealOrangeOne/theorangeone.net/blob/master/scripts/build.sh) to run. My home server runs is basically a docker host, so the site would need to run from inside a container.

[The container](https://github.com/RealOrangeOne/theorangeone.net/blob/master/Dockerfile) I wrote for this is incredibly simple. Because the website is a static site, the running container doesn't need any fancy additional runtime, just NGINX, making the container tiny! To help with this, the container is split into two stages:

Stage one is based off the nodejs container, where it installs Hugo, installs the production node dependencies, and runs the same custom bash script to build the site into the `public/` directory.

Stage two uses a completely different container as the base, `nginx:latest-alpine`. This ensures the runtime is as minimal as possible. Stage two copies the `public/` directory from stage one into the server root, and installs a [custom NGINX config](https://github.com/RealOrangeOne/theorangeone.net/blob/master/nginx.conf). This custom config adds a few additional headers, recommended by [securityheaders.io](https://securityheaders.com/), enables `X-Forwarded-For`, and sets up logging to be used by a [GoAccess container for analytics]({{< relref "goaccess-analytics" >}}).

## Deployment

This container is built using GitHub actions, automatically on push, and then uploaded to GitHubs package registry. A [docker-compose configuration](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/docker/files/theorangeone.net/docker-compose.yml) is pre-installed on my server, pointed at this container, and with the necessary Traefik rules to route traffic correctly.

To maintain auto-deployment functionality, something I find really important, I run [watchtower](https://containrrr.github.io/watchtower/). Watchtower polls the repositories of all the containers I depend on, and when there are changes, automatically pulls and restarts them. The poll interval is five minutes, so it's a slower update than Netlify, but for my needs it's fine. Generally this is ill-advised as it can cause containers to update unexpectedly, but I pin containers properly, so I'm not worried.

## Success?

It only took a day's worth of tinkering, but my website now runs off my own server, which is quite a nice feeling! If you're reading this post, it clearly worked!
