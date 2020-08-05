---
title: Privacy-respecting analytics with GoAccess
date: 2020-04-10
tags: [self-hosting]
---

Recently, I decided to put some analytics on my website. Would be nice to see what view number are like and what pages get the most traffic.

Most people would just stick [Google Analytics](https://analytics.google.com/) on and be done with. But the privacy implications off that are huge and terrible, not to mention any self-respecting privacy extension would block it almost immediately.

A quick internet search shows a plethora of alternatives which respect privacy, but they don't quite fit my needs.

- [Matomo](https://matomo.org/) is bulky, and overkill for what I need. Not to mention tracks _way_ too much!
- [Fathom](https://usefathom.com/) used to be great, but is now closed source, and the previous "community edition" codebase has little support and is pretty buggy
- [GoatCounter](https://www.goatcounter.com/) is one instance per site, and is a bit weird to work with. And then there's the name.

## Enter GoAccess

[GoAccess](https://goaccess.io/) is an amazing tool to find and analyse log files, and build a report. The report is just simple boring analytics, nothing complex, plain and simple! The reports can either be in the form of a terminal ncurses-line interface, or an HTML report. This HTML report is a single file, so there's no complex server required. The HTML report also supports live update through websockets.

Unfortunately, this websocket functionality requires GoAccess to be exposed on a fixed port relative to the report, which wasn't ideal to my use case. It'd be yet another service to expose, ports to map, firewall rules to open, far too much hassle.

## [`docker-goaccess-static`](https://github.com/RealOrangeOne/docker-goaccess-static/)

To solve my albeit niche, problem, I created a docker container. This container wraps the existing goaccess container, but with a custom entrypoint which generates a static report at interval, rather than websockets. This means it's live updating (or close enough), but without the need to expose a websocket server.

```yaml
version: "2.3"

services:
  website:
    image: nginx:latest
    restart: unless-stopped
    volumes:
      - ./access.log:/var/log/nginx/access.log
      - ./report.html:/usr/share/nginx/html/stats/index.html:ro

  stats:
    image: theorangeone/goaccess-static:latest
    restart: unless-stopped
    volumes:
      - ./report.html:/var/www/goaccess/report.html
      - ./access.log:/goaccess/access.log:ro

```

## Does it work?

Yes, quite well actually! I've got an incredibly simple analytics tool which gives just the information I need. It's performant, it's simple, and has almost 0 runtime overhead.

You can see it in action here: https://theorangeone.net/stats/.

## Issues

GoAccess isn't the perfect tool for everyone. Because it's so simple, it's not especially customizable. Either you use the reporting it gives you, or you find something else.

I've also heard GoAccess can get slow to generate with incredibly large sites, which whilst unlikely to affect me, could happen to someone!

Besides that, this was a great success!
