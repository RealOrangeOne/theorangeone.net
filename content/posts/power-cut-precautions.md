---
title: Power cut precautions
date: 2022-05-19
image: unsplash:ImcUkZ72oUs
tags: [self-hosting]
---

Last night, the sky was filled with thunderstorms. For a few hours, there was some of the loudest thunder and brightest lightning I'd ever seen. At the time, this was quite interesting, and nicely helped cool down the air too. This morning however, less fun.

Shortly after 07:30, my monitoring started complaining that all the applications I run in my home were unavailable (thanks [uptime-kuma](https://github.com/louislam/uptime-kuma)!). It seems just before 07:30, the power in house went out, and my server went down along with it. My alarm clock is mains powered, and set to go off at 07:30, too. The batteries in it clearly weren't working either, because instead of a beeping noise waking me up, I was woken up by the "click" of all my devices suddenly receiving power again. Had that happened at any other point in the night, I'd probably have overslept.

{{% youtube 8888-VrJnC8 %}}

I can't say for sure exactly what caused the power cut, as the storm was completely gone by that point. But given there was a similar cut not 45 minutes later, I suspect it was electrical maintenance happening _somewhere_. Monitoring reports that power was only out for around a minute, but still.

Servers, especially those with mechanical storage, don't like having their power suddenly disconnected, and definitely don't like poor quality power. During a thunderstorm, there's a fairly high chance of both. All reasonable UK mains electronics are fitted with their own fuse, located in the plug. If there's a spike in electricity, these break before damaging the sensitive electronics on the end - in this case my server. Between my server and the national grid, there were a few protections:

{{<mermaid caption="Circuit protection between my server and the national grid">}}
graph RL

A[PSU]
B[Plug fuse]
C[Extension lead fuse]
D[Circuit breaker]
E[fa:fa-bolt National grid]

E-->D
D-->C
C-->B
B-->A

{{</mermaid>}}

UK houses are wired differently than most others, but I couldn't imagine not having fuses in electronics, let alone the dedicated ground pin. UK plugs are a pretty great design:

{{% youtube UEfP1OKKz_Q %}}

## What about a UPS?

A UPS (Uninterruptible Power Supply) serves 2 main purposes:

- Allowing devices to remain powered on for a period of time during a power cut, so they can shut down correctly or continue operating
- Smooth out low-quality power before it reaches sensitive electronics

Power in the UK is fairly smooth (I'm not an electrician), and we rarely ever get power cuts - easily less than 1 a year. For that reason, I never bothered investing in one. Which means, when the power was suddenly cut, my server lost power immediately and shut down. Not gracefully, just immediately and without warning. Had there been a UPS in the mix, it would have kept the server on and, depending on how I'd configured it, perhaps stopped it shutting down at all.

## Checking the damage

As I mentioned, computers don't tend to like running without power, especially when said power is taken away ever-so-suddenly. Anything the server was doing at the time would be in an unknown state and any data being written to storage would be in an unknown state - it's not good for it!

So, first thing I did once I got up was check for damage. My server is set up to turn back on automatically in the event of a power outage, for situations exactly like this, which meant it immediately fired back up and started to turn on - in whatever state that may be.

### Proxmox

My server is based on [Proxmox](https://www.proxmox.com/en/), which has a handy web UI for viewing and managing all the VMs and LXCs which it runs. Step 1 was confirming it was still accessible and reporting everything it should be. That would not only tell me the OS booted correctly, but the network stack came up, and at least some of Proxmox's backing services started too.

Thankfully, it was. The UI opened as normal, and reported all the VMs and LXCs were running as expected. Fantastic!

### Storage

All my on-site [storage]({{<relref server-2020-proxmox>}}) is mirrored. The majority of my critical data lives on a ZFS mirrored pair, with plenty of scheduled snapshots. My larger files and media library are stored on a separate pair of drives, replicated using [snapraid](https://www.snapraid.it/).

Both of these methods support a technique called "scrubbing", whereby the disks content is read, and checked against stored parity data to check whether the data on the drive is correct. This helps prevent against issues such as degrading hard drives or other issues between the OS and the physical platters. I run these automatically every week, and receive reports on the status.

To confirm the data on the drives was correct, I issued scrub commands for all my drives. I got a successful report just a few hours earlier, but that was before all of this. It took just over 1.5 hours to check my 200GB of ZFS storage (Yes, that seems crazy slow to me too), and about that long to check a portion of my snapraid pool (I only check a portion at a time as there's a lot there). Both scrubs reported that all data was correct and there were no issues, with neither reading data nor the data read.

Had the storage been a problem, I keep a number of ([now]({{<relref how-i-lost-some-data>}})) high quality [backups]({{<relref backup-strategy-2021>}}), so I can recover from any kind of loss, I hope.

### Monitoring

Third and final step, as a bit of a sanity check, is consulting the monitoring. Just because all the machines were running, and the storage didn't have any corruption, doesn't mean the applications are functioning correctly. I try and point my monitoring to dedicated health check endpoints for applications, so it checks they "healthy" rather than just "responding". Hence, these checks are much more reliable and useful than they may seem.

I run my monitoring on a dedicated VM in [Linode]({{<referralurl linode>}}), so it's not affected by any other applications. This means throughout the power outage, I was not only still monitoring all my other applications, but I can see exactly when service stopped and resumed.

And again, the monitoring was showing everything as fully operational. Besides 1 site, which had apparently been down for a week for unrelated reasons.

## What was lost?

As I write this, that same evening, it appears nothing. Proxmox is running fine, all disks pass parity checks, and [my uptime-kuma](https://status.theorangeone.net) says everything is up. With these kinds of things, time can still mess things up. There's no sign the power was unstable in the moments before the power cut, so it's unlikely any components are damaged - but anything is possible.

For me, this story has a happy ending - but next time it may not. I'm still unlikely to invest in a UPS quite yet, but for you, it may be more necessary (I hear those in the US aren't quite so lucky). Because I have proper backups, my important data is far from at risk. If you don't, I'd get on that.
