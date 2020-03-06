---
title: Why Wireguard
subtitle: ~~whyreguard~~
date: 2020-03-06
---

## What is Wireguard?

The website defines it as "... extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.". Which basically means it's a VPN, but sane. The point of a VPN is to allow 2 machines to talk to eachother, no matter how the network inbetween is setup.

## Modern Features

Wireguard has a lot of nice, modern features.

Roaming, If I shut my laptop, go home, and open it again, the tunnel will be in the same state: just fine! None of this weird messed up state issues where you have to disconnect and reconnect.

Configuration is also incredibly simple. There's just 1 file of configuration, none of this multiple file fun like OpenVPN. Just a single ini file for the server, and a single, very similar, ini file for the client.

Wireguard's authentication model is incredibly simple. The client and server share public keys, and add them to their config files. If you've ever provisioned SSH keys, you'll feel right at home!

Having a simple command-line interface is also really handy to quickly iterate on configuration if something doesn't go right. `wg-quick` has a single command to start/stop a Wireguard connection, whether you're the server or client.

## No customization

Whilst i've said it's got a lot of features, most of them are an inherent part of the system. Wireguard in itself actually doesn't let you custommize much, which sounds like a drawback, but it's really not. There's no complex configuration around authentication, authorization, or any auth backends, nor is there configuration for different encryption standards. You use what's provided, or you use something else.

In this way, Wireguard is very unix-y. If you need to do something Wireguard doesn't, there's a different tool you can use, which will probably do a better job than Wireguard ever could, or should. Most of the time, the tool you want is `iptables`, something I wouldn't wish on my worst enemy.

## Built in, almost

Not that installing Wireguard is especially difficult, but soon it'll be built in, to Linux anyway. As of kernel 5.6, it's right there, ready to use, no installation required. In theory it'll also be backported into Ubuntu 20.04 ready for it's release, so people using LTS versions can be reliably using it for years to come.

Linus Torvalds, the creator of Linux, has a great quote about Wireguard: "Can I just once again state my love for it and hope it gets merged soon? Maybe the code isn’t perfect, but I’ve skimmed it, and compared to the horrors that are OpenVPN and IPSec, it’s a work of art."

## Not _chatty_

Wireguard is a very clean protocol, it'll only send packets when there's something to talk about. There's no handshake needed to setup a tunnel. There's a small handshake needed to keep the tunnel alive if you're behind NAT, but that's about it.  If there's no data to send, there's no data transmitted. On top of this, Wireguard will only respond to authenticated and authorized packets - Any other garbage is just dropped. This maekes it impossible to scan the internet and discover Wireguard servers, which is nice.

## Small

The Wireguard codebase is nice and small. Compared to OpenVPN it's practically microscopic. There's an obvious reason for this, it does a lot lesss. A smaller codebase makes it significantly easier to audit, and less code means there's _theoretically_ less to go wrong.

## Performance

Wireguard is incredibly fast. Take these benchmarks from the Wireguard website, captured over a gigabit network.

{{< resource src="charts.png" >}}
Wireguard benchmarks. [src](https://www.Wireguard.com/performance/#results)
{{< /resource >}}

Not only is Wireguard significantly faster than OpenVPN, and sligtly faster still than IPSec, there's an important extra bit of detail. The Wireguard version was the only one not maxing out the CPU, meaning whatever's limitting Wireguard's score, it's not Wireguard itself, it's likely something far more fundemental like networking overhead, seeing as 1011mb is pretty close to 1 gigabit.

What's yet more scary impressive is this [quote](https://www.Wireguard.com/performance/#performance-roadmap):

> Right now, however, WireGuard is completely unoptimized.

## More

If you're thinking to yoursef "This sounds great, where can I get started?", then you're in luck! Not only is the [Wireguard website](https://www.Wireguard.com/) a pretty good resource, but i've got a pretty good [getting started guide]({{< relref "posts/wireguard-getting-started" >}}), if I do say so myself
