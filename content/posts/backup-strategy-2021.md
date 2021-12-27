---
title: Backup Strategy 2021
date: 2021-06-06
subtitle: Protecting my data from myself
image: unsplash:hL8slYnc-bM
tags: [self-hosting, server-2020]
---

Backups are critical to any systems longevity and reliability. If you're not backing up your data, stop reading this now, go do it, then come back...

Assuming none of you suddenly panicked and left, let's keep going.

You can keep telling yourself otherwise, but eventually, every system will experience some kind of failure. The job of a backup isn't to prevent failure, it's to reduce the impact of it. The impact may take the form of downtime, loss of data or, much harder to recover from, loss of trust. No matter your scale, you need backups!

If you're reading this saying "But I have all my data in Google Drive, it's perfectly safe there, right?", wrong! Cloud storage providers will do everything they possibly can to keep your data safe, but should something catastrophic happen, they can't be held responsible. If you value your data at all, it's time to take things into your own hands!

{{< youtube NcnidTeKNMQ >}}

## How to backup

I hope you'll never need to, but eventually you may have to fall back on your backups, so it's important they be as high quality and reliable as possible. It's for that reason the very simple [3-2-1 backup rule](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/) exists:

Your data should exist in 3 places. If it's not in at least 3 places, it doesn't exist. Live copies, i.e. those which are linked and synced immediately, don't count.

The data should be in 2 different formats. This one is subject to interpretation, but if you're justifying the formats too hard, then you're probably just lying to yourself about your data's safety. This is one which is easy to forget, but very important. If your data is in Nextcloud, and you just sync your Nextcloud application, that might not be useful if Nextcloud has a catastrophic bug. And of course, [BTRFS exists](https://btrfs.wiki.kernel.org/index.php/FAQ#Is_Btrfs_stable.3F).

At least 1 copy of your data should be off-site. What happens if your house burns down? Or more realistic, what happens when there's a power surge which takes out your devices? It's for this reason at least 1 copy should be off-site, so that it's entirely disconnected, and thus not likely to be affected.

## RAID

Repeat after me: **RAID is not a backup**!

RAID is a way of combining disks together to create a single "pool". Exactly how this "combining" happens is up to you, and can change the resilience, reliability and performance massively.

In a backup system, RAID is more about availability than it is uptime. Without RAID, when a drive dies, it won't _necessarily_ result in downtime. If a drive starts reporting bad data, known as "bit rot", then the data stored on other drives can be used to correct the data automatically, without passing the bad data on to the application, potentially causing a crash.

