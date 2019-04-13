---
title: pranklock
repo: RealOrangeOne/pranklock
---

Everyone knows that you should lock your devices when you're not using them, but it still shocks me just how few actually do. Leaving your computer unlocked whilst you leave it, whether it be for the toilet, lunch, or to leave the house greatly increases the chance of someone compromising your machine and stealing important, possibly sensitive information. Leaving a machine unattended also leaves you open to trolling, whether malicious or otherwise. I've seen some incredible trolls on people who leave their machines unlocked. From simply changing the desktop wallpaper, to using TTS to talk through the speakers.

Personally, I _always_ (or at least 99.9999% of the time) lock my devices, even if I'm the only person around in a locked, private building. Some call it strange and paranoid, I call it reinforcing a good habit. I do however quite enjoy trolling those who leave their machines unlocked, even just to educate them about the fact they shouldn't do it. It's also rather fun, but I do think there could be even greater fun in trolling the potential trolls.

[`pranklock`](https://github.com/RealOrangeOne/pranklock) is a simple lock screen alternative designed to catch out those who may want to interfere with your unlocked computer. By making your computer seem like it's unlocked, it entices said trolls. On any user input (keyboard or mouse), it captures an image from the webcam, and re-locks the screen using that, so you know who tried to troll you. In the interest of not capturing yourself, pressing `Escape` will simply revert back to your default lock screen, so you can enter your password properly.

`pranklock` is a single bash script, with very few [dependencies](https://github.com/RealOrangeOne/pranklock#dependencies), so should be very simple to integrate with your existing system, and should support any desktop environment (tested working with i3). It's designed to be as fast and secure as possible, to ensure a seamless experience. The webcam is only watching once triggered, so there's no obvious light to give the game away. Both stages use `i3lock` to ensure that even when in a trolling state, your machine is still actually protected in case of any issues.

The original implementation and idea was created by [Andy](https://github.com/adimote), however `pranklock` greatly modifies and improves the original implementation, and adds support for mouse capture and an escape-hatch.

`pranklock` is available on [GitHub](https://github.com/RealOrangeOne/pranklock). Give it a try on your computer, and see how many of your friends and colleagues you can publicly shame!
