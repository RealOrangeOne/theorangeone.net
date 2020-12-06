---
title: Backing up and restoring containers
date: 2020-12-06
image: unsplash:CpsTAUPoScw
tags: [containers, linux, self-hosting]
---

You should back up your data, properly! If you're not, you're playing a dangerous game with fate. Computers are pretty reliable, but they also go wrong, often. You should always backup your files, but backing up a containerized application isn't quite as simple.

A container is 3 things:

- Configuration
- Volumes
- Networking

The point of a container is it's rather self-contained. You don't need to back up the container image itself, as that's defined by the docker run command, and you should be using sane versioning on that ([not `latest`]({{< relref "keeping-docker-containers-updated" >}})).

## Backup

A compose file may be made up of multiple containers, and perhaps even multiple distinct applications. When backing up applications, it's important to back up any dependant containers too, such as databases.

### Configuration

A container isn't just data, there's configuration in there too. This configuration not only defines which container to run, but also environment variables, networking preferences and of course, mounts.

Exactly how your containers are configured is up to you, although on the small scale I suspect you, like me, are using `docker-compose`. If you're not, and you're using something like a manual `docker run` command, or a systemd service, you're kinda doing it wrong. If you're using things like Kubernetes, then there's a little more to back up, but chances are you already know what you're doing.

By having a backup of the container name and tag you used (e.g. `postgres:12-alpine`), you don't need to back up the entire original container (in this case ~58MB), just your data, which generally lives in volumes.

Configuration is likely either a handful of files, or just a single one. This will either be super simple to back up, or you're already storing it in version control - something I also highly recommend.

### Volumes

Volumes are the way you expose files on the host into a container. There are 2 main types: bind mounts and volume mounts. They work exactly the same, except volume mounts will live in `/var/lib/docker/volumes`, and bind mounts can live wherever you want. Personally I use, and highly recommend, bind mounts.

If you're using bind mounts, you already know where your data is, so it's easy to just copy that data off to wherever you're doing backups. You'll be able to see the paths nice and easily in your `docker-compose.yml` under `volumes:` for each service.

If you're using volume mounts, the backup process is the same, but the hard part is finding the files. You can list the volume directories used by a container with `docker inspect -f '{{ .Mounts }}' <container>` (notice *not* `docker-compose`).

When backing up the files, the permissions are also important. If you copy your data but don't get the permissions right, your container won't start. `rsync --archive` will copy all the metadata for a file along with its content. You may need to run it as root, both so it can read all the files and properly set the ownership. Most other backup mechanisms will also work, but notably `cp` will not.

### Networking

Chances are, you're only relying on the bridge network `docker-compose`creates between containers in the same `docker-compose.yml`. You don't need to do anything fancy to back this up - in fact you don't need to do anything at all! Unless you've modified it from outside the compose file, it'll just come with you and reconfigure itself on next start.

If you've created a custom network, then backing that up is slightly harder. Unless you've got your own versioning system for this ([Ansible](https://docs.ansible.com/ansible/latest/collections/community/general/docker_network_module.html) or alike), you'll need to reverse engineer what the network looks like and how to recreate it. Let that be a lesson for not version-controlling it.

If the containers you're trying to back up are connected to others, via `external_links` or otherwise, you'll also need to back those up too. Whether it be a shared database, monitoring services or reverse proxy.

## Restoring

A backup is only useful when it's possible to restore it. You can have all the backups in the world, but if you have no idea how to restore them, or worse yet can't restore them, they're pretty pointless.

### Configuration

Your configuration files just need to be copied as-is into the correct place. Personally I store mine in `/opt/<application>/docker-compose.yml`.

With your configuration in place, you can now pull down the required containers with `docker-compose pull`. Assuming you're tagging things properly, you'll now have the exact same container downloaded, without needing to back it up yourself - awesome!

### Volumes

When copying your data into place, as with backing up the data, you'll need to copy it into place ensuring the permissions remain in-tact. You'll probably want to use the same tool you used to create the backup in the first place.

If you were previously using volume mounts rather than bind mounts, now might be the perfect time to change. It's quite a pain to put files back into the correct volume mount location, but incredibly simple to just use bind mounts. A small modification to your configuration can make a huge difference to how simple backups become.

### Networking

If you just used the default bridge networks, you're already set. `docker-compose` will create the bridge network as usual with all the required containers connected.

If you did have custom networks, now is the time to create them from whatever format you backed them up in. Whether it be Ansible playbooks, random bash scripts, or something else.

## Closing

In case you weren't aware, backups are important! Backing up containers is both slightly different, and exactly the same as backing up regular data files. The trick is where to look.
