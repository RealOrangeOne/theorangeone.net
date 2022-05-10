---
title: How I lost some data
date: 2022-05-10
tags: [self-hosting]
image: unsplash:j_nQT4YIbac
---

It's something no one wants to see: You open up an important file, and are met with very different content to what you're expecting. This weekend, that happened to me. Losing data is terrible, no matter what it is. To a bit of a perfectionist like me any loss of data, no matter how insignificant, sucks!

I want to share what happened. In part to immortalize to myself where I screwed up, why I screwed up, and what I'm doing now to stop (at least these) screw-ups from happening again. But also as a lesson to you to not just backup, but backup properly. Understand your backups, when they're captured, how they're stored, and everything in between.

{{<block tangent>}}
RTO (Recovery Time Objective) and RPO (Recovery Point Objective) might also be good things to [take a look at](https://en.wikipedia.org/wiki/Disaster_recovery#Recovery_Time_Objective).
{{</block>}}

You may also, like me, find reading these "post-mortem" style write-ups quite interesting, and at the very least entertaining. If you want to see what **great** post-mortem posts look like, check out Cloudflare's blog. They have some pretty fantastic ones:

- [How a ReDoS took down their entire network](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/)
- [The glorious time Facebook disappeared from the internet](https://blog.cloudflare.com/october-2021-facebook-outage/)
- [How Verizon broke the internet](https://blog.cloudflare.com/how-verizon-and-a-bgp-optimizer-knocked-large-parts-of-the-internet-offline-today/)
- [The Okta compromise earlier this year](https://blog.cloudflare.com/cloudflare-investigation-of-the-january-2022-okta-compromise/)

I'm not sure if I'll ever live up to those standard - but anyway, here goes...

## What was lost?

Fortunately for me, not much.

To my knowledge, the only file which was lost was a nearly-finished blog post I was working on. When I write posts, I start first with just a collection of random ideas and links, before fleshing out the shape of the post and then finally populating the actual content. I still have most of the notes, but none of the actual content.

Another part of damage control is working out how widespread the issue is. I know the impact is completely isolated to my "Notes" directory (for reasons I'll get onto), which I mostly use for blog posts anyway, along with a few other notes that don't change very often.

## What happened

Ah, the tale of what went wrong. Both the most interesting to read and painful to write part of any post-mortem.

For a few weeks before "the events", I was having issues with Nextcloud not syncing data correctly. No matter what a change was, Nextcloud would try to sync, and then immediately claim that the sync failed, spitting out a lovely [HTTP 422](https://http.cat/422) with the cryptic message "Precondition failed". For reasons unknown to science, this could be fixed temporarily by forcing a sync on the given share, but the next time I changed any file in there, or my machine rebooted, syncing would fail yet again.

After some somewhat-flailing investigation, and trying to distil things down to the most likely cause, I discovered it was a result of some nginx ["hacks"](https://github.com/RealOrangeOne/infrastructure/commit/6c0314b7581038687f473667a4a63b7127562743) I had added to my Traefik setup (Don't read too much into that). Removing the hacks (or [commenting them out](https://github.com/RealOrangeOne/infrastructure/commit/793506492f2354a86e2eaa55e832db566263386e)) fixed the problem entirely and syncs began working again and completing successfully. Strangely enough, this also fixed a number of other problems I had been having for what seemed like forever, particularly with WebDAV calendar syncing and Jellyfin streams cutting out on Android TV.

Sadly, then came fixing the conflicts. Because changes hadn't been syncing between devices, some files and folders had changes others didn't. In this case, I believe I renamed the file on 1 device, and wrote all the content on another. I can't entirely recall how I did it, but somehow I resolved the conflict incorrectly, or the sync failed again somehow, but the end result is that single `.md` file was gone. And because the directory syncs automatically, once it was removed from 1 device, it vanished from all the others.

### What about backups

Ah yes, good ol' backups. The reason we back up our data is so when situations like this arise, we can pull the data from our backups and be on our merry way. I, like all other sane people with digital data, keep [good backups]({{<relref backup-strategy-2021>}}). This time however, the backups weren't quite enough, for one reason: time. Well, time and human error.

I keep versions of backups for a lot more than 1 day, but in this case not quite enough. Sadly, my dumb ass didn't notice any of this until a few days ago when I remembered the blog post existed, thought about publishing it, only to realize that not only did the file not exist, but the backup retention was too short, and so the files had expired and were gone for good.

My backup retention varies by storage and location:

- ZFS snapshots: 2 monthly
- Backblaze: 30 days
- USB off-site: 7 copies

By my maths, that means the file was deleted some time in the last 2 weeks - As in about 5 days _before_ I started looking for it. Damn it!

## Learnings

Fortunately for me, the value of the data lost is pretty minimal - it wouldn't take more than a few hours to get the article back to what it was. But this does make for a good learning experience, for me and for you. So, what did I change? Lessons are pointless unless there's something to learn from them to apply in future. Well step 1, rather obviously, is keep backups for longer.

All of my backup technologies ([ZFS snapshots](https://klarasystems.com/articles/lets-talk-openzfs-snapshots/), [restic](https://restic.net/) and [rsnapshot](https://rsnapshot.org/)) deduplicate content in some form or another. Keeping 100 snapshots doesn't use twice the space as 50 snapshots (_necessarily_). Each snapshot only contains the changes from the previous, and because most of my data doesn't change _that_ often, the size of a given snapshot is very low.

```
NAME                                                                  USED  AVAIL     REFER  MOUNTPOINT
tank/files/nextcloud@autosnap_2022-04-01_00:00:01_monthly            34.9M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-24_00:00:15_daily              34.9M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-25_00:00:16_daily              34.9M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-26_00:00:15_daily              35.0M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-27_00:00:16_daily              35.0M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-28_00:00:15_daily              35.0M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-29_00:00:16_daily              35.0M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-04-30_00:00:15_daily              35.0M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-01_00:00:16_monthly               0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-01_00:00:16_daily                 0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-02_00:00:16_daily              35.1M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-03_00:00:15_daily              35.1M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-04_00:00:16_daily              35.1M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-05_00:00:16_daily              35.3M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-06_00:00:16_daily              35.2M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-07_00:00:16_daily              35.2M      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-08_00:00:17_daily               852K      -     17.4G  -
[...]
tank/files/nextcloud@autosnap_2022-05-09_13:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_14:00:26_hourly              308K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_15:00:26_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_16:00:26_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_17:00:26_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_18:00:26_hourly              436K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_19:00:26_hourly              384K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_20:00:26_hourly              548K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_21:00:26_hourly              508K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_22:00:16_hourly              560K      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-09_23:00:15_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_00:00:25_daily                 0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_00:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_01:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_02:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_03:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_04:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_05:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_06:00:25_hourly                0B      -     17.4G  -
tank/files/nextcloud@autosnap_2022-05-10_07:00:25_hourly                0B      -     17.4G  -
```

Here, ZFS is reporting lots of snapshots, but very little is actually being stored due to each snapshot (especially in the last few hours, where I've been asleep).

{{<block tangent>}}
The way restic does its file deduplication (which it calls ["content defined chunking"](https://restic.net/blog/2015-09-12/restic-foundation1-cdc/)) is very interesting, if you're like me and into those kinds of things.
{{</block>}}

Originally, I had backups downsample in a futile attempt to reduce storage usage. For example, rather than keeping 2 months worth of daily snapshots (totalling ~60), it only keeps 1 month's worth of daily snapshots, then just 1 snapshot for the previous month (thus totalling ~31). But again because of some pretty powerful deduplication, not to mention compression, it won't make much difference to the amount of data stored. All it means is that the data which changed only in those ~29 snapshots isn't kept unnecessarily.

{{<block note>}}
[On average](https://www.quora.com/What-is-the-average-number-of-days-in-a-month), there are 30.436875 days in a month
{{</block>}}

Because of these factors, increasing retention is pretty cheap. I now keep almost double the number of snapshots that I did before, meaning I have full daily-resolution snapshots going back 2 months, and some downsampled ones going back a little longer on the off chance I need to look back at something. That way, in the event of an issue, I can scroll back through the daily snapshots and find the data I need, with much more padding should I not notice a change for a while. I'm also leaning much less on downsampled snapshots from now on, because of the false sense of security they provide if you don't remember the rather large gap in snapshots.

Step 2 is both easier, and much harder: Be vigilant! Had I properly read, absorbed and understood the conflict messages, I could have copied the file before resolving, and I'd still have 100% of my data. Instead, I either forgot about it, or context switched too quickly, and find myself here, article-less

So heed my advice: Backup storage is much cheaper than data recovery.

{{% youtube Npu7jkJk5nM %}}

Data loss can happen at any time, for any reason, to anyone. If it's not happened to you, it's just not happened _yet_. If your data is important to you, back it up, properly! Last year, I finally got around to improving and writing up my backup strategy. If you want some recommendations, [give it a look]({{<relref backup-strategy-2021>}}).

Now, to go rewrite that article...

Again...