In my setup, I have all my important data on a [2-drive ZFS mirror]({{<relref "server-2020-proxmox">}}#tank), with automatic snapshots from [`sanoid`](https://github.com/jimsalterjrs/sanoid). My [sanoid configuration](https://github.com/RealOrangeOne/infrastructure/blob/3976dd607d6c9eb6ccaa56afec409b0331208237/ansible/roles/zfs/defaults/main.yml) sets up a number of snapshots, and keeps them for different amounts of time, allowing me to scroll back and potentially recover data deleted weeks ago. ZFS has proven itself time and time again in the real world to be a resilient and dependable filesystem, so I trust it with my most important data.

Alongside `sanoid`, I also run weekly [ZFS](https://openzfs.org/wiki/Main_Page) scrubs. Scrubs read all the data on the pool, and compare its checksums to the known values and parity data on other disks. This will help catch errors like failing drives, bit-rot, and any other potential issues between the data on the drive and the computer.

{{< youtube ZgowLNBsu00 >}}

Alongside this critical data, I have a separate 2-drive mirror using [snapraid](https://www.snapraid.it/). The data here isn't quite as critical, and could grow massively, hence wanting the flexibility of snapraid (and [mergerfs](https://github.com/trapexit/mergerfs)), and is still somewhat-easily replaceable. For things like my media library, I have a script to list the files, so I at least know what I lost, should the worst happen.

## On-site mirror

RAID isn't a backup, and so for there to be a real backup, it needs to live somewhere outside my server itself.

One of ZFS's killer features is [ZFS send / receive](https://openzfs.org/wiki/Documentation/ZfsSend), which allows transferring snapshots to another ZFS pool (maybe on another machine), but whilst only transferring the changes. This is similar to `rsync`, however `rsync` needs to enumerate all the files before it knows what to transfer, whereas ZFS already knows what's changed because of its copy-on-write nature.

On my desk, is a WD elements enclosure, with a 2TB HDD inside it. This drive sits unplugged most of the time, but _every once in a while_, I connect it to my computer and run a ZFS transfer (using [`syncoid`](https://github.com/jimsalterjrs/sanoid#syncoid)) from my server to that drive. Because the backup is happening entirely over my LAN, it's pretty fast.

This is far from a perfect solution, but it still has a number of benefits. Should something on my server hard fail, I still have access to the data almost immediately in case I need something. Unfortunately though, it does rely on me remembering to do the backup, which isn't as often as I'd like, and means it's possible for it to be several days out of date.

ZFS send / receive can also be used to transfer encrypted snapshots, without the recipient having the ability to decrypt the data. What's more magic, is that the recipient can still scrub the data and receive incremental backups.

## Off-site data

So, my data now lives outside my server, should something happen to it (or I run the wrong `dd` command) - but what happens if my house burns down? Well, gotta get my data out my house then.

Recently, I moved my off-site backup mechanism from [Duplicati](https://www.duplicati.com/) to [restic](https://restic.net/). I had been using Duplicati for a couple of years, and it's served me well, _ish_. Duplicati can be quite temperamental, complaining about backup files, corrupting itself, and various other things. Not to mention the fact it's not especially fast, and doesn't have great compression support (just ZIP in 2021?!). Restic on the other hand is the _hot new thing_. It's much simpler, much more lightweight, and yet has some powerful features. Restic doesn't support compression ([yet](https://github.com/restic/restic/issues/21)), but it's fancy [content-defined chunking](https://restic.net/blog/2015-09-12/restic-foundation1-cdc/) is almost as effective (compared to zip, at least).

<audio data-theme="night" data-src="https://changelog.com/podcast/434/embed" src="https://cdn.changelog.com/uploads/podcast/434/the-changelog-434.mp3" preload="none" class="changelog-episode" controls></audio><p><a href="https://changelog.com/podcast/434">The Changelog 434: Restic has your backup</a> – Listen on <a href="https://changelog.com/">Changelog.com</a></p><script async src="https://cdn.changelog.com/embed.js"></script>

Rather than using an existing orchestration tool like [autorestic](https://github.com/cupcakearmy/autorestic/) or [resticprofile](https://github.com/creativeprojects/resticprofile), I wrote [my own](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/restic/files/backrest.sh) (yes, that's really what I named it). The others never did quite what I want, and I wanted something which "just worked", and had a tight integration with [healthchecks.io](https://healthchecks.io/). Using my [Ansible repo](https://github.com/RealOrangeOne/infrastructure/tree/master/ansible/roles/restic), it gets installed on all my servers, and scheduled with cron.

For the storage, I use [Backblaze](https://www.backblaze.com/), specifically [B2](https://www.backblaze.com/b2/cloud-storage.html) - There really is nothing quite like it. The S3-compatible API makes integrating with it a breeze, the prices are great, and as a company Backblaze do some great things for the community, especially their [quarterly drive stats](https://www.backblaze.com/b2/hard-drive-test-data.html). Backblaze supports encryption at rest (on top of what restic provides), and lets me store ~200 GB for the low-low price of $0.70/mo. Backblaze is a US-based company, but there is a less-than-obvious [EU data centre setting](https://help.backblaze.com/hc/en-us/articles/360034620773?input_string=region+moving) which does move things at least closer to where I am, which is good both in terms of latency and data residency.

Probably the most annoying thing about my off-site backup strategy actually has nothing to do with it: my upload speed. The initial sync of data takes a hell of a long time, as does the subsequent syncs. 2MB/s isn't strictly slow, but it definitely makes the initial sync quite slow.

## Key backup

This is a new one for me, and may be where you either start thinking I've gone paranoid, or they suddenly realize there's a gaping hole in their backup strategy too.

All my backups are encrypted, and rightly so. But what happens if I lose the keys? The keys live in my [Bitwarden](https://bitwarden.com/) (well [vaultwarden](https://github.com/dani-garcia/vaultwarden)) vault, which is also encrypted and stored with the backups. If I lose my server and computer, say in an aforementioned house fire, I'm fresh out of luck. [Restic's encryption](https://blog.filippo.io/restic-cryptography/) is such that without the key, the data is unrecoverable.

To cover this base too, I back up the absolute code data onto a USB drive. The files on the drive are stored plainly in directories, and the drive encrypted (with [LUKS](https://en.wikipedia.org/wiki/Linux_Unified_Key_Setup)) with a key I know. I have 2 drives, with the same backup scripts on. 1 of these drives sits in a draw on my desk, the other in an "undisclosed location" away from my house (No, i'm obviously not going to tell you where it is). The drives are never in the same location, to minimize potential risk, and the drives are only plugged in to perform a backup, then unplugged. To help detect the flash storage degrading, I'd like to experiment with BTRFS on the drive, which would also bring some compression with it.

For the drives themselves, I didn't want to use just anything. They needed to be very rugged, reliable and have a reasonable capacity. For me that left 1 option: the [Corsair survivor stealth](https://www.corsair.com/uk/en/Categories/Products/Storage/USB-Drives/flash-survivor-stealth-config/p/CMFSS3B-512GB). It's both waterproof, shockproof, easily available, and available in a number of capacities. I went for 32GB, partly because it should be ample for my needs, and it was on offer at the time.

{{< youtube XV28H2Wb-_Q >}}

I think the "surprisingly flimsy" comment is either a bad unit, or that the shock of being thrown at the ground from a short distance is unreasonable. There are some other videos on the internet which filled me with confidence:

{{< youtube A_PcOZK4vFk >}}

The backup itself is done using [`rsnapshot`](https://rsnapshot.org/), a simple wrapper around `rsync`, but with snapshots. This way backups are versioned, and I can keep several copies without using excessive space. The configuration for all this is stored in a (private, sorry) repository on [my GitLab server](https://git.theorangeone.net), so just before running a backup I can `git pull` to ensure it's the latest. Every once in a while (~2 weeks), I'll connect the drives, and run a backup. This keeps the data fresh, and monitors bit-rot.

The drives contain backups for [vaultwarden](https://github.com/dani-garcia/vaultwarden), SSH keys, compressed database backups, important documents, git repositories and a few other bits which might be handy when restoring data. Now, if the absolute worst happens, there's still some hope of getting to my backups.

## Situation analysis

And so, there's my 3-2-1 backup strategy:

- At least 3 copies: Primary, on-site mirror, Backblaze, plus 2 USBs
- At least 2 formats: ZFS, `restic`, plus `rsnapshot`
- At least 1 off-site: backblaze, plus off-site USB

And that should cover me in the event of any issues:

If the power supply in my server fails, and takes the drives with it, then I can use the on-site mirror to recover quickly, and as an interim, and possibly mix in some newer data from Backblaze if it's too old.

Should the power grid in my house throw a fit and fry a load of electronics, including everything in my room, then I can recover using the data in Backblaze, and the decryption keys on the USB in my house.

In the event my house catches fire, then besides having to rebuild much of my life, I can recover my data using the data in Backblaze, and the decryption keys I store off-site.

Well ok yes, if a meteor struck my house, then my house would be destroyed and my off-site USB would be in the [fallout area](https://asteroidcollision.herokuapp.com/) too, rendering my data unrecoverable. However, at that point humanity would (or at least should) have much bigger problems than the fact I would be unable to recover my holiday photos from 2003.
