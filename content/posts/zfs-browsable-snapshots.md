---
title: Browsable snapshots with ZFS
subtitle: Viewing your ZFS snapshots as if they were directories
date: 2020-09-06
image: https://openzfs.github.io/openzfs-docs/_static/img/logo/800px-Open-ZFS-Secondary-Logo-Colour-halfsize.png
tags: [linux]
---

[ZFS](https://en.wikipedia.org/wiki/ZFS) is a pretty sweet filesystem, an opinion shared by the majority of the internet it seems. BTRFS ([No Wikipedia, it's **not** "butter fuss"](https://en.wikipedia.org/wiki/Btrfs)) is also a nice filesystem, and the fact it's built-in to the kernel makes it far safer to use as a root filesystem.

One of my favourite features of BTRFS, even if it does also annoy me, is browsable snapshots. [Snapshots](https://btrfs.wiki.kernel.org/index.php/Incremental_Backup) are simply as read-only directories, and can be mounted wherever.

```
btrfs subvolume snapshot -r /mnt/tank/dbs/postgres/nextcloud /mnt/tank/dbs/postgres/nextcloud.$(date +%Y-%m-%d)
```

Whilst this makes accessing data really simple, as snapshots can be enumerated simply with `ls`, it also really clutters up directories and looks messy to me.

In contrast, ZFS snapshots are listed through `zfs list -t snapshot` command.

```
$ zfs list -t snapshot
...
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_00:00:02_daily         0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_00:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_01:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_02:00:01_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_03:00:01_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_04:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_05:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_06:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_07:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_08:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_09:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_10:00:02_hourly        0B      -   260M  -
tank/dbs/postgres/nextcloud@autosnap_2020-08-30_11:00:02_hourly        0B      -   260M  -
```

Wouldn't it be great if you could browse ZFS snapshots like they were directories, as you can with BTRFS?

...

Well, you can!

Inside your ZFS datasets exists an invisible `.zfs` directory. This directory isn't "hidden", it's invisible, it won't appear to `ls -a`, but you can `cd` into it (it won't tab-complete).

```
/mnt/tank/dbs/postgres/nextcloud/.zfs$ ls
shares  snapshot
```

Here we can see the shares and snapshots set up for the dataset.  If we take a look inside the `snapshot/` directory:

```
/mnt/tank/dbs/postgres/nextcloud/.zfs/snapshot$ ls -al
...
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_00:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_01:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_02:00:01_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_03:00:01_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_04:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_05:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_06:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_07:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_08:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_09:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_10:00:02_hourly
drwxrwxrwx 1 root root 0 Aug 30 12:01 autosnap_2020-08-30_11:00:02_hourly
```

Hey look, all our snapshots! And of course, each of our snapshots is a directory, so can be browsed easily:

```
/mnt/tank/dbs/postgres/nextcloud/.zfs/snapshot/autosnap_2020-08-30_00:00:02_hourly$ ls
base    pg_commit_ts  pg_hba.conf    pg_logical    pg_notify    pg_serial     pg_stat      pg_subtrans  pg_twophase  pg_wal   postgresql.auto.conf  postmaster.opts
global  pg_dynshmem   pg_ident.conf  pg_multixact  pg_replslot  pg_snapshots  pg_stat_tmp  pg_tblspc    PG_VERSION   pg_xact  postgresql.conf       postmaster.pid
```

These snapshots expose all the same file permissions and layouts as ZFS snapshots, because that's what they are. You can copy files out of them, read files and all! For obvious reasons you can't edit the files, but it definitely makes reviewing snapshots so much easier!

You can read more about this in the [FreeBSD handbook](https://www.freebsd.org/doc/en_US.ISO8859-1/books/handbook/zfs-zfs.html) (section 19.4.5.4).
