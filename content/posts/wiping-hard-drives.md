---
title: Wiping Hard Drives
subtitle: As close to wiping a hard drive as you can get, at least
date: 2020-11-21
image: unsplash:5yEiCUynJ9w
tags: [security, linux]
---

People say there's no 100% reliable way to wipe a storage drive, and they're right. By the nature of how mechanical drives work, there's no real way to say for sure whether the data is ever really gone.

With drives, the only way to be sure the content is gone is to destroy them. Whether by scratching the platters, destroying them, or just crushing the entire enclosure.

![The only way to really wipe a hard drive](https://www.gadgetify.com/wp-content/uploads/2017/08/29/HSM-HDS-230-Hard-Drive-Shredder.gif)

Sometimes however, there are legitimate times where you need to give a drive away, re-purpose it somewhere else, or in my case send it in for an RMA. In situations like that, it can't hurt to be cautious and try to wipe the drive as best you can.

## Tools

Wiping a drive like this isn't foolproof. Whilst it's highly unlikely and would require an incredible amount of time and experience to get even a single bit off a drive.

These tools all have some kind of progress monitoring, but you can use `iotop` to show the speed data is being written to the device.

### `badblocks`

[`badblocks`](https://linux.die.net/man/8/badblocks) is a tool designed primarily for finding faults in drives and performing [burn-in](https://blog.ktz.me/new-hard-drive-rituals/) tests.By the nature of how it works, it writes data to a disk systematically such that it writes to every single block.

```
badblocks -b 4096 -wsv /dev/sdX
```

In reality, this isn't a great tool for doing this, as it also reads the data back which can take just as long as the writes. But it's still a useful tool in the box nonetheless.

### `shred`

[`shred`](https://linux.die.net/man/1/shred) is designed specifically to delete files and make their contents unrecoverable. It does this by repeatedly writing over a file 3 times with random data. You can also configure it to do an additional pass with just zeros, which exists to hide the fact the drive has been shredded.

```
shred -vfz /dev/sdX
```

`shred` can also operate on files, if you've got just a file to shred. This relies on the fact that the filesystem overwrites data in place, which in many cases it doesn't.

### DBAN

[Darik's Boot And Nuke (DBAN)](https://dban.org/) is a tool designed for wiping hard drives, however rather than being a command-line tool, it's a bootable environment. This should make it much easier to use, and because you don't need another drive to run it off (besides a USB), it massively reduces the chances of nuking the wrong drive.

### `dd`

Ah [`dd`](https://linux.die.net/man/1/dd), good ol' `dd`. Now we need the features which give it the nickname "disk destroyer". `dd` simply writes files to other files, and on Linux everything's a file! Therefore it's easy to just say "hey, fill this drive with zeros", and `dd` will do it as fast as it possibly can!

```
dd if=/dev/zero of=/dev/sdX bs=1M
```

No frills, no extra writes, no ensuring it writes to every sector. Just disk writes. If you're super paranoid, you can replace `/dev/zero` with `/dev/urandom`, as this not only ensures the resulting data is random, but can also help against any internal caching or compression the disk is doing.

## Wrapping up

Like I say, wiping drives isn't really possible with 100% certainty. So if you're super paranoid, best either not send back drives, or encrypt the hell out of them.

If you do have to give a drive to someone else, and you want to be as sure as you can there's no data on it, then my personal tool of choice is [`shred`](#shred). I can just run it on my server on outbound drives just before unplugging them.
