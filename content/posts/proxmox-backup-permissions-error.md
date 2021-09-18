---
title: Fixing a permissions error on Proxmox backup
subtitle: "Fixing `Cannot open: Permission denied`"
date: 2021-09-18
image: unsplash:cV9-hOgoaok
tags: [server-2020, linux]
---

I have a bunch of VMs and LXCs on my proxmox server. Whilst I like to keep as little data in each of them as possible, and instead mount in my storage (in the form of a ZFS and snapraid pool), I still use proxmox's built-in backup feature to back up to a separate drive, because backups can't hurt. The backups have occasionally saved me from having to do a full reprovision, and get back going after I made a silly mistake (it happens to everyone).

Unfortunately, apparently since upgrading to Proxmox 7 a few weeks ago, a few of my backups are stopped working, due to what is a quite cryptic error:

```
207: 2021-09-08 04:25:35 INFO: Starting Backup of VM 207 (lxc)
207: 2021-09-08 04:25:35 INFO: status = running
207: 2021-09-08 04:25:35 INFO: CT Name: gitlab-runner
207: 2021-09-08 04:25:35 INFO: including mount point rootfs ('/') in backup
207: 2021-09-08 04:25:35 INFO: mode failure - some volumes do not support snapshots
207: 2021-09-08 04:25:35 INFO: trying 'suspend' mode instead
207: 2021-09-08 04:25:35 INFO: backup mode: suspend
207: 2021-09-08 04:25:35 INFO: ionice priority: 7
207: 2021-09-08 04:25:35 INFO: CT Name: gitlab-runner
207: 2021-09-08 04:25:35 INFO: including mount point rootfs ('/') in backup
207: 2021-09-08 04:25:35 INFO: starting first sync /proc/611431/root/ to /mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tmp
207: 2021-09-08 04:31:54 INFO: first sync finished - transferred 5.84G bytes in 379s 207: 2021-09-08 04:31:54 INFO: suspending guest
207: 2021-09-08 04:31:54 INFO: starting final sync /proc/611431/root/ to /mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tmp
207: 2021-09-08 04:32:49 INFO: final sync finished - transferred 0 bytes in 55s
207: 2021-09-08 04:32:49 INFO: resuming guest 207: 2021-09-08 04:32:49 INFO: guest is online again after 55 seconds
207: 2021-09-08 04:32:49 INFO: creating vzdump archive '/mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tar.zst'
207: 2021-09-08 04:32:49 INFO: tar: /mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tmp: Cannot open: Permission denied
207: 2021-09-08 04:32:49 INFO: tar: Error is not recoverable: exiting now
207: 2021-09-08 04:33:08 ERROR: Backup of VM 207 failed - command 'set -o pipefail && lxc-usernsexec -m u:0:100000:65536 -m g:0:100000:65536 -- tar cpf - --totals --one-file-system -p --sparse --numeric-owner --acls --xattrs '--xattrs-include=user.*' '--xattrs-include=security.capability' '--warning=no-file-ignored' '--warning=no-xattr-write' --one-file-system '--warning=no-file-ignored' '--directory=/mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tmp' ./etc/vzdump/pct.conf ./etc/vzdump/pct.fw '--directory=/mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tmp' --no-anchored '--exclude=lost+found' --anchored '--exclude=./tmp/?*' '--exclude=./var/tmp/?*' '--exclude=./var/run/?*.pid' . | zstd --rsyncable '--threads=1' >/mnt/bulk/pve/dump/vzdump-lxc-207-2021_09_08-04_25_35.tar.dat' failed: exit code 2
```

The fact a snapshot backup failed isn't the problem, I can live with that, it's that proxmox can't write to the backup destination (`/mnt/bulk/pve/dump`). Normally it'd just be a case of fixing the permissions for the directory, but every other backup I take, of both LXCs and VMs works absolutely fine - what gives?

Are recently provisioning another LXC, which showed the same issue, I finally discovered the common denominator: they're unprivileged.

In LXC, a container may be unprivileged or privileged. In docker containers, user ids in the container are the same as those on the host. With LXC, that isn't necessarily the case. When a container is "unprivileged" (the default), user ids are randomized and offset. The container still sees its own ids correctly, but when trying to access things on the host system, say through bind mounts, they won't line up. "privileged" means they line up.

For reasons I don't understand, this seems to have something to do with the backup process. Presumably it runs as a different user during the backup depending on the container type, who knows. Either way, it needs solving. I need my backups!

After a bunch of searching around, I finally found the solution. I stumbled upon [this thread](https://forum.proxmox.com/threads/lxc-unprivileged-backup-task-failing.48565/1), which mentions a completely unrelated issue, with a very similar symptom. By this point, I had been wrestling with this issue for a few weeks, so blind config changes was something I was more than happy to do.

The thread mentioned setting the `tmpdir` setting on `vzdump`. This directory controls where `vzdump` stores the container data during a "suspend" mode snapshot. My guess is `vzdump` runs as a different user on an unprivileged LXC dump vs a privileged dump. If you do know why this happens in some more detail, [please tell me]({{<relref "contact">}}). For security reasons, my backups are not world readable, only being writeable by `root`, but given that works fine

On my server, `tmpdir` is undefined. Setting it to a world-writeable directory (I chose `/tmp` for obvious reasons) and rerunning a backup and **huzzah** - it worked! Whilst I chose `/tmp`, it's not actually a `tmpfs`, or at least wasn't on my machine. Given it's meant to be temporary, it'll make things a bit faster and reduce wear on the drives by making it an actual `tmpfs`. It's easy to add an `fstab` entry for this:

```
tmpfs /tmp tmpfs nosuid,nodev,noatime 0 0
```

And now, all my LXCs and VMs are backing up correctly and fully - result!
