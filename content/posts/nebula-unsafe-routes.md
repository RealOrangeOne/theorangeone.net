---
title: Unsafe routes with Nebula
date: 2021-02-02
image: unsplash:Zeu57mprpaI
subtitle: Routing traffic to devices outside Nebula
tags: [linux, security]
---

[Nebula](https://github.com/slackhq/nebula) is a great mesh network I [recently deployed]({{< relref "nebula-intro" >}}) into my stack. For connecting nodes spread between networks, it's great, much better than my previous [wireguard]({{< relref "wireguard-haproxy-gateway" >}}) installation.

An additional feature of nebula is `unsafe_routes`. Unsafe routes allow nodes which don't have Nebula installed to be accessible to other Nebula nodes. Traffic for those nodes is sent via an intermediary node which has access to the devices on its own network. This means you can use a node as a form of gateway to bride to another network, all through Nebula.

As an example, I have a Nebula network of `10.32.32.0/24`. One of the nodes, `10.32.32.3`, is connected to a private network`10.33.33.0/24` I'd like to connect to. My use case for this being I'd like to be able to access all VMs inside my Proxmox server, but without needing to install Nebula on every single one.

{{<mermaid caption="Intended network setup">}}
graph TD

M[Me]
S[Server]

subgraph Proxmox

I["Intermediary (10.32.32.3 & 10.33.33.3)"]

D[VM1]
V[VM2]

end

L[Nebula Lighthouse]

L-.-M
L-.-S
L-.-I

V--10.32.32.2-->I
I--10.32.32.2-->S


M==10.33.33.1==>I
I==10.33.33.1==>D

{{</mermaid>}}

Make sure you trust this network, these routes are "unsafe" for a reason. With this configured, it's possible (with an [extra step](#reverse-routing)) for any device on the `10.23.33.0/24` network to communicate with any device on the Nebula network without authentication. In nebula terms it keeps the firewall group as the intermediary server, but still.

## Adding unsafe routes

The first step is to create some keys for the intermediary server. With nebula, for a device to function as an intermediary gateway, the subnet it's bridging has to be baked into the keys.

```
$ nebula-cert sign -name intermediary -ip "10.32.32.3/24" -subnets "10.33.33.0/24"
```

Then, install that key as normal to your nebula server.

Next, add the configuration for the unsafe routes to your configuration. This entry doesn't need to be added to all nodes necessarily, just ones you want to communicate with the new subnet. Adding it to the intermediary server will throw errors, so don't do that.

```yml
tun:
  ...
  unsafe_routes:
    - route: 10.33.33.0/24
      via: 10.32.32.3
```

At this point, you can restart nebula on any modified devices, and connections will start going through, mostly. Whilst you'll see an advertised route for `10.33.33.0/24` on your machine, only the intermediary will be pingable (using its private IP`10.33.33.3`). Traffic is able to flow just fine from our client via nebula, through the intermediary and to its destination, but it won't come back. This is because the destination servers don't know how to route traffic back to `10.32.32.0/24`, so we need to tell them.

For the rest, we need some `iptables`. I pride myself that iptables plays no part in my infrastructure, or at least I did until this. It's now only 1 rule, so i'll survive. We need to enable NAT so the intermediary device forwards traffic correctly to the rest of the devices on the private network.

```
$ iptables -t nat -A POSTROUTING -s 10.32.32.0/24 -o ens18 -j MASQUERADE
```
`ens18` here is the interface for the `10.33.33.0/24` network.

Once this is done, traffic should flow to devices just fine.

## Reverse routing

Now devices without Nebula installed can be reached through Nebula, great! But what if I want the inverse? What if I want my VMs to communicate with nodes on the Nebula network? Simple:

```
$ ip route add 10.32.32.0/24 via 10.33.33.3
```

This tells those clients to route traffic for the nebula subnet via the intermediary server, which thanks to the NAT rule we just added, will work.

And now, I can access all my proxmox VMs easily, and they can access my other servers with ease, all over an [encrypted mesh network]({{< relref "nebula-intro">}}).
