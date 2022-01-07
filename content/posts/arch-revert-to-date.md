---
title: Revert Arch linux packages to specific date
date: 2017-09-11
image: https://www.lumalab.net/download/archlogo/arch-logo-shiny-dark.png
subtitle: Arch is well known for going wrong, but today was the first time this affected me doing my job
tags: [arch, linux]
---

I'm one of those Arch users who _apparently_ doesn't use arch properly: I install updates daily, including packages from the AUR. This has the great benefit of giving me the most up-to-date packages available from upstream. However, the downside of meaning I have the latest packages from upstream, meaning if something breaks, even temporarily, it breaks for me.

I'm also one of those _crazy_ people who uses arch on my work machine. Craziness aside, it's never caused me an issue, until today.

After running updates this morning, as I normally would, I went to start the project I was working on today locally, and was met with this wonderful message:

```text
django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 module: /home/jake/Projects/******/env/lib/python3.5/site-packages/psycopg2/.libs/libresolv-2-c4c53def.5.so: symbol __res_maybe_init, version GLIBC_PRIVATE not defined in file libc.so.6 with link time reference
```

As this was a work machine, I didn't have the time to research into the correct solution. I knew this was something to do with updates, because that's all that had changed between the last time it worked and now. But I had a feeling rolling back updates to a given date, especially on arch, would be fairly painful. Much to my surprise, it was super simple!

After frantically googling, so my boss didn't notice my downtime, I found [this](https://www.ostechnix.com/downgrade-packages-specific-date-arch-linux/) article, which solved my needs completely. A simple config edit, and one command, and I was back to working.

## Doing the rollback
The way this solution works is by rather than using the current state of the package repos, we use an archive from a specific date.

### 1. Change mirror to archive
Edit the mirrorlist to point to the archive at a specific date. Change the contents of `/etc/pacman.d/mirrorlist` to:

```text
Server=https://archive.archlinux.org/repos/2017/09/08/$repo/os/$arch
```

Remember to take a backup beforehand just in case! Here's I've set the date to last Friday (8th September 2017), but just replace the date in the URL with the date you need (`YYYY/MM/DD`).


### 2. Force install updates
Force update package repos, and install packages. If there are newer packages installed than are available in the repos, they'll be downgraded.

```bash
sudo pacman -Syyuu
```

### 3. Reboot?
Depending on what packages have been downgraded, you may have to reboot to apply these changes. For the change I needed, a reboot wasn't needed. I just relaunched the terminal, and got on as normal.

## Reverting
To revert, just restore the backup of the pacman mirrorlist, and re-run the above pacman command.

## Outdated Packages
Generally, having out of date packages on your system is a bad idea. Not only for security reasons, but stability and compatibility. [The article](https://www.ostechnix.com/downgrade-packages-specific-date-arch-linux/) goes through a couple more too.

## Actually solving my issue
A few days later, After [tweeting this post](https://twitter.com/RealOrangeOne/status/907591524644466688), I had a discussion with [@MortenLinderud](https://twitter.com/MortenLinderud) about the issue, who [pointed out](https://twitter.com/MortenLinderud/status/908262748718596096) that the library had already been fixed. So after updating `psycopg2`, my issue went away!
