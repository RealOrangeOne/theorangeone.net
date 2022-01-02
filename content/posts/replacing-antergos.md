---
title: Antergos to vanilla Arch
date: 2019-05-25
subtitle: With Antergos unsupported, what's next?
image: https://2.bp.blogspot.com/-Sqy8eqqY4Kg/VzeTtm1RtEI/AAAAAAAAAw4/nP7ql0Py2-MhTfexWfOnCDI5pPelo6mYgCLcB/s1600/antergos-everyone-bg.jpg
tags: [arch]
---

I've been an [Antergos](https://web.archive.org/web/20190903082315/https://antergos.com/) user for almost three years, and I love it! It's like Arch, but with a simple installation process, and yields a near-pure Arch install, unlike Arch derivatives like [Manjaro](https://manjaro.org/). Unfortunately, on 21st May 2019, the [Antergos project ended](https://web.archive.org/web/20190816093432/https://antergos.com/blog/antergos-linux-project-ends/). Those behind the project were unable to commit the time the project needed and deserved. I for one want to thank them for the effort they have put in!

The issue now is what to do with my machines which run Antergos (of which there are currently 5). Technically, I don't need to do anything, the Antergos team state that because existing installations are _basically_ vanilla arch, there's no need to panic and wipe:

> For existing Antergos users: there is no need to worry about your installed systems as they will continue to receive updates directly from Arch. Soon, we will release an update that will remove the Antergos repos from your system along with any Antergos-specific packages that no longer serve a purpose due to the project ending.

However, some of my machines are due a clean re-install, in a (possibly futile) attempt to improve stability. This means the time has come to install real arch, from scratch! I've never done anything quite like this before, and I had very little idea where to start. Before I can even think of downloading an Arch ISO, flashing it to a USB, and getting on with things, I need to research a lot, and change some of my processes.

## 1. Update dotfiles

[My dotfiles]({{< relref "dotfiles" >}}) enable quickly setting up machines to exactly how I like, but there's still large amounts of the system installation process it doesn't account for, by design, because it was usually handled by the Antergos installer.

## 2. "Unknown Unknown" applications

Probably the largest factor which put me off doing something like this earlier, is that Antergos installs a lot of packages the user has no idea about, which result in a more stable system where things actually work. It's hard to work out exactly what these packages are, without doing a deep dive into the installed packages.

Fortunately, as an [i3](https://i3wm.org/) user, I've had to set up much of the desktop environment myself, so that part is sorted. But many of the system utilities, especially those related to the bootloader, are new to me, and going to be vital to get a running system.

## 3. How does one install Arch?

Arch is famously manual to install. You're dropped at a shell, and told to bootstrap the system yourself. Partitioning, timezones, network, base packages, all from scratch. It's not even remotely as manual as [Gentoo](https://www.gentoo.org/), but compared to the installers found in Ubuntu and even Antergos for that matter, it's still very manual!

The Arch wiki has a [helpful guide](https://wiki.archlinux.org/index.php/Installation_guide) on how to install Arch, which goes over most of the steps quite nicely

## 4. Can I switch to EFI?

When I first started using Linux, it was just easier to use BIOS booting. Now, there's some usability, stability and security improvements to be gained from using EFI. The EFI set up process is nearly identical for Antergos, but now I'm installing from scratch, I need to learn the differences for myself.

## Moving forwards

This post marks the start of my research and testing period, working out what's needed to do a re-install, and how stable the resulting system is going to be. In the near future, I plan to post about the exact installation process, and my experiences. First on the list is upgrading my laptop, which fortunately has its own [wiki page](https://wiki.archlinux.org/index.php/Dell_XPS_15).

Stay tuned!
