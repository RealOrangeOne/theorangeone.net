---
title: My first arch install
subtitle: With Antergos gone, it's time to install arch from scratch!
date: 2019-05-29
tags: [arch, linux]
---

I've been an arch user for many years, and a linux user for even longer, but I've never installed arch from scratch. I was an Antergos user for many years, but after its demise, I needed an alternative. In a [previous post]({{< relref replacing-antergos >}}), I spoke of attempting to install vanilla arch from scratch on my laptop. As I write this, it works well, really well. Everything installed correctly, complete with EFI boot, encrypted partitions and sleep state.

Speaking to those who have installed arch before, they say _"oh, it's simple"_ and _"it only takes like 20 minutes"_. Both those statements are wrong! To go from booting into an arch ISO to a login shell of a remotely usable system took around three hours, and countless browser tabs. I hit a lot of hurdles which, in hindsight, I definitely should have seen coming, and almost certainly already knew. But if they tripped me up, they'll almost certainly have tripped someone else up.

## Gotchas

So here's my one stop shop of the things which caught me up during the install and set up process. Whilst I did this install on my XPS 15, it's all pretty generic.

### Use a wired network

For someone who's never had to configure a network interface manually from the terminal, it's quite a scary thing to get a wireless network working. In contrast, a wired network _just worked_ (once the `dhcpcd` service is started), even using a sketchy type-c adapter.

The wired network was both more stable, came up faster, and had a faster network speed than a wireless one, which is critical when doing an OS install. Network cutting out basically means restarting the `pacstrap` step again, which can be annoying on a 3 MB/s connection.

### Set your keyboard layout

I use a standard UK-ISO layout, which isn't the default on the arch installer. If you're like me, and don't use US-ANSI, you'll need to change it. For me it was as simple as `loadkeys uk`, but consult the [arch wiki](https://wiki.archlinux.org/index.php/Linux_console/Keyboard_configuration#Loadkeys) for details.


### Your AUR helper may need to be manually installed

Many applications I use are installed from the AUR, it's the main reason I switched to arch in the first place. To my knowledge, there are no AUR helpers available in any of the default repos. Antergos provided `yay`, my AUR tool of choice, in their additional repo. Because Antergos is no more, and I don't want to install a package from a _deprecated_ repo, I had to install it manually using `makepkg`.

The `yay` git repository has [instructions](https://github.com/Jguer/yay#installation) on how to do this, but it's quite literally three commands!

After this, `yay` will update itself from the AUR package once an update is available.

### Set your root password

The arch installer doesn't have a root password, and is set to auto-login. The resulting arch install also doesn't have a root password by default, but won't automatically log you in, for obvious reasons. Before rebooting, set a root password, just in case!

Fortunately, if you *do* forget to set a password, you can just reboot into the arch ISO, re-mount your partitions, and use `arch-chroot` to enter your install, and set a password from there. The installation process just taught you how to mount the partitions properly, so you should be well versed at it!

### `base-devel`

Most of the guides I saw for installing arch simply said to install the `base` package group. Originally I took this advice, thinking `base-devel` contained things I didn't need to do kernel-level development on the OS. I was wrong.

Whilst `base-devel` does contain many developer-related packages, such as `gcc` and `make`, it also contains some important system utilities, namely `sudo`, `file`, `which` and `grep`. You can see the full list of packages [here](https://www.archlinux.org/groups/x86_64/base-devel/), but changes are you want most of these, so just install it.

### Antergos tweaks

Antergos makes many tweaks compared to a standard arch installation. Not only do many of the packages in the `antergos` repo contain patched versions with modified default configurations and code, but many of the default configuration files are modified to yield a better user experience.

`Xsession` was a particularly painful example. The Antergos patched version of `Xsession` forcefully set the value of `$QT_QPA_PLATFORM`, which interfered with my styling changes. My dotfiles now contain a [patch](https://github.com/RealOrangeOne/dotfiles/blob/d8e587acf167733b15467762263cd1b41c9dcd1b/files/xsession.patch) to remove this. You can read more about how I style QT [here]({{< relref make-qt-less-ugly >}}).

## Useful references

If you're going to install arch for yourself, I highly recommend reading up on how the installation works. If there's a guide on how to do it for your device, even better!

For my install, there were a couple of sites I used in particular which were useful in installing:

- https://wiki.archlinux.org/index.php/Installation_guide
- https://www.howtoforge.com/tutorial/how-to-install-arch-linux-with-full-disk-encryption/
- https://ahxxm.com/151.moew/
- https://github.com/trickeydan/dotfiles/blob/master/scripts

## Next

Once the installation was complete, it was as simple as cloning [my dotfiles]({{< relref dotfiles >}}), and waiting for a complete system. There were a couple of issues with that, but mostly because of packages previously installed with Antergos, which I now had to explicitly install.

One machine down, three to go...
