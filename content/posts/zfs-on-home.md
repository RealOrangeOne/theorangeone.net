---
title: ZFS on home
subtitle: Migrating your home directory to ZFS
date: 2021-03-01
image: unsplash:sGblr5yVXiM
tags: [linux]
---

[ZFS](https://openzfs.org) is a great filesystem, especially for any kind of data storage, but the fact it's not integrated into the Linux kernel makes it a risky choice for the root OS. Canonical are [making this easier](https://ubuntu.com/blog/enhancing-our-zfs-support-on-ubuntu-19-10-an-introduction) for Ubuntu users by tightly controlling and testing the kernel and ZFS to ensure the versions integrate correctly, reducing the risk of the system failing to boot - but the odds aren't 0.

Instead of using ZFS on root, using ZFS for your home directory and perhaps a few other directories, with BTRFS for the root is a much safer choice. Should the ZFS module fail to load correctly, you're left with a machine you can log in to and debug the issue rather than a completely broken installation.

I recently got a new work machine (and a [new job](https://twitter.com/RealOrangeOne/status/1365349317805015043)) and wanted to set it up with a nice snapshotted OS, but with the benefits and familiar interface of ZFS for the directories I'm most likely to be using.

## Install ZFS

Naturally, to have a ZFS-based filesystem, you need to install ZFS. Exactly how this is done varies between different platforms, so best find a guide for your exact one.

The home directory isn't needed for boot but will be needed once you want to log in, so it'll need to be loaded on boot, and set up to automatically import pools. The [Arch wiki](https://wiki.archlinux.org/index.php/ZFS#Automatic_Start) has great documentation on how to do this, whether you're using Arch or not.

## Partition drive

My laptop has a 500GB drive, and I'm expecting most of my files to be stored in my home directory, so I want it allocated the most space. I've allocated 150GB for the OS, and 350GB for the ZFS pool.

In my case the laptop only has a single drive, so I've partitioned the drive. If you intend to put the home pool on a separate disk entirely, then you can allocate ZFS the entire disk instead. ZFS runs totally fine given just a partition rather than the entire disk.

## Create pool

Now create the pool, using whichever custom properties you wish.

When creating the pool, be sure to set a custom mount point to ensure ZFS doesn't mount at `/home`, which right now would cause some issues as there's nothing there!

```bash
$ sudo zpool create data -m /mnt/data /dev/nvme0n1p4
```

Notice that I've not named my pool "home". This means that in future should I want to move other directories on the OS onto ZFS (such as databases), I can without feeling back about an inaccurately named pool.

If you, like me, need to encrypt your pool, now is the time to do it. Encryption can also be set at the dataset level instead, should you want some things to be unencrypted, or encrypted using a different key. Note that encryption cannot be toggled once the pool / dataset has been created.

## Create datasets

Datasets are one of ZFS' great features, allowing you to snapshot specific directories from your pool and set properties more suited to the data stored inside them.

Snapshots can only be done to datasets or pools, not specific directories. If you think you might want to snapshot a directory, it needs to be a dataset.

### Set options

For example, I have the dataset `home` which I'll be mounting at `/home` in future, which has a reasonable amount of compression set, so things like dotfiles and other bits of cruft stored in my home directory can benefit from some nice compression. My projects directory is going to be written to a lot as I'm working, and it'd be great if operations there were as fast as possible, so I've set a faster but less effective compression algorithm on that dataset. In contrast, I may download some large files, and keep them around for a bit, so it'd be great if that could be compressed even more than normal to save some disk usage.

```
$ zfs list -t filesystem -o name,mountpoint,compression data/home -r
NAME                          MOUNTPOINT                 COMPRESS
data                          /mnt/data                  zstd
data/home                     /home                      zstd
data/home                     /home                      zstd
data/home/jake                /home/jake                 zstd
data/home/jake/Documents      /home/jake/Documents       zstd-19
data/home/jake/Downloads      /home/jake/Downloads       zstd-19
data/home/jake/Projects       /home/jake/Projects        zstd-fast
```

{{<block note>}}
`zstd` and `zstd-fast` compression options are only available on ZFS 2.0. For older versions, I recommend using `gzip-7` for everything, `gzip-9` for heavy compression and `lz4` for fast compression.
{{</block>}}

Obviously compression isn't the only property you can set at the dataset level. You can change them down the line, however note that some property changes will only apply to newly written data.

## Do the swap over

Now that the pool is set up and configured as needed, your data needs to be actually transferred into it, and it to be actually used in future.

### Copy files to pool

When copying the files, it's critical you maintain the permissions and ownership of the files exactly as they are currently in your home directory. Therefore, simply doing `cp -r` isn't good enough.

`rsync` is a great tool for doing copies like this, and can even output progress information. To ensure the permissions are copied over correctly, be sure to run it with `--archive`:

```
$ rsync --archive --progress /home/ /mnt/data/home/
```

Alternatively, if you're a purist, `cp` has a similar flag `-a` which will maintain the permissions as needed:

```
$ cp -a -r /home/ /mnt/data/home/
```

You'll want to do the file copy as close to updating the mount point as you can, to ensure you miss any changes. I'd recommend doing the bulk of the copy beforehand, as it'll likely take a while, then you only need to copy the changes once you're ready to switch the mountpoint.

### Update mountpoint

Once you've copied all your files over to the right place, it's time to update the mount point. Best save anything you have open, and close anything you don't need to reduce the chances of anything strange happening.

```
$ zfs set mountpoint=/home data/home
```

This will immediately update the filesystem such that `/home` points to your ZFS pool, and the datasets under it updated to mount to their relevant locations.

To ensure everything went correctly, reboot the machine.

## Purge previous data

Now that all your data is in the ZFS pool, it can be removed from the main OS drive to save some space.

To access the `/home` directory of your root drive, as opposed to your ZFS pool, you'll need to mount your root filesystem again in a different location:

```
$ mkdir /mnt/root
$ mount /dev/nvme0n1p3 /mnt/root
```

Now, `/mnt/root/home` will be your original `/home`, prior to the mountpoint change.

I'd recommend just renaming the directory (`/home/jake` -> `/home/jake-backup`) temporarily, should you need to jump back quickly when something stops working. Then after a few weeks, once you're happy everything's working, delete away!
