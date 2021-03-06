---
title: Why WireGuard
subtitle: ~~whyreguard~~
date: 2020-03-06
tags: [self-hosting, security]
---

## What is WireGuard?

The website defines it as "... extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.". Which basically means it's a VPN, but sane. The point of a VPN is to allow two machines to talk to eachother, no matter how the network inbetween is set up.

## Modern Features

WireGuard has a lot of nice, modern features.

Roaming, If I shut my laptop, go home, and open it again, the tunnel will be in the same state: just fine! None of this weird messed up state issues where you have to disconnect and reconnect.

Configuration is also incredibly simple. There's just one file of configuration, none of this multiple file fun like OpenVPN. Just a single ini file for the server, and a single, very similar, ini file for the client.

WireGuard's authentication model is incredibly simple. The client and server share public keys, and add them to their config files. If you've ever provisioned SSH keys, you'll feel right at home!

Having a simple command-line interface is also really handy to quickly iterate on configuration if something doesn't go right. `wg-quick` has a single command to start/stop a WireGuard connection, whether you're the server or client.

## No customization

Whilst I've said it's got a lot of features, most of them are an inherent part of the system. WireGuard in itself actually doesn't let you customize much, which sounds like a drawback, but it's really not. There's no complex configuration around authentication, authorization, or any auth backends, nor is there configuration for different encryption standards. You use what's provided, or you use something else.

In this way, WireGuard is very unix-y. If you need to do something WireGuard doesn't, there's a different tool you can use, which will probably do a better job than WireGuard ever could, or should. Most of the time, the tool you want is `iptables`, something I wouldn't wish on my worst enemy.

## Built in, almost

Not that installing WireGuard is especially difficult, but soon it'll be built in, to Linux anyway. As of kernel 5.6, it's right there, ready to use, no installation required. In theory, it'll also be backported into Ubuntu 20.04 ready for its release, so people using LTS versions can be reliably using it for years to come.

Linus Torvalds, the creator of Linux, has a great quote about WireGuard: "Can I just once again state my love for it and hope it gets merged soon? Maybe the code isn’t perfect, but I’ve skimmed it, and compared to the horrors that are OpenVPN and IPSec, it’s a work of art."

## Not _chatty_

WireGuard is a very clean protocol, it'll only send packets when there's something to talk about. There's no handshake needed to set up a tunnel. There's a small handshake needed to keep the tunnel alive if you're behind NAT, but that's about it.  If there's no data to send, there's no data transmitted. On top of this, WireGuard will only respond to authenticated and authorized packets, any other rubbish is just dropped. This makes it impossible to scan the internet and discover WireGuard servers, which is nice.

## Small

The WireGuard codebase is nice and small. Compared to OpenVPN it's practically microscopic. There's an obvious reason for this, it does a lot less. A smaller codebase makes it significantly easier to audit, and less code means there's _theoretically_ less to go wrong.

## Performance

WireGuard is incredibly fast. Take these benchmarks from the WireGuard website, captured over a gigabit network.

![WireGuard benchmarks. [src](https://www.wireguard.com/performance/#results)](charts.png)

Not only is WireGuard significantly faster than OpenVPN, and slightly faster still than IPSec, there's an important extra bit of detail. The WireGuard version was the only one not maxing out the CPU, meaning whatever's limiting WireGuard's score, it's not WireGuard itself, it's likely something far more fundamental like networking overhead, seeing as 1011mb is pretty close to one gigabit.

What's yet more scary impressive is this [quote](https://www.wireguard.com/performance/#performance-roadmap):

> Right now, however, WireGuard is completely unoptimized.

## More

If you're thinking to yourself "This sounds great, where can I get started?", then you're in luck! Not only is the [WireGuard website](https://www.wireguard.com/) a pretty good resource, but I've got a pretty good [getting started guide]({{< relref "posts/wireguard-getting-started" >}}), if I do say so myself.
