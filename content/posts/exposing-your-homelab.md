---
title: Exposing your Homelab
subtitle: How to **securely** expose your homelab to the internet
date: 2020-04-29
tags: [self-hosting]
image: unsplash:SwVkmowt7qA
---

In the current lockdown situation, a lot of people are starting to eye up that old desktop machine, or Raspberry Pi they bought for a project and just left on a shelf, and thinking of putting it to use, as a server!

Naturally, once you've got something set up in your home, you might want to access it outside the house. Whether it be some bulk storage using [Nextcloud](https://nextcloud.com/), Feed aggregator using RSS, [HomeAssistant](https://www.home-assistant.io/) or even an IRC bouncer. I see questions about this pop up quite a lot, both on [r/selfhosted](https://www.reddit.com/r/selfhosted/) or the [SelfHosted](https://selfhosted.show/) podcast's [discord](https://discord.gg/n49fgkp) (go join by the way!).

One thing I see a lot is people recommending how they do it, or stating how someone should do it (I'm guilty of both!), but very few people give multiple answers, and contrast between them. For someone getting started, it's almost as important to understand _why_ a given approach is important, as it is the approach itself.

## Techniques

I don't think there is one right answer which is applicable for everyone in all cases. There's always a trade off between complexity, security, and features. Here's the most commonly suggested one:

### Don't

An important solution which a lot of people forget about is that it's totally fine to not expose things to the internet. If you're not comfortable in exposing your machines to the internet, don't! As far as security and complexity goes, it's a lot easier - So easy it's the default.

This option by design limits access from the public internet, by hiding everything behind your router's firewall. Your internal IP space is yours, just leave it there!

{{<mermaid caption="Network setup which doesn't allow for external access">}}
graph LR

subgraph Home Network
A[You]
subgraph Home Server
B[Reverse Proxy]
C[Service 1]
D[Service 2]
E[Service 3]
end
end

A-->B
B-->C
B-->D
B-->E
{{</mermaid>}}

This option obviously only applies to infrastructure in your own home. It doesn't make sense for VPS' or alike.

### Port forward

Another very common, very classic way of exposing your machine to the internet is with a good ol' port forward. This involves allowing traffic entering your home router on a certain port to be redirected to your server rather than blocked, which is the default.

With this, you point your domain at your home IP. To allow web traffic, you'll want to forward ports 80 and 443 for HTTP and HTTPS respectively. Not all ports are allowed to be forwarded by all ISPs, for example port 25 (used for SMTP, one of the protocols used for email) is commonly blocked.

Traffic flows directly from the end user, to your home router, and through to your server. This means latency is incredibly low, depending on the nature of your home internet connection.

{{<mermaid caption="Network setup for port forwarding">}}
graph LR

A[End User]

subgraph Home Network
B[Router]
subgraph Home Server
C[Reverse Proxy]
D[Service 1]
E[Service 2]
F[Service 3]
end
end

A-->B
B-->C
C-->D
C-->E
C-->F
{{</mermaid>}}

The main caveat falls around dynamic IPs. Most residential IPs won't give your home a static IP. If you restart your router, or leave it long enough, you'll get a fresh IP. It might be the same, it might not. For this reason, it's not enough to simply set and forget your home's IP, because at some point, it'll change. For this reason you'll also need to run something which periodically updates your DNS records based on your home IP.

Another potential downside, however niche, is that public IPs of residential locations can be used to track down the location. If you're worried about that, or super paranoid, this might not be the solution for you! Because traffic flows direct, it also means that in the event of a spike of network traffic, your home internet connection may be impacted.

### VPN only

In short, a VPN allows you to bridge two isolated networks together. You can use a VPN to access the devices behind your home firewall, from anywhere with an internet connection.

This method works in a very similar way to the Port forward technique above, however rather than opening the ports needed for web traffic, you open up the ports needed for a VPN server, and tunnel your traffic through that. This removes the ability for just anyone to access your applications, and requires you to install client software on any devices which require access, but yields a very secure and versatile connection model. You will however still need to manage dynamic DNS if your house doesn't have a static IP.

{{<mermaid caption="Network setup for VPN-only access">}}
graph LR

subgraph You
A[Browser]
B[Wireguard Client]
end

subgraph Home Network
C[Router]
D[Wireguard Client]
subgraph Home Server
E[Reverse Proxy]
F[Service 1]
G[Service 2]
H[Service 3]
end
end

A-->B
B-->C
C-->D
D-->E
E-->F
E-->G
E-->H
{{</mermaid>}}

Because traffic flows between your device and the VPN server in your house over an encrypted VPN connection, it's incredibly secure regardless of what's going over it - even unencrypted HTTP traffic. This means that assuming your VPN is configured properly, it doesn't matter how the applications themselves are set up.

VPN servers are incredibly lightweight, and will easily run on a Raspberry Pi. [PiVPN](https://www.pivpn.io/) in a great and simple way to get started. Contrary to its name, it can be installed on any Debian-based machine.


### VPN Gateway

An alternative to opening ports and directing users straight to your home router, you can use a VPN as a gateway. This allows you to forward ports to inside your home, but without actually port forwarding. No modifications to your home network are necessary. Users are pointed towards a VPS server, which accepts connections, and forwards the traffic down a VPN tunnel, to your home server.

Because the VPS is doing nothing but pushing traffic, there's almost no resource usage. My gateway server is a one core, 512mb RAM machine and it sits at around 1% CPU usage, and about 60mb RAM.

By using a VPS as a gateway, there's no need to account for dynamic IPs. If your home IP changes, the VPN client in your home will have reconnected to the server automatically, and traffic continue to flow. Users never need to know or care what your home IP is, as traffic always flows via the VPS.

{{<mermaid caption="Network setup using a VPN gateway">}}
graph LR

A[End Users]
subgraph VPS
B[HAProxy]
C[Wireguard Server]
end

subgraph Home Network
D[Wireguard Client]
subgraph Home Server
E[Reverse Proxy]
F[Service 1]
G[Service 2]
H[Service 3]
end
end

A-->B
B-->C
C---D
D-->E
E-->F
E-->G
E-->H
{{</mermaid>}}

In the event of any networking issues, and you want to completely disconnect your servers from the outside world, simply kill the VPS, or stop the VPN client. This will completely disconnect the VPN tunnel, and traffic will hit the VPS without continuing further.

This method, however good it sounds, comes with a number of drawbacks. It's a lot more complex, and has more moving parts than simply forwarding a port. You need to manage a VPN tunnel, connection details, and a whole separate VPS. And with a VPS, comes cost.

With that said, these extra complexities aren't huge, nor especially complicated, and you'll learn a lot whilst doing it!

If you're interested in setting up something like this, I've written articles for both [Wireguard]({{< relref "wireguard-haproxy-gateway" >}}) and [OpenVPN]({{< relref "vpn-gateway" >}}).

## Reverse Proxies

A key component of any of the above techniques is a reverse proxy. A reverse proxy is designed to handle all traffic coming to your server, and route it to the right application. Whether this be some PHP application, a docker container, or a completely different machine. The routing is done based on a path or domain, or both, which allows you to serve many applications all from the same site.

{{<mermaid caption="Reverse proxy routing traffic based on a domain, and mapping it to the correct service">}}
graph LR

A[You]
subgraph Home Server
B[Reverse Proxy]
C[Service 1]
D[Service 2]
E[Service 3]
end

A== 1.example.com ==>B
B== 127.0.0.1:8080 ==>C
B-. 127.0.0.1:3000 .->D
B-. 127.0.0.1:8448 .->E
{{</mermaid>}}

Historically, the most common reverse proxies have been [Apache](https://httpd.apache.org/) and [Nginx](https://nginx.org/), both of which function as full web servers as well as simple reverse proxies. There's no real difference, just use the one you're most comfortable with. However, If you're new to this, I definitely recommend Nginx!

However, if you're using docker, I recommend giving [Traefik](https://docs.traefik.io/) a look. It's a reverse proxy, with automatic SSL provisioning, and auto-discovery of docker containers (once you label them). Traefik can also forward bare TCP and UDP traffic, however I've not played around with those much. With that said, if you're comfortable with Nginx, there's no real need to migrate, it just saves to being explicit with everything. Check [this]({{<relref "traefik-basics" >}}) out for some traefik basics.

## Security

One of the most important things to remember when opening up machines in your house is security. If you don't keep things up to date, then your whole home network can be at risk.

In general, all you need to do is ensure your applications use HTTPS, follow the best practices of the applications, and keep everything up to date.

There are slightly different privacy and security characteristics of each of the above techniques, but most of them are secure enough for anyone's needs.

## Summary

Having a homelab is great, as a learning opportunity, hobby, and a way to take back your privacy. Installing different pieces of software is very well documented, however no one really talks about how to expose them to the internet, properly.

There are many reasons to expose your lab to the internet. Access to your services outside the house, allowing other people access to your services, or hosting completely public services like a blog.

Personally, I run a VPN gateway on [Vultr](https://www.vultr.com/?ref=7167289), and it works really well for my needs. If I don't want a service exposed to the public, I can connect to the VPN tunnel myself and access applications through that.

Like many other things, there's no one right way to expose your homelab, there's always tradeoffs. Hopefully now you've got everything you need to make an informed decision.
