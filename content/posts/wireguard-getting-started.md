---
title: Getting started with Wireguard
date: 2019-09-15
---

Wireguard is taking the VPN world by storm, coming very close to the current champion OpenVPN in simple, small-scale deployments. It's just unfortunate few people know about it, and quite how incredible it is!

## What is wireguard?

> WireGuard® is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, simpler, leaner, and more useful than IPsec, while avoiding the massive headache. It intends to be considerably more performant than OpenVPN. WireGuard is designed as a general purpose VPN for running on embedded interfaces and super computers alike, fit for many different circumstances. Initially released for the Linux kernel, it is now cross-platform (Windows, macOS, BSD, iOS, Android) and widely deployable. It is currently under heavy development, but already it might be regarded as the most secure, easiest to use, and simplest VPN solution in the industry.

https://www.wireguard.com/

Wireguard is not only lighter weight than OpenVPN, it's simpler, smaller, and most importantly does less. The final point may to some seem like a bad thing, but is actually great! The Unix Philosophy defines that tools should do 1 thing, and do it well. Wireguard simply creates networks and tunnels, no funky networking, no custom authentication, no complexity.


## Getting started with Wireguard

There is an [official quick start guide](https://www.wireguard.com/quickstart/), however as someone just getting started with wireguard, and has little experience in the Linux network stack, it was a lot to try and understand at once. There is however a much simpler way of getting started: `wg-quick`.

`wg-quick` creates standard wireguard tunnels, but generates the underlying commands for you, even printing them as it goes, so you can see how it's working.

### Installation

With wireguard, the server and client are the same, and so installing either side is just as simple. Wireguard maintain a list of [how to install on various platforms](https://www.wireguard.com/install/), read that! No point duplicating good documentation!

As this creates a new type of network interface, it's highly likely you'll need to reboot.

## Creating a tunnel

### Authentication

Unlike OpenVPN, which (by default) uses a username/password based authentication system, Wireguard works using a public/private key. Keys are used to both verify the client is connecting to the correct server, and that the client is authorized to connect to the server.

Wireguard comes with commands to generate the key-pairs securely:

```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

This creates 2 files, `publickey` and `privatekey` which contain, well, the public and private keys. For security reasons, you should generate the keys on the device which requires the private key, rather than generating them all on the server, and distributing the private key.

### Configuration

Wireguard's configuration lives in `ini` files in `/etc/wireguard/*.conf`, where `*` is the name of the wireguard interface (that'll be useful later).

Be sure to take care when specifying keys. Be sure to specify the correct keys for the correct device, else you'll receive configuration error

#### Server configuration

```ini
[Interface]
Address = 10.1.10.1  # IP of this device on this wireguard network
PrivateKey = <server privatekey>  # The servers private key
ListenPort = 51820  # The port for wireguard to listen on (51820 is the standard)


# Specify 1 "Peer" block for each connecting device
[Peer]
PublicKey = <client publickey>  # The clients public key
AllowedIPs = 10.1.10.0/24  # The IP and mask the client should be assigned
```

Yes, that's really it! This isn't just a simple config, Wireguard just has a super simple configuration!

#### Client configuration

```ini
[Interface]
Address = 10.1.10.2  # The IP the client should take on connection
PrivateKey = <client privatekey>  # The clients private key

[Peer]
PublicKey = <servers publickey>  # The servers public key
Endpoint = <servers ip>:51820  # The IP (or hostname) of the server, along with the port wireguard is listening on
AllowedIPs = 10.1.10.2/32  # The IPs and masks the client should route through the tunnel

PersistentKeepalive = 25  # Ensure connections remain active, especially useful over NAT
```

Notice this configuration is very similar to that of the server, but with a few subtle changes.

### Connection

Now the configuration is installed, it's time to start things up and see if it works!

#### Starting the server

To start the server, simply run `wg-quick up <interface>` (where the interface is the name of the config).

Assuming this didn't output any errors, you should see a new interface in `ifconfig`, with the specified IP allocated to it.


#### Connecting the client

To connect a client, you can also run `wg-quick up <interface>`, and again, you'll see a wireguard interface with the specified IP allocated. `ip route` will also contain some entries for routing the required IP ranges through this new interface.

### _Profit_?

That's it!

There's now an encrypted tunnel setup between your 2 machines, which can be used to send any kind of traffic over, whether it be web traffic, media streaming, or email (if you're reading this guide and thinking about using the tunnel for email, please don't!).

If your needs are simply to forward traffic via another computer / network, or connect devices to the network of another, look past OpenVPN and give Wireguard a shot!
