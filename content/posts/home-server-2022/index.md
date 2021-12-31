---
title: Home Server 2022
date: 2021-12-31
tags: [server-2020, self-hosting]
image: resource:server.jpg
---

For the last 7 years or so, I've had some form of server sitting in my house. Its size and utility have changed massively in this time, but I couldn't imagine life without it. Both prefer to and enjoy running a number of applications for myself, in a (possibly futile) way to maintain the independence, privacy and security of my digital life.

## State

Since I built the server [last year]({{<relref "server-2020-parts">}}), very little has actually changed about it, for good. The parts list is still practically unchanged, besides a few storage upgrades and fans, and the underlying OS is still very much [Proxmox](https://pve.proxmox.com/wiki/Main_Page).

### Applications

Really, I suspect most people are reading this because they want to know 1 thing: "What applications are you running?". Well, here goes:

- [Calibre](https://github.com/janeczku/calibre-web) - Ebook management
- [Restic](https://restic.net/) - Backups
- [GitLab](https://about.gitlab.com/) - Repository hosting
- [Librespeed](https://github.com/librespeed/speedtest) - Network speedtest
- [Nextcloud](https://nextcloud.com/) - File storage
- [Privatebin](https://privatebin.info/) - File drops / snippet management
- [Quassel](https://quassel-irc.org/) - IRC
- [Synapse](https://github.com/matrix-org/synapse) - [Matrix](https://matrix.org/)
- [Traefik]({{<relref "traefik">}}) - Reverse proxy
- [TT-RSS](https://tt-rss.org/) - RSS feed aggregation
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) - Password management
- [Wallabag](https://www.wallabag.it/) - Links to read later (or so I don't lose)
- [whoami](https://github.com/traefik/whoami) - Connection testing
- [yourls](https://yourls.org/) - URL shortener
- [Grafana](https://grafana.com/) - Metric graphing / monitoring
- [Prometheus](https://prometheus.io/) - Metric storage
- [HomeAssistant](https://www.home-assistant.io/) - Home automation
- [Jellyfin](https://jellyfin.org/) - Media
- [Qbittorrent](https://www.qbittorrent.org/) - _Linux ISOs_

There are few more tiny things like nginx lying around, and a few more sitting on my other servers. But that's the bulk of the applications I run. There are a few others I'm playing around with, but I wouldn't consider myself _using_ them. It's also worth noting that whilst most of these are docker containers, many of them aren't. Some are just easier and more reliable running outside docker, or require other specific requirements which made running them in my primary docker LXC more annoying than it's worth.

### Storage

At the heart of my server is the same pair of 500GB SATA SSDs. These house both the OS (Proxmox) and the majority of the VM / LXC disk images. Being ZFS based, I get some redundancy should a drive fail.

Most of my important data lives on a pair of 4TB Seagate HDDs, again in a ZFS mirror. Whilst I've not had to RMA a drive just yet this year, one of the drives has been spitting out the odd SMART error. `zfs scrub` says the drive is fine, and I believe it. After my previous experiences with Seagate support, they only really want to RMA the drive if it's actually dead, rather than "random software reporting it's slowly dying". Regular backups and good ol' RAID should mean I lose neither data nor downtime in the event that happens, but for now I'm just keeping a very close eye on it.

My bulk storage lives on a (now redundant) pair of 6TB _shucked_ WD HDDs. This "pool" stores my media library, GitLab artefacts and proxmox backups - things which whilst nice to keep, wouldn't be heartbreaking to lose.

## Changes

Change is inevitable in life, and the same goes for my server. Over the last year, I've had a lot of time to play around, change things, and optimize how I get things done. Most of these changes occurred in the last 6 months alone.

### Storage drive parity

Finally, after almost 3 years of media library, it's finally redundant! Not in the useless kind, in the reliability kind! My media library is set up in a [Snapraid](https://www.snapraid.it/) pool, so in the event of a drive failure, not all the data is lost.

Whilst it's a mirror in terms of redundancy, it's not a mirror in the conventional sense. In a usual mirror, reads can be split across the drives, increasing throughput. In my setup, the data is only accessible on 1 drive, with the second drive containing only parity (albeit in a mirror, enough parity to fully reconstruct the data). It's far from ideal, as it means 1 drive is seeing far more writes than the other, but in the current world of [Chia](https://www.chia.net/) still dying, it's the best I can reasonably do right now.

### Restic

Restic is definitely one of my favourite finds of 2021. It's a fantastic backup tool with native snapshots and deduplication. It's had some issues since I originally deployed it, mostly around it consuming _far_ more memory than it should and overwhelming my smallest VPSs.

Much like I did with Duplicati, I run restic on each of my VPSs, and once for my home server. Because of restic's memory _issues_, I run its "forget" on my home server, as it has the most to spare.

Restic is definitely my favourite backup tool out there, and forms just a small part of my full [backup strategy]({{<relref "backup-strategy-2021">}}).

### GitLab, again

A lot of what I do involves `git` - both professionally and personally. Whether that's programming, infrastructure management or even [writing this blog](https://github.com/realorangeone/theorangeone.net). Whilst most of my work lives on my [GitHub account](https://github.com/realorangeone/), I do like to [self-host](https://git.theorangeone.net) as much of it as I can.

I've switched between [Gitea](https://gitea.io) and [GitLab](https://about.gitlab.com) far too often to count, but I think I've landed on GitLab for the long term. Yes it's a rather heavy application for a single user, but it's feature packed and does everything I need. Through some trial and error, I've been able to reduce the weight, but it's still far from gitea.

### Notifications

Previously, I ran [Gotify](https://gotify.net/), a self-hosted notification centre to send notifications to my phone. At the time, it worked pretty well, until it didn't. The app itself relied on websockets, and apparently wasn't great at handling when the application was killed to save power or just had a dodgy network. If you're after simple notifications, I still highly recommend Gotify, but instead I've merged notifications into something I already run.

Coincidentally, the majority of services I run support talking directly to Matrix, so I migrated all my applications to that and haven't looked back. I have a few private, internal channels which house these notifications for each service, and when something happens, a message gets sent to the room. Given my increased use of Matrix over the last year, and the fact this would remove an unnecessary service I would be running, it seemed like a no-brainer at the time, and it's been working fine ever since.

The only service I have yet to migrate is Grafana, but only because I rarely get notifications from it directly. Last year I wrote [`grafana-apprise-adapter`](https://github.com/RealOrangeOne/grafana-apprise-adapter), a tool to send notifications from Grafana to [Apprise](https://github.com/caronc/apprise) and then on to whatever service I needed (one of which is Matrix), as Grafana has a rather limited set of notification channels out the box.

### DHCP

In addition to my LAN, I run an additional internal network on my Proxmox host, which allows LXCs and VMs to sit behind NAT rather than be individually accessible on my LAN. For my own laziness, I ran a DHCP server on this network, to automatically provision IPs for them all. This makes provisioning much easier, but makes keeping track of machines a lot harder. In reality, I was just treating these "dynamic" IPs as "static", which occasionally caused me a number of headaches.

Not long after I had deployed it, I removed the DHCP server entirely and switched everything over to fully static IPs. These IPs are then referenced in my Ansible config to allow easy referencing of machines. In reality, mDNS is probably the better solution here, but for me this works just fine.

### HomeAssistant Backups

I'm no HomeAssistant power user, by anyone's definition, but I do run it and use it. I mostly use it for a few lighting controls, and graphing some sensors around the house.

Whilst there's not much in terms of configuration, there's data stretching back almost 2 years at this point - data I'd quite like to keep. My previous backup strategy was to download the backups every once in a while and store them in nextcloud - that's obviously not great. As I run [HomeAssistantOS](https://www.home-assistant.io/installation/), installing a backup tool in the VM itself isn't really an option.

Instead, I've handled this through a slightly different method. Using the [samba add-on](https://github.com/home-assistant/addons/tree/master/samba), I've mounted the homeassistant config and backup directories in my restic LXC, and have restic back it up as if it were any other storage. It's still over the network, so it's slightly slower than if it were regular storage, but this way it's backed up with everything else, and retained alongside everything else.

## Current issues

The cost of perfection is infinite, as is the cost of a perfect server. There are still quite a few headaches and issues with my setup, ranging from nitpicks to extreme annoyances.

For reasons I don't understand, the performance on some of my disks really sucks. Earlier in the year I was seeing ZFS scrub speeds in the single-digit megabytes, although that has since got better (~50MB/s), but copying files using network shares drops as low as 20MB/s, or lower. I even added an SSD cache to the pool in a (futile) attempt to remedy these performance issues. I know my drives aren't SMR, and `fio` benchmarks _seem_ fine, but evidence says otherwise. More digging is needed here I think.

As I mentioned earlier I have a separate "bulk storage" pool using snapraid, which houses my media library, Proxmox backups, and other large files I don't need extreme data integrity on. Here I also house a single VM disk for my seedbox, to save writes on my SSD pool. Snapraid gets really unhappy if a file changes during a `sync`, and so it can cause if a sync hits during intensive writes to the VM disk. It's rare, but it happens (and [heathchecks](https://healthchecks.io) notifies me).

I do backup VMs and LXC disks to the snapraid pool, but none of that goes off-site. Theoretically that's unnecessary, as the configuration is either in Ansible, or it's a default base OS install. Regardless, it might be nice to back up the disks _somewhere_ in the event something terrible happens.

Probably the biggest hole in my backup story is proxmox itself. Any configuration inside its VMs or LXCs is managed by ansible, stored in [a `git` repo](https://github.com/RealOrangeOne/infrastructure) and backed up. Important data is stored in ZFS and backed up off-site. Less-critical data is on a snapraid pool and the important bits backed up. But a lot of the proxmox configuration isn't backed up, especially the machine configurations. It's possible to do something like that, either with Ansible templates or Terraform, but so far it's been "fine" knowing that the configuration and data is safe, and anything else I can piece together manually from certain Ansible files.

## Plans for 2022

2021 was the birth of my current server. 2022 is another chance to mix things up again for no reason and hope I don't break things.

The thing bugging me the most is performance. A lot of the work I do professionally is around seeking absolute performance for web applications, so it makes sense I do the same with my own servers. The IO performance of my disks is something I really want to work out and solve.

Additionally, there's proxmox. Since I [redid my server]({{<relref "server-2020">}}) in late 2020, I've been running Proxmox and quite enjoying it. The "hypervisor way" is definitely the way I want to go. Being able to not only keep applications separate, but also spin up throw-away environments to play around with, is really valuable in a home server / lab environment. However, versioning it nicely is a bit of a pain, not to mention how non-standard proxmox can be, particularly when it comes to packaging. Has proxmox run its course for me? We'll see...

Am I teasing upcoming content? You're god-damn right!
