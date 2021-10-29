---
title: LXC vs Docker
date: 2021-10-29
image: unsplash:NndKt2kF1L4
tags: [linux, containers, self-hosting]
---

Both LXC and Docker are great containerization technologies, brought to you by the powers of the Linux kernel. At their core, they're pretty similar, but the further out you look, the differences increase massively. At their heart, they're both still containers - understanding the differences between the 2 takes a bit of fundamental context:

## What is a container?

When you think containers, most people think (and assume) Docker, but that's not necessarily the case. Docker is a container technology, but not all containers are Docker - "Containers" is more of a pattern than a specific implementation. There are a bunch more, but Docker is definitely the most common, by quite a margin.

What used to be Docker containers are now known as [OCI](https://opencontainers.org/) (Open Container Initiative) containers. In recent years, Docker has become far from the only container technology, and far from the only one which works in the way it does. [Podman](https://podman.io/) from Red Hat is probably the biggest alternative, which uses the same "recipes" (`Dockerfile`s), the same container format, and would even run containers built using Docker. For that reason, the naming had to change. Docker is still the largest deployed implementation, and [Docker Hub](https://hub.docker.com/) the largest repository of containers, but it's not all about Docker any more. Kubernetes in fact _recently_ [deprecated](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/) support for Docker. To save confusion and make things easier, from now on when I mention "Docker", I really mean "OCI-compatible tool".

A "container" is simply a process, much like any other, with some specific protections in place around it. [cgroups](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html), namespaces, [seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html) and more work together to produce a well isolated environment for an application to run in without risk of it affecting the host OS. Because a container requires a bunch of kernel primitives, it's the same kernel in the container as it is outside. For that reason, containers are generally limited to the kernel of their host.

A VM is still isolated, but it's far more than just a process, it's a whole OS. Because it needs to run a whole OS, which may not be Linux or even x86 based at all, there's significantly more isolation. Breaking out of environments is still always bad, but at least with a VM there are several more hoops to jump through, and that's before you consider what protections may be running in the VM's OS itself. This further VM isolation comes at the cost of increased overhead, and thus there may be a performance penalty.

![Containers versus Virtual Machines (src: Docker)](https://i1.wp.com/www.docker.com/blog/wp-content/uploads/Blog.-Are-containers-..VM-Image-1-1024x435.png)

## What is LXC?

[LXC](https://linuxcontainers.org/lxc/introduction/) (Linux Containers) is another container technology for isolating processes, much like Docker. LXC is a far less known and far less used technology, but it's really cool and has some great use cases. If you're a Proxmox user, [like me]({{<relref "server-2020-proxmox">}}), then you've likely seen the ["Create CT"](https://pve.proxmox.com/wiki/Linux_Container) button and wondered what it is - it's not their own container technology, it's not Docker, it's LXC!

However, whilst the isolation primitives are shared between LXC and Docker, the use cases could not be further apart.

When applications run in Docker containers, they're designed to be short-lived. If the application needs an update? Stop it, delete it, and start up another fresh one from the downloaded container. Configuration change? Same deal. Just want to restart the app, it's possible to do without deleting, but often deleting and startup up fresh is the cleanest way. This way, you can know for sure that the application is stopped, and that when started up again, it's in exactly the state it should be, minus any persisting data you've explicitly mounted in. It's not possible for the application to start randomly writing files to other directories, because on restart they're completely removed.

LXC on the other hand is much closer to a VM in its usage. When you provision an LXC container, you get a full Linux-based OS to play with (minus a kernel), where everything persists. Yes you can mount external storage in if you'd like, but the LXC's storage itself will persist. This way, you can build up the contents of the OS however you'd like, installing software however you'd like - in exactly the same way you would a VM. When software needs updating, you update it inside the LXC exactly as if it weren't in LXC at all (in Docker, this is basically a sin).

With Docker containers, you generally define a base OS template (eg `FROM alpine:3.14`) or even one with a language or framework installed for you (eg `FROM rust:stable`) and define the steps to go from that to your full application from there. Whether that be packages to install, files to copy, or commands to run. LXC doesn't have this concept. Yes you still use OS templates as a starting ground, but from there any customization is down to you to do and manage. Tools for regular server administration such as Ansible, Chef and Puppet are perfect for this. Whilst there are pre-built LXC templates, there isn't an application repository in the same there is with Docker Hub. The closest there is in the LXC world is [turnkeylinux](https://www.turnkeylinux.org/), which have a number of great applications configured and ready to go (and available for download in the Proxmox UI).

In terms of lifecycle, features, and intended use cases, LXC is very similar to [BSD's jails](https://docs.freebsd.org/en/books/handbook/jails/).

## Docker Containers or LXC?

You may be reading this thinking "Well LXC sounds cool, but why do I need it? Docker works just fine for my needs", and you're almost certainly correct. LXC is **not** a replacement for Docker, nor is it trying to be. If you want to run someone else's application, Docker is still the easiest way to get started. If instead you want to run a VM, but are after something with less overhead, and easier storage mounting, then maybe give LXC a go?

Hypervisors are a great way to run multiple isolated environments on a single machine. If you're going to run Docker containers, please don't run them on the hypervisor OS itself - you want that to be as clean as possible. Before now, you may have reached for the comfort of a VM, but [Docker inside LXC]({{<relref "docker-in-lxc">}}) gives all the benefits of Docker, but the reduced overhead of LXC compared to a VM - all without tainting the host OS.

[@FuzzyMistborn](https://blog.fuzzymistborn.com/) described the differences and uses between the 3 far more succinctly than I:

> Docker runs applications, LXCs run OSs, VMs run machines

So, tl;dr: That :arrow_up:
