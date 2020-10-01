---
title: Increase your Docker IP space
date: 2020-10-01
image: unsplash:fN603qcEA7g
subtitle: Fixing "could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network"
tags: [containers, self-hosting, linux]
---

Recently, I started setting up a new application on my docker host. It was late in the day, and I just wanted to get something up and working to play around with. Just my luck, I was met with wonderfully cryptic error:

> ERROR: could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network

Not the best start.

## The cause

After doing some digging, and finding a [related issue](https://github.com/docker/for-linux/issues/418):

> When user creates a network without specifying a --subnet, docker will pick a subnet for the network from the static set 172.[17-31].0.0/16 and 192.168.[0-240].0/20 for the local scope networks and from the static set 10.[0-255].[0-255].0/24 for the global scope networks.

This error is caused by Docker running out of IP addresses to allocate to containers. By default, `docker-compose` allocates a `/24` (256 addresses) to each network. A new network is created by default for each `docker-compose.yml`, of which I have quite a few.

It appears that somehow, I've run out of possible address space for Docker to allocate to addresses. Recently, I changed my DHCP server setup so it issues addresses for `192.168.0.0/16`, which means the second block of IP addresses Docker tries to use was unavailable. This leaves just 14 in the `172.xxx` space to be used for compose networks. I have more than 14 `docker-compose.yml` files, hence the issue coming up.

## The solution

The issue above referenced a [feature](https://github.com/moby/moby/pull/36396) in Docker (or more specifically, [Moby](https://github.com/moby/moby)), which allows you to define explicitly the IP space you want docker to use. This way, you can pick one which doesn't conflict with your network, and don't allocate more addresses than you need.

To explicitly add address space for your containers, an entry needs to be added into `/etc/docker/daemon.json`:

```json
{
    ...
    "default-address-pools":[
        {"base":"172.80.0.0/16","size":24},
        {"base":"172.90.0.0/16","size":24}
    ]
}
```

This configuration will allow Docker to allocate `172.80.[0-255].0/24` and `172.90.[0-255].0/24`, which allows a total of 256 addresses to each network, and a total of 512 networks.

The day you hit that limit is the day you've done something wrong!
