---
title: LAN-only applications with TLS
date: 2020-10-19
tags: [self-hosting]
image: unsplash:daWlqHGWxFk
---

The internet is a wild place, filled with well, everything. There are many ways of exposing an application to the internet, but no matter how secure an application claims to be, or how confident you are with your infrastructure, sometimes you may just be more comfortable keeping it internal.

Historically, internal applications have been accessed with an IP and port: `192.168.1.200:32400`. This works, but it's far from nice as it's hard to remember which port is which application (this is why we have DNS). For internet-facing applications, you'd add a DNS record for your domain, and point that to a reverse proxy which maps the domain to the port of the actual application. But what about internal-only applications? The `.local` TLD is designed for use on local networks, allowing you to access machines using `hostname.local`, but what if you wanted to use your own domain (`service.yourdomain.com`)? And what about TLS?

## How?

### Internal DNS server

If you were to visit `service.yourdomain.com` in a browser, you'd be presented with an error. The reason for this is simple: your computer has no idea where `service.yourdomain.com` is, nor that it's meant to be your home server at `192.168.1.200`. You could get around this by adding a DNS record pointing to `192.168.1.200`, but It's considered bad practice to have internal IPs on public records. Instead, we're going to need to override our DNS settings on our LAN so that all devices on our network know `service.yourdomain.com` is actually available at `192.168.1.200`, without needing to specify it manually.

The set up process for this varies slightly depending on your home network, but really there's just 2 key steps:

#### 1. Creating a custom DNS server

To run your DNS server, you'll just need a device _somewhere_. In theory, it could be on the internet, but personally I like to keep these internal things inside my house (and if you're reading this, so do you). Personally I use a Raspberry Pi 1A (yes really) but it could be your server, a VPS, anything. You'll need to make sure it's always available and reliable, as if it goes down your internet will feel much slower, and DNS queries will take far longer to complete.

For the server application itself, I use [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html). Here's an example dnsmasq configuration based on the one I'm using:

```
server=1.1.1.1
server=1.0.0.1
server=192.168.1.1

strict-order
dns-loop-detect
no-resolv
no-poll

host-record=service.yourdomain.com,192.168.1.200
```

Notice the final line adds a record for `service.yourdomain.com` pointing to `192.168.1.200` - that's the important bit. Now any DNS queries to this server for `service.yourdomain.com` will point to your server - perfect! For domains dnsmasq doesn't know, it forwards them through Cloudflare's DNS servers (`1.1.1.1` and `1.0.0.1`). I've added my gateway server here too (`192.168.1.1`) so any other local records my router exposes (like mDNS) continue to work.

If you're already running a service like [pihole](https://pi-hole.net/) for your LAN, you can easily just add the required records there.

####  2. Deploying your custom DNS server

Unfortunately there's no real standard for configuring a custom DNS server for your network. The gist of things is it'll be somewhere in your router settings, but if you're unsure it's best to look up a guide based on your specific router. Be sure to set a secondary DNS server to something stable (eg `1.1.1.1`), otherwise whilst your DNS server is offline, so is your internet.

### DNS Challenge

Now that devices on the LAN know that `service.yourdomain.com` is your home server and can route traffic to it, we need to set up TLS so the connection is secure.

[ACME](https://tools.ietf.org/html/rfc8555), the protocol behind [LetsEncrypt](https://letsencrypt.org/), supports 2 ways (challenges) to get an automated certificate: HTTP and DNS. Because of the way the DNS challenge works, in that it can prove ownership of an entire domain rather than a specific subdomain, LetsEncrypt can issue less specific certificates, because it can make more guarantees about the entire domain. These additional certificate features include wildcard certificates and what we need: Issuing certificates to internet inaccessible servers.

[Traefik]({{< relref "traefik-basics" >}}), my reverse proxy of choice, has built-in support for ACME. Other reverse proxies may have built in support (eg [Caddy](https://caddyserver.com/)), else you can use [Certbot](https://certbot.eff.org/docs/using.html), which integrates nicely with servers such as Nginx and Apache.

The only trouble with the DNS challenge is that it requires a supported DNS provider. The list of supported providers for both [Certbot](https://certbot.eff.org/docs/using.html#dns-plugins) and [Traefik](https://doc.traefik.io/traefik/https/acme/#providers) are large, and likely covers 90% of users, but it's not complete. I currently use Cloudflare for my DNS, which is one of the supported providers, so no issues there. You can of course run the DNS challenge manually, but this requires manual intervention every 90 days.

## Drawbacks

_In theory_, there are very few drawbacks of this approach. Obviously there are more moving pieces and thus more to maintain over sticking to IPs and ports. Once it's up and running, there's very little work to maintain. Certbot will keep renewing your certificates, and so long as you keep everything updated (which you should do anyway) it should keep working.

The largest drawback is that the services are only accessible to your LAN. If you leave your LAN, you leave with it your access. There are of course ways around that, namely using VPNs, but that's a conversation for another time. If you're reading this, that's probably not a huge deal for you.

Check out [exposing your homelab]({{< relref "exposing-your-homelab" >}}) for some other ways of accessing your services.
