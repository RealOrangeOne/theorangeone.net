---
title: Docker in LXC
subtitle: A hack or a haven?
date: 2021-09-30
image: unsplash:uyDNkvdIKv8
tags: [linux, containers, server-2020, self-hosting]
---

Docker is a great containerization technology for running applications. It keeps multiple applications completely isolated from each other, only allowing connections exactly when you tell them to. But what if you're on a hypervisor? You want your host OS to be as lean as possible (else it defeats the point), but you don't want the overhead and additional complexities which come from full on VMs?

LXC is the technology for you!

[LXC](https://linuxcontainers.org/lxc/introduction/) (Linux Containers) is a technology which sits somewhere in between VMs and docker containers. It's still a container technology, so shared kernel and all that, but it's designed to run a full persistent OS rather than a throw-away environment for an application. LXC is a great technology for a lot of things, but the differences between it, docker and VMs is a topic for another day.

By running docker inside LXC, you get all the gains of running docker in its own isolated environment away from the host, but without the complexities and overhead that would come with running docker in a full VM.

In a similar vein to this, [DinD](https://hub.docker.com/_/docker/) (docker in docker) exists, which lets you [run docker from inside docker](https://www.docker.com/blog/docker-can-now-run-within-docker/), so long as the outer container is configured correctly. Although it exists, DinD is [definitely not](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) something you'd want to depend on in production. Docker in LXC can have the same issues, but because the technologies are different, and the isolation is different, it actually works far better. In contrast, trying to run LXC inside docker may just open a pathway to hell.

## How

For once, I'm writing an article where the "how-to" section is surprisingly simple:

1. Create an LXC container
    1. Ensure "nesting" is enabled (it is by default in Proxmox)
    2. If using `unprivileged`, ensure the "keyctl" option is also enabled
2. Install Docker (other OCI technologies also available) in the LXC container however you wish
3. Profit?

Yes, it's really that simple! Now, running [`docker run hello-world`](https://hub.docker.com/_/hello-world/) should start a container and work absolutely flawlessly!

For reasons I don't quite understand, I wasn't able to get Alpine linux working as the base OS for the LXC container. I really like Alpine as a minimal base OS, and given everything would be running in docker, the musl _complexities_ didn't bother me. Instead, I just ran Debian, and it worked absolutely perfectly first time. Arch also works perfectly for me, as too I suspect would almost any other distro.

## Storage

[~~Ogres~~ ~~Onions~~](https://www.youtube.com/watch?v=GZpcwKEIRCI) Docker containers have [layers](https://docs.docker.com/storage/storagedriver/). In your `Dockerfile`, each new `RUN`, `COPY` or `ADD` line creates a new layer (so do the others, but not ones which affect the filesystem).

On a normal system, only the changes between each layer are stored on disk, and when a container starts up, it transparently merges them together with a Union filesystem (similar to [MergerFS](https://github.com/trapexit/mergerfs), if you've heard of it). Docker refers to this as `overlay2` (which is its default [storage driver](https://docs.docker.com/storage/storagedriver/select-storage-driver/)). This way, if a layer only changes a few files, only those few files are duplicated, but only the latest can be seen in the container. It's possible to access individual layers though, so don't go adding extra layers to delete secrets in a futile attempt at security.

On LXC however, the default `overlay2` driver doesn't work, because the LXC doesn't have permission to mount these magic overlay FSs (they're a kernel construct). Instead, it defaults to [`vfs`](https://docs.docker.com/storage/storagedriver/vfs-driver/), which whilst significantly simpler, also has some major issues. Rather than using an overlay to only store the changes on disk, `vfs` does a deep copy of the entire previous filesystem to build the next layer, on top of the previous. This means mounting a container uses significantly more storage, as many of the base OS files are duplicated with each layer, massively increasing disk usage. Forcing `overlay2` doesn't make things easier:

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

## But why?

As mentioned before, one of the great things about LXC is that it's not a VM. Not being a VM gives a number of major advantages due to the fact it's a shared kernel.

I personally like to keep as much [storage]({{<relref "server-2020-proxmox">}}#storage) as possible outside the relevant VMs and LXC containers, as it makes backup much easier, and means the machines can be nuked at will should something go wrong (remember cattle, not pets). With a VM, this would require something like NFS or CIFS to mount the storage in, which adds additional network overhead, not to mention not being suitable for some applications (most databases for example really won't like it). With LXC, you can use good ol' bind mounts to just mount in directories or files as you need, with no overhead, meaning it works absolutely fine for databases. If you want the user ids to match up inside and outside the LXC you'll need to enable "privileged" mode, but after that it truly does "just work".

Speaking of passing through mountpoint, [passing through GPUs]({{<relref "lxc-nvidia-gpu-passthrough">}}) is also much simpler. Because it's a shared kernel, and LXC is just isolating processes, the GPU doesn't know it's being controlled by a separate LXC, nor does it care. Meaning you can split up a GPU between multiple LXCs with no issues at all, all whilst allowing the host to keep using it as a graphics output. Passing a GPU through to a VM is a well known process by now, but the host loses access to it. And splitting a single GPU up between multiple VMs is a very [complicated](https://www.youtube.com/watch?v=XLLcc29EZ_8) [process](https://blog.ktz.me/why-i-stopped-using-intel-gvt-g-on-proxmox/).

And of course, that's to say nothing of the reduced overhead. Virtualizing a whole OS adds a lot of extra layers between the containers running your application and the CPU executing their instructions. These layers exist for good reason, they add isolation and allow the VM to be completely different to the host OS. But for a docker container, it's probably going to be a Linux-based guest OS anyway, so why not cut out the abstraction layers and benefit from the extra performance.

I've been running Docker inside LXC for a little under a year now, and it's been absolutely fantastic. I have a few separate LXCs running separate Docker instances for things like monitoring (to keep it separate), but my primary "throw-all" LXC has a number of different docker containers with a number of mount points. I wrote up [an article]({{<relref "server-2020-proxmox">}}) a few months ago about how exactly [my Proxmox server]({{<relref "server-2020">}}) is setup, which may inspire your next server project.
