---
title: macOS - A Linux Guys Perspective
date: 2019-10-01
tags: [linux]
image: unsplash:K_aNRqkOTH0
---

For the last four years, I've been spending every working day off a Dell Optiplex. With an after-market SSD upgrade, and a little extra memory, it makes a pretty good work machine. When it comes to needing to work away from my desk, it's a little annoying having only a desktop. For the last 10 months, I've been asking for a laptop which, because _reasons_, has to be a macbook.

Last week, I got my macbook! With one condition: I had to give macOS a try, for a whole week. And so, with every intention of installing Linux on it afterwards, I gave it a shot.

## The Review

### The keyboard

Honestly, I quite like the keyboard. The `alt`/`super` swap is a little annoying, but very easy to get used to! The `ctrl`/`fn` swap is also rather annoying, but I suspect that's mostly due to coming from a Dell.

#### `cmd` / `alt` get mixed up a lot!

I'm a firm believer in convention. I like the pattern of keeping the super (Windows, meta, whatever you want to call it) for OS-level bindings, and letting developers go to town on the other bindings. It seems macOS never got the memo. `cmd` seems to be used for a variety of different tasks, whether it be clipboard management, selecting tabs in Firefox or selecting lines in VSCode. `cmd` seems to take the place of `ctrl` in some places, and `alt` in others.

#### It's far too easy to press `CMD + Q` when aiming for `CMD + 1`!

Really this issue is more because I'm clumsy and lazy rather than an issue in macOS. `CMD + Q` is the keyboard shortcut to close the current application, generally without a prompt. This caught me out multiple times, and completely closed Firefox and all its tabs, when I simply wanted to go to the first.

This is something I've already [solved this in i3](https://github.com/RealOrangeOne/dotfiles/commit/e0da9bf3f0f80baca0cee47c8779bf0fddc9afe4), but I never solved it on macOS, namely through a lack of trying.

#### OS overriding keyboard backlight

The macbook I was using, much like most macbooks (**with ports**), has a backlit keyboard, with variable brightness. I personally quite like the backlight on, as high as possible, regardless of battery drain! What I don't like is the OS trying to deal with the brightness for me!

By default, macOS automatically sets the keyboard brightness to turn off in low light, which took a lot of tinkering to work out. [Stack exchange to the rescue!](https://apple.stackexchange.com/a/45381)

#### Shiftit

As someone who's used to a tiling window manager, it's weird going back to a regular desktop. The inability to snap windows to the side is just far too weird.

[Shiftit](https://github.com/fikovnik/ShiftIt) is a great, free and open source application to help just this. It adds keyboard shortcuts for moving windows, minimizing, maximizing, full screen-ing (which is apparently different?!). For me, this turned macOS into a painful endeavour, to a somewhat-usable experience.

Alternative extensions are available, although many of the more powerful ones cost money. I don't want to pay money for something so fundamental as this, especially not for what is basically an experiment.

#### `fn`+ arrows is home and end, sometimes

On most _sane_ Operating Systems, Home/end operate differently depending on focus. When in a textbox, they control the cursor on the line, and the window everywhere else. On macOS, it seems to be different. Home / End always controls the page, whilst `CMD` + arrows control the cursor. I mostly had this issue with Firefox.

A part of me likes the fact it's explicit and different, but the muscle memory is too much to get over! It's also very rare.

### Screen brightness varies

A common battery-saving technique involves automatically dimming the screen when it doesn't need to be as bright. This is something I've always turned off, as I find the screen ends up darker than I would want, and I can deal with balancing the power draw myself.

macOS balances the screen brightness by default, which is fine, but no matter what I could do, it never seemed to be an absolute value. The screen was never really bright enough in some environments, but in others completely fine.

### Applications

#### `brew cask` is great!

Historically, package installation on macOS has been in the form of `.dmg` files. These files contain a disk image which, once mounted, contains a `.app` which can then be copied to the `Applications` directory. This requires far too much GUI interaction for me.

`brew` is the command-line package manager for macOS, allowing simple installation of almost any application and service for macOS. `brew cask` is an extension for this, designed specifically for GUI applications. It also means each application has to update in its own special way.

As someone who's used to the AUR, this felt great! One command to install and update almost any application I need.

#### Global emoji-picker is awesome!

Usually, I use [uniemoji](https://github.com/salty-horse/ibus-uniemoji/) for global emoji input on Linux, which works reasonably well. macOS is nice enough to include a global, officially supported emoji picker right in the box! It seems to not work in Firefox, but besides that it's incredible, and supports far more than just the emoji specification.

Unfortunately, however, the search for it is awful. Take the ":joy:" emoji, for example. The icon itself is ["Face with Tears of Joy"](https://emojipedia.org/face-with-tears-of-joy/), although often referred to as simply "Joy". To any reasonable person, that would mean searching for it as "Joy" would work fine, but it doesn't. It seems macOS, in its infinite wisdom, doesn't support partial-text search for emoji, so searching for "Joy" yields nothing. In their defence, it does exclude "Face with" etc, so searching for "Tears of Joy" does yield :joy:.

#### Windows vs Applications

For anyone who's used a _traditional_ OS, the fact macOS has a distinction between windows and applications is incredibly strange. This is an intentional design pattern for macOS, which has been there since the beginning. It's something I could never quite get used to.

The internet suggests there isn't any application memory sharing advantages to doing this, just a pattern. It's something which really took a lot to get used to, especially when looking at applications in the dock.

### The Dock

The dock is what displays applications at the bottom of the macOS desktop. It shows a mix of running applications, pinned applications, and extra things like trash and downloads. As someone who's used Gnome before, it's not an alien concept. It does however, function slightly differently to Gnome, in a bad way.

No matter how many times I removed them, some applications kept returning to the dock, even after being closed and manually removed. I ran the dock in a completely minimal way, having it show only the running applications, and launching everything through spotlight, which made this yet more annoying. The fact I also couldn't remove Finder from the dock was also annoying because exactly this, it's just unnecessary clutter!

### Screenshots

Anyone who's used macOS will know that its support for screenshots was clearly not designed for users in mind. Standard keyboards have an incredibly useful 'Print Screen' key, which captures the screen, and is aptly named. macOS has the _equally obvious_ `CMD + Shift + 4`.

Apple maintains a comprehensive, but unnecessarily complex [support page](https://support.apple.com/en-us/HT201361) on how to take screenshots. There are many 3rd-party applications available to make this process easier, my personal favourites being [Skitch](https://evernote.com/products/skitch) and [Lightshot](https://app.prntscr.com/en/index.html).

### Scroll-wheel acceleration

Just, WHY?!

Trackpad acceleration feels reasonably natural, flicking around content as if you're actually touching it. On a scroll-wheel, not so much. It just means depending on how quickly you're scrolling, one notch could be one line or several, it depends on how the OS is feeling. I use an MX Master, which has a ratchet-free scrolling mode, which makes the acceleration even more noticeable, and even more annoying.

What's more, is that whilst you can disable trackpad scrolling, you can't disable scroll-wheel acceleration, not without using 3rd-party applications, many of which look like somewhat hacky scripts (not that I'm against those!).

## Conclusion

Historically, I've never been the biggest fan of macOS, for many reasons. After living with it for a week, said opinion hasn't changed. There are certainly some nice parts I've discovered, but needless to say macOS is not here to stay!

Said macbook now runs Arch, and it's great! But that's a story for another day.
