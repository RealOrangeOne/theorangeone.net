---
title: Reducing storage usage for Docker in LXC
date: 2021-10-01
image: unsplash:FJTz_ASf_BI
tags: [linux, containers, server-2020, self-hosting]
---

Docker containers (like [onions](https://www.youtube.com/watch?v=GZpcwKEIRCI)) have [layers](https://docs.docker.com/storage/storagedriver/). In your `Dockerfile`, each new `RUN`, `COPY` or `ADD` line creates a new layer (so do the others, but not ones which affect the filesystem). Each layer contains only the files which changed from the previous layer, which allows layers to be shared between containers, reducing download size and disk usage. It's possible to access individual layers though, so don't go adding extra layers to delete secrets in a futile attempt at security.

On a normal system, Docker transparently merges the required layers together with a Union filesystem (similar to [MergerFS](https://github.com/trapexit/mergerfs), if you've heard of it). Docker refers to this as `overlay2` (which is its default [storage driver](https://docs.docker.com/storage/storagedriver/select-storage-driver/)). This creates a single filesystem, compiled from multiple layers without duplicating files. The container sees a single filesystem, but in reality it's multiple stitched together.

Running Docker inside LXC is a great deployment method, but the default `overlay2` driver doesn't work. This is because the LXC doesn't have permission to mount these magic overlay FSs (they're a kernel construct). Instead, it defaults to [`vfs`](https://docs.docker.com/storage/storagedriver/vfs-driver/), which whilst significantly simpler, also has some major issues. Rather than using an overlay to only store the changes on disk, `vfs` does a deep copy of the entire previous filesystem to build the next layer, on top of the previous. This means mounting a container uses significantly more storage, as many of the base OS files are duplicated with each layer, massively increasing disk usage. Because of this, it also means that multiple containers can't share the same underlying layers. Forcing `overlay2` doesn't make things easier:

```
ERRO[2021-09-30T09:24:56.914420548Z] failed to mount overlay: invalid argument     storage-driver=overlay2
ERRO[2021-09-30T09:24:56.914439880Z] [graphdriver] prior storage driver overlay2 failed: driver not supported
failed to start daemon: error initializing graphdriver: driver not supported
```

There is however a solution to this, in the form of FUSE. There exists a userspace implementation of `overlayfs`, known helpfully as `fuse-overlayfs`. Even more helpfully, docker has native support for it. Switching to it is simple:

1. Install `fuse-overlayfs` using your package manager of choice
2. Modify `/etc/docker/daemon.json` and set `storage-driver` to `fuse-overlayfs`
3. Restart Docker
4. Profit?

Note that because I don't use native docker volumes for anything important, I didn't back up `/var/lib/docker` at all in the above. If you are, or want to be extra cautious, it's probably worth doing.

Now, once docker restarts, it's likely none of your containers will be running. This is normal. Now you'll just need to pull and start the previously running containers (you're using something like `docker-compose` to manage your configuration, right?). Containers should start in exactly the same way, and work in exactly the same way. If everything went well, you'll be up and back to normal.

Now, to see the differences. Inside `/var/lib/docker`, Docker stores separate directories based on the storage driver it's using. `du -hs <directory>` will show you the size of each, so you can see how much storage you saved. When I performed this, the `vfs` directory was 18GB, whilst `fuse-overlayfs` was a mere 5GB. 4x saving by doing practically nothing - just how I like it!
