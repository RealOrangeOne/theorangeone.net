---
title: Yoga Pal
repo: RealOrangeOne/yoga-pal
subtitle: Control screen rotation, touch screen, and trackpad using the terminal
tags: [linux]
---

Once I started work, I bought myself a _Lenovo Yoga 3 14"_ laptop, because I needed a thin and light laptop for trains and the office. This came with windows, which within 10 minutes was running Ubuntu Gnome! Ubuntu greatly increased the performance, but I had to sacrifice all the screen, touchpad and keyboard customisation when changing 'modes'.

I found [this thread](https://askubuntu.com/questions/450066/rotate-touchscreen-and-disable-the-touchpad-on-yoga-2-pro-in-rotated-mode) with someone else trying to find a solution to this, to find a nice way of rotating the screen when in tablet mode. On the thread was a really nice simple [script](https://askubuntu.com/a/485685/432138) that rotated the screen perfectly, and did the touchscreen too.

This script worked great, doing exactly what it said it did, nicely and quickly, however it wasn't a great solution for me. Yes it worked, but it didn't allow me to change anything else, like the touchpad.

So I wrote my own CLI, based off the above script, that would allow me to tweak everything, so the laptop can be used as it was intended. With a simple command, I could swap the _mode_ of the laptop to match how I was using it.

For example:

```bash
$ yoga mode tablet  # Set to tablet mode
$ yoga mode laptop  # Reset to laptop mode
```

After writing this, It ended up finding an accidental usage. The touchscreen started glitching out, causing ghost presses on the screen, making the mouse move all over the screen and switch focus all over the place. Fortunately, I'd already written a command to disable the touch screen and prevent this:

```bash
$ yoga disable touch
```

Problem solved!

Whilst I've only tested this on my laptop, there's no reason it shouldn't work on others too! If it doesn't, submit an [issue]({{ article.repo }}/issues/)!
