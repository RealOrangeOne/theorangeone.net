---
title: Server Setup 2022
date: 2021-12-31
tags: [server-2020, self-hosting]
image: unsplash:uq5RMAZdZG4
---

_The cloud_ is just someone else's computer. In my case, the cloud is usually just my computer. As an avid self-hoster, I like to run a lot of things myself, for learning, privacy, and of course fun. And it's hard to host anything without servers.

I have quite a few servers for various different use cases, switching things up every once in a while. But, at the time of writing, this is what my current setup looks like:

## Home server

My main server is the one which lives at home. I've had some form of server in my house for the last 7 years or so, with the current incantation being from last year. This server does so much, that it requires [its own post]({{<relref "home-server-2022">}}) just to talk about how it's going.

## DNS

My smallest, most bespoke and strangest server is my DNS server. I don't run anything fancy like [pihole](https://pi-hole.net/) (for now), just plain ol' [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html). There's a good reason for this: Partly because I don't want to deal with the headaches of debugging network issues for everyone else in the house, but also because of the hardware constraints: The server is a [Raspberry Pi Model B](https://www.amazon.co.uk/Raspberry-Pi-Model-512MB-RAM/dp/B008PT4GGC) (yes, really). I mostly use this Pi for the bragging rights, but also seems a shame to waste some good silicon. The main reason for this server is so traffic to my home server stays on my LAN rather than running through my VPN gateway. It also acts as a cache, which is another nice touch.

## Monitoring

If a server isn't monitored, does it really exist? How else do you know if it's working correctly? In the interest of reliability, monitoring runs on its own VM, in a different datacentre to the rest of my servers (in this case, France).

For the monitoring itself, I really wanted to like [statping](https://github.com/statping/statping), but recent versions were horrifically buggy, and support basically stopped altogether. Instead, I use [uptime-kuma](https://github.com/louislam/uptime-kuma), a fantastic uptimerobot-inspired monitoring tool to check services are accessible. When an application goes down, uptime-kuma sends both an email and a message to a Matrix room.

I'm also a very big fan of [healthchecks](https://healthchecks.io) for monitoring scheduled tasks, using it for anything I can. I'm currently using the healthchecks hosted service, but in the spirit of self-hosting, I'm planning on hosting that myself too at some point.

## Gateway

My gateway server is my aptly-named gateway to all my servers.

First off, it serves as a [Nebula](https://github.com/slackhq/nebula) gateway. I run Nebula as an overlay network to connect all my servers and devices together. Unlike WireGuard, traffic doesn't flow via the central node - it travels directly between each device. This not only reduces network requirements on said central node, but also massively reduces the latency on connections, especially those on the same network. Nebula isn't perfect, far from it, but for this it works great!

Secondly, it serves as my [VPN gateway]({{<relref "wireguard-haproxy-gateway">}}). Rather than port forwarding on my router, and exposing my home IP to the rest of the world, I route everything via a VPS. Any requests to servers in my house instead are sent to a VPS, forwarded down a WireGuard tunnel and onto my home server, where they are routed by Traefik to their final destination.

Neither of these 2 roles are resource intensive, not by a long shot. For this reason it runs on the smallest instance Vultr offer. You may think most VPS providers just offer the same ol' $5 VM as everyone else, but Vultr, rarely, offer a $3.50 VM with even less RAM. When I installed it, I was a penny-pinching tight-ass, so this tier sounded perfect. Nowadays, it's harder to find that tier on offer, but it's worked fine ever since.

## Dokku

As a professional developer, I find myself quite often building lots of random things to solve problems I have. When said things are web-based, I want somewhere incredibly simple to host them. For almost everything, I just throw the container into `docker-compose`, and it runs from there. But for things I build, I'd much rather it deploy exactly when I want, with minimal interaction. I'd also like deploying new applications to be as simple as possible (without a bunch of Ansible setup), and potentially private (you lot don't need to know _everything_ I run). Yes I realize that's not very IaC-like, but I'll survive.

In the professional world, there are tools like Heroku. But I want to self-host as much as I possibly can, which is where [Dokku](https://dokku.com/) comes in. If you're used to [Heroku](https://www.heroku.com/), Dokku will feel very familiar. It lets me just throw applications with a `Dockerfile` at it (through `git push`), and it handles building, deploying, and ingress.

Dokku isn't perfect, especially as it takes over an entire machine, but for my needs it works pretty well for my needs for now. It's definitely something I'm interested in replacing, possibly with something kubernetes-based (I'm looking at you, [gitkube](https://gitkube.sh/)), but that's more of a longer-term goal.

## General application host

I prefer to run as much as I possibly can off my home server, but in some cases that just isn't appropriate. Mostly due to constraints around the network, reliability and uptime concerns. For that I have a separate VPS which runs anything else I need accessible outside my house.

For the moment, the majority of what this server does is run my [website](/), [Plausible](https://plausible.io/) and a few tiny file host things. When I provisioned it, I had imagined my plan for moving away from a static site to go a little faster than it has done (or to have at least started), and so it would live there. For now given it's just a static site, it's a little overkill, but it leaves ample room to grow or host other things should I need to.

Plausible mostly lives here due some previous issues I had running Clickhouse on my ZFS pool. It's possible those were solved by my [calming measures]({{<relref "calming-down-clickhouse">}}), but it's not especially easy to tell. For now, I wanted it as available as possible to track website usage, so here it shall stay.

## Provider

The majority of my servers are Virtual Private Servers, meaning VMs running on someone else's hypervisor. For me, it's [Vultr]({{<referralurl vultr>}}). I've been a happy user of Vultr for a number of years. Their servers are fast, networks are reliable, and pricing is normal.

With most VPS providers, there's not a huge difference in costs. They've mostly standardized on how much compute $5 will get you, and increase the same amount from there. Unless you're looking at companies like AWS, Google Cloud and Azure, they're all _basically_ the same cost-wise.

{{<block aside>}}
Apparently [Mythic-Beasts](https://www.mythic-beasts.com/order/vps?schedule=month) never got that memo.
{{</block>}}

Whilst Vultr has been great, I'm looking into moving. They've not done anything wrong, I just want to go somewhere else, partly so my money goes somewhere other than a VC-funded company. Currently, the top runner is [Linode]({{<referralurl linode>}}), but we'll see what 2022 brings.
