---
title: Container processes shouldn't run as root!
subtitle: \"What's wrong with containers running as root?\"
date: 2020-08-18
tags: [self-hosting, security]
image: https://www.threatstack.com/wp-content/uploads/2017/06/docker-cloud-twitter-card.png
---

Docker containers, and containers as a whole, are really just a regular program wrapped in some extra protections provided by the kernel (namely `cgroups` etc) to create isolation, and other interesting features.

Unlike VMs, containers run closer to the host operating system, so close they use the same kernel, meaning it's even more important to protect it. VMs are a much better understood technology, and have a lot more isolation. Most commercial container hosting offerings just [run your containers in VMs](https://cloud.google.com/compute/docs/containers/deploying-containers#how_deploying_containers_on_works), to massively reduce inter-client security issues.

A container is just a single process. Whether that be a web server like Nginx, database like PostgreSQL or an init system like [`s6`](http://skarnet.org/software/s6/overview.html) to spawn and handle even more processes. But, when inside a container, which user does the process run as.

## _"Who does a container run as?"_

By default, containers are run as `root`. `dockerd` (the docker daemon) runs as `root`, and this is normal. `root` is needed to configure certain container aspects needed to function correctly. There may be ways of running without `root`, but it's fine as it is.

## _"What's wrong with containers running as root?"_

There are so many reasons not to run all your processes as `root`. Just because the process is in a container, doesn't mean it's completely protected, nor that these reasons don't apply.

If there's a vulnerability in the application, then an attacker can gain root access into the container. Inside the container, the user is root, and so can do whatever they want in the container. With this, an attacker can not only mess with the application, but potentially install additional tools to help pivot to other devices or containers.

If there's a vulnerability in docker, or the kernel itself, allowing a process inside the container to break out, then they now have a process running on your host as `root`. Game Over.

## Changing the user

Changing the user running prevents the previous issues. Not all containers will just deal with it. Many containers, if configured incorrectly, will stop functioning entirely if you try to change the user without them expecting it.

### Container users

As a container user, you're at the mercy of the container maintainers as to the quality of the support for changing user.

Docker itself supports changing the user using the `--user` argument (or `user` key in `docker-compose.yml`). This argument takes the user id of the user to change the process to. Note that this doesn't change anything else about the container.

[LinuxServer.io](https://www.linuxserver.io/), the makers of a bunch of high-quality containers, use the `$PUID` and `$PGID` environment variables to configure the user and group of the process and related files. This strategy works very well as it'll make sure the application file permissions match the process user, so applications will always have access to their files.

Some applications, like nginx, already handle changing user as part of normal operation. Nginx requires root access to bind to port 80, but the processes handling user requests or executing further scripts (PHP etc) is configured inside nginx itself. For applications like this, changing the user is probably not what you want, and should be handled in the application configuration itself.

### Container maintainers

As a container maintainer, the [`USER`](https://docs.docker.com/engine/reference/builder/#user) keyword in the `Dockerfile` sets the running user. This user will need to be created manually, and any required files should be `chown`-d to match this user.

An alternative approach is to change user at startup. This means the entry point script is still run as `root`, but in much the same way applications like nginx change user, this isn't for very long.  Tools like [`s6-overlay`](https://github.com/just-containers/s6-overlay) make this very easy to manage (this is the same tool [LSIO](https://www.linuxserver.io/) use).

## Concluding

It's not a good idea to have containers running as root, for the same reasons it's not a good idea to run all your processes as root. Some containers still run as root, but perhaps this is for good reason (or they're not fussed).

See a container which runs as `root`? Raise an issue!

You can more about container security at https://docs.docker.com/engine/security/security/.
