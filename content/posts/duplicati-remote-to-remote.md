---
title: Remote to remote backups with Duplicati
subtitle: "Duplicati + Rclone = :heart:"
date: 2020-05-22
---

[Duplicati](https://www.duplicati.com/) is one of my favourite backup system. It's pretty fast, supports a large number of backup sources, and has a nice configuration web UI. Unfortunately however, it can't be used to backup remote files. In fact, I can't find a nice fully-features backup solution which does do this, which sucks.

Another great tool is [`rclone`](https://rclone.org/), which lets you list, download, upload and modify remote files. Because of this, you can use Rclone as a naive backup system, but it's not quite as powerful as Duplicati.

One of Rclone's most powerful features is the ability to [mount remotes](https://rclone.org/commands/rclone_mount/) as filesystems on your local machine. This means you can access files as if they were on your machine, but without needing to download them.

Wouldn't it be great if you could combine the remote mounting features of rclone, with the backup system of Duplicati?

## Solution

My solution? Do just that! Have rclone mount the remotes I need, and point Duplicati to those as sources, for it to backup elsewhere. To make this simpler, especially in a dockerized world, I created a container to handle this for you: [`docker-rclone-mount`](https://github.com/RealOrangeOne/docker-rclone-mount).

`docker-rclone-mount` will mount rclone remotes based on a configuration on your host, which can then be passed into the Duplicati container for it to backup from.

## Setup

First, create a compose entry for `docker-rclone-mount`. Putting it in the same compose file as Duplicati makes life easier.

```yml
rclone:
  image: theorangeone/rclone-mount:latest
  cap_add:
    - SYS_ADMIN
  security_opt:
    - apparmor:unconfined
  devices:
    - "/dev/fuse:/dev/fuse"
  environment:
    - PUID=1000
    - PGID=1000
  volumes:
    - "./rclone.conf:/config/rclone.conf:ro"
    - "./rclone-mounts.txt:/config/config.txt:ro"
    - "./mounts:/mnt:shared"
```

Then, mount the `mounts` directory into your Duplicati container:

```yml
volumes:
  ...
  - "./mounts:/source/mounts:shared"
```

Note the use of `:shared` on the end of both mounts. This is important as it allowed docker to pass through the FUSE mounted filesystems correctly. Removing this from either side will prevent the filesystems being exposed correctly.

Next step is to setup your rclone remote, which is best done through the rclone CLI. I recommend installing and configuring your remotes locally, and copying the config over, as it lest you ensure everything works correctly without having to jump around docker.

Final step is to tell `docker-rclone-mount` to mount your remote. This is done using the config file at `/config/config.txt`. The file contains an rclone remote, and a destination mount inside the container relative to `/mnt`, separated by a space.

```
remote:data data
```

For example, the above would mount `remote:data` to `/mnt/data` and therefore `./mounts/data` on our host.

Now start the containers, and you should be set!

## Does it work?

Yes, yes it does! Duplicati can backup remotes now, which is great! Unfortunately backups are now very network intensive, which means the backups can be a lot slower than just reading off the local filesystem, but that's mostly fine. For that reason I wouldn't recommend this for huge datasets. If you're running Duplicati on a fast network connection, it's probably fine, but best test before relying on it!

I'm running it right now for some backups, take a look at [my setup](https://github.com/RealOrangeOne/infrastructure/tree/master/ansible/roles/intersect-docker/files/duplicati).

## _"But what about other backup tools, like Restic?"_

[Restic](https://restic.net/) is a new (ish) backup took which can use rclone for its remote access. Unfortunately it doesn't support using a remote as a destination for backups.

You could totally use this with restic, or any other backup solution, as there's nothing Duplicati specific.
