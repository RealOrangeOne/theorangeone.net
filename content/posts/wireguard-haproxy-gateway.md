---
title: Wireguard HAProxy Gateway
subtitle: Tunnelling traffic
date: 2020-03-21
---

Last year, I wrote [a post]({{< relref "vpn-gateway" >}}) on setting up OpenVPN-AS as a gateway to a private network. I ran this network setup for quite a while with a lot of success, exposing services on my home network to the public internet, securely.

Unfortunately, there were some issues:

- OpenVPN access server isn't open source
- OpenVPN access server is configured through a web UI, which is another _minor_ attack vector
- OpenVPN access server configuration is complex
- OpenVPN is more resource intensive than necessary
- IPTables is weird to configure
- TLS private keys are installed externally
- HTTP traffic is unencrypted over the VPN
- OpenVPN isn't great at repairing flakey connections

Don't get me wrong, none of these issues are actually that bad - I'm just a perfectionist with time to kill! After doing some research, I found an alternative solution which solves all these issues, and is far simpler to set up. By simplifying the VPN setup, and moving the reverse proxy inside the private network, everything gets much nicer!

# Requirements

The requirements are pretty similar to last time. There's a VPS, and an internal device.

This is where things diverge slightly: [Wireguard](https://www.wireguard.com/)! Since writing the original post, I've had a change to play with Wireguard, and fallen in love with its simplicity.

The VPS will act as the VPN server, as before. This time, I'm using debian, because it's the far superior distribution for this kind of deployment. Realistically any distribution which supports Wireguard will do.

The internal device now simply needs to run the Wireguard client. In this setup, it's also the device which serves the hosted applications, but could easily be used in the same setup as before, proxying to external servers.

The external device now simply forwards incoming traffic downstream, with little to no modification. This is done in a way which doesn't require modifying the packages, and so can be done without access to the TLS private keys, which is important.

# Installation

## Configure Wireguard

Configuring a wireguard tunnel is an incredibly straightforward process. I suggest you read [my getting started guide]({{< relref "wireguard-getting-started" >}}) to find out how to do it.

## Install HAProxy

[HAProxy](https://www.haproxy.org/) is the tool which will forward incoming traffic down the tunnel, without modification. Generally my reverse proxy of choice is NGINX, however HAProxy has a feature which NGINX doesn't: TCP mode.

TCP mode allows HAProxy to forward packets without the need to decode it. This not only allows non-HTTP traffic to be routed, but also doesn't require the TLS certificates to listen to connections. TCP doesn't care about any of that.

HAProxy is generally used as a load balancer, but it works perfectly fine with a single backend.

## Enable automatic connections

When building a tunnel like this, it's important for each end of the tunnel to reconnect in the event of issues. This was an incredibly annoying caveat with OpenVPN, but wireguard deals with this very well.

To do this, we simply enable a systemd service, based on the name of the config file. If the config is at `/etc/wireguard/my-tun.conf`, then enable `wg-quick@my-tun.service`.

## Forward traffic down the tunnel

Once the VPN connections are reliable, it's time to forward traffic. To do this, you'll need to have a service setup on the client to receive the traffic. For testing, `python3 -m http.server` will probably work fine.

With the destination port, you can add the required HAProxy configuration. Add an entry which listens on a port (likely the same as the destination), with a backend set to the internal VPN IP of the client, on the destination port.

```
listen https
  bind *:443
  mode tcp
  server default 10.1.10.2:443 send-proxy
```

Once this is added, restart HAProxy, and you're done. Open the remote IP on the port you set it to listen on, and watch as you see a request from the client be responded to. And because this is in TCP mode, this traffic can be anything (TCP based, obviously). Need something secure, set up an SSL cert with NGINX, and that'll work with no further configuration.

## Maintaining IPs

An unfortunate downside with this approach is that because HAProxy proxies the packets, downstream clients see the IP of the VPS rather than of the end user. The solution to this in HTTP world is `X-Forwarded-For` header, which is added by any well reputed reverse proxy.

The solution to this in the TCP world is [proxy protocol](https://www.haproxy.com/blog/haproxy/proxy-protocol/). Proxy Protocol isn't an additional protocol in itself, it's an extension to TCP which allows a forwarded IP to be added separate to the source, which can then be used downstream to get the correct IP.

Proxy Protocol does have some issues, namely with how it's implemented with NGINX. Because of how it's implemented, if a `server` is set up to accept proxy protocol requests, it *only* accepts proxy protocol - Sending regular packets results in an error, and vice versa. This probably isn't a massive issue, just something to consider.

If you're using docker, [Traefik](https://docs.traefik.io/) accepts both proxy protocol and regular traffic at the same time, so I recommend checking that out!

## Wrapping up

Web traffic comes in to your VPS, is received by HAProxy, has proxy protocol details added, forwarded down a wireguard tunnel, and to your internal applications, all with almost no overhead.

{{<mermaid caption="Network layout">}}
graph LR

A[End Users]
subgraph VPS
B[HAProxy]
C[Wireguard Server]
end

subgraph Home Server
D[Wireguard Client]
E[Traefik]
F[Service 1]
G[Service 2]
H[Service 3]
end

A-->B
B-->C
C---D
D-->E
E-->F
E-->G
E-->H
{{</mermaid>}}

With this, you can expose services to the internet, without exposing your home IP, without dealing with dynamic IP addresses, and without relying on your router's firewall.

Next step: Enabling internal-only services, but with an externally valid TLS certificate. But that's a topic for another day.
