---
title: Repairing GDM and Bluetooth Audio
date: 2018-02-13
image: resource:device-broken.png
hide_header_image: true
---

Bluetooth audio is great! I've had a pair of Bluetooth headphones, [Sony MDR-XB950 BT](https://www.sony.com/electronics/headband-headphones/mdr-xb950bt), for around a year now, and the ability to listen to music without cables is amazing. But, I can only use the Bluetooth parts of this with my phone, because on Linux, it just sounds terrible. I've even gone so far as to buy and wire in a cable on my desk at work to enable me to fairly easily connect to my desk, without having to plug into the desktop every day.

{{< resource src="device-broken.png" >}}
`A2DP` marked as _unavailable_.
{{< /resource >}}

## The Problem
The issue is caused by a lack of `A2DP`, a Bluetooth profile for transmitting stereo audio at high quality. According to the manual for my headphones, it supports `A2DP` just fine, however, my computer was reporting it didn't, and so was saying it was _unavailable_.

After a large amount of searching, I came across a number of solutions, none of which worked. From trying some alternative software, to modifying config for `bluetoothd`, no change.

## The Solution
If there's one thing I know, it's that there's an [AUR](https://aur.archlinux.org/) package for just about everything. Surprisingly, there was even a package which fixed my issue entirely: [`pulseaudio-bluetooth-a2dp-gdm-fix`](https://aur.archlinux.org/packages/pulseaudio-bluetooth-a2dp-gdm-fix/).

### Fixing
1. `yaourt -S pulseaudio-bluetooth-a2dp-gdm-fix`
2. Reboot

That's it!

{{< resource src="device-fixed.png" >}}
`A2DP` is now enabled! _(Ignore the fact the device name changed)_
{{< /resource >}}

## The Cause
According to the [related wiki](https://wiki.archlinux.org/index.php/Talk:Bluetooth_headset#GDMs_pulseaudio_instance_captures_bluetooth_headset), it's caused by `GDM` capturing the Bluetooth device, and unloading certain modules if they exist. I'm not exactly sure why it does this, but it's a fairly well documented issue.
