---
title: State of the Apps 2022
date: 2022-01-01
tags: [self-hosting, linux, arch, state-of-the-apps]
image: unsplash:TgGipdWWDuA
---

It's a new year, so it's time to reflect back on the tools I used last year, how they'll change this year, and how they might change in future. It's still an idea I've completely stolen from [CGP Grey / Cortex](https://www.relay.fm/cortex/122), but I think it's useful, fun and interesting.

I'm still working from home full time, and since [last time]({{<relref "state-of-the-apps-2021">}}) have moved to a fully remote position at a different company (The offices exist, just a couple hour's drive away). This year has been much more a time of stabilizing what I'm using rather than trying out radical new approaches, but overall I'm much happier with how I'm getting things done.

## Platforms

### OS

2021 may not have been the year of Linux on the desktop, but still some great things have come from it. I'm still very much a linux user, and pretty happy with it. This year does mark me setting up a Windows machine for the first time in many years, but it's just in a VM for testing some things. 2022 hopefully brings a few more niceties.

I'm still using [Arch](https://archlinux.org/) (by the way), and it's working fine for what I need. The [AUR](https://aur.archlinux.org/) is still the absolute killer feature for me, and I can't find anything similar on any other platform. Some may argue the stability makes it unsuitable for a professional machine, but my work laptop (Thinkpad X1C8) has been running absolutely fine since March with 0 issues of any kind.

I've had a bit of an eye on [Nix](https://nixos.org/) for a bit over the last year. Given I [provision my devices using Ansible](https://github.com/realorangeone/dotfiles) anyway, might as well go all in. But Nix is quite a rabbit-hole to dive down, and certain members of its community have made it a real turn off. If you thought some members of the Arch community was bad, Nix sure has worse.

### Desktop Environment

The desktop environment is the window into the device, through which we interact with and control everything. Currently, my desktop environment of choice is [i3](https://i3wm.org/), and in the last year very little about it has changed. It's still a fairly minimal setup, with 2 bars, and a bunch of custom shortcuts and rofi-based scripts.

In the last year, I've really looked into some possible alternatives, but nothing ever sat quite right:

- Gnome didn't have good tiling support. [Pop-shell](https://github.com/pop-os/shell) is _nice_, but it's often out of sync with the gnome versions in the Arch repos, so is often broken or buggy.
- KDE is alright, but quite a monster, and again very little i3-tier tiling scripts, and would require some hacks to get it versioned with tools like Ansible.
- [i3-Gnome](https://github.com/i3-gnome/i3-gnome) works fairly well, but is a bit of a bodge, and has no wayland path (i3-sway doesn't really exist besides a few PoCs)
- [i3 + KDE](https://userbase.kde.org/Tutorials/Using_Other_Window_Managers_with_Plasma#Configure_i3) also works quite well, but also has no wayland path. And everything I liked about my i3 setup was implemented differently by KDE (especially notifications)
- [Enlightenment](https://www.enlightenment.org/) is very promising, but being neither GTK nor QT based, a lot of the tools look different, and that's before trying to automatically configure it, which doesn't appear to be an option.

Last year I said I'd have left i3 for something else, and I haven't. But in the last few months, I've taken a step back, and asked myself "What do I want out of a different desktop environment" - and always came up blank. i3 is lightweight, customizable, fits fairly well with my brain, and thanks to sway has some form of future in a wayland world. A few creature-comforts like compositing, a settings panel etc would be great, but I just don't need them most of the time. KDE + i3 is definitely the closest to what I'm after, but miles off. Stealing the components from environments like XFCE is also something I'm interested in trying to get some of these features. I'm already using their power monitor.

Somewhat recently, The folks at System76 [mentioned](https://www.omgubuntu.co.uk/2021/11/system76-is-building-its-own-desktop-environment) looking into developing a new desktop environment (in rust!). Given their like of (some of) Gnome _and_ tiling managers, it's a project I'll be following with a lot of interest.

### Shell

My shell hasn't changed since last year, and probably won't change next year. [Alacritty](https://alacritty.org/), [ZSH](https://www.zsh.org/) and [tmux] are at its heart, and that's probably not going to change. I've considered switching back to bash for a more cohesive setup across devices, but given I don't use many of the zsh-specific features, it doesn't make a difference, and having some [oh-my-zsh](https://ohmyz.sh/) plugins can be rather nice.

I still haven't had a proper look into my clipboard issues, but my brain has trained itself to just ignore it and work around it. Some parts have got better, others haven't. Hopefully by the time I get really annoyed by it, it'll magically solve itself.

### Browser

It's 2021, basically everything nowadays is done through a browser. Whilst I write this I'm looking at Firefox, Obsidian, VSCode and Discord, all of which are browsers in some form or another.

As for actual browsers, I'm still a loyal [Firefox](https://www.mozilla.org/en-GB/firefox/) user. It does everything I need, without aiding the Chromium monoculture of the web today.

One of the features of Firefox I'm yet to play around with is [Containers](https://support.mozilla.org/en-US/kb/containers), which let you have completely separate login sessions on websites without them conflicting or interacting. For separating work, personal and throwaway stuff, it could be quite useful. I've found myself browsing a lot more in "private browsing", which whilst not private, does help keep some cruft and tracking away.

### Servers

With self-hosting, comes needing a lot of servers. My server setup has changed quite a bit in 2021, and I expect it to change even more next year. For that reason, I've extracted it out into its [own dedicated post]({{<relref "server-setup-2022">}}), which goes through the changes in more detail.

## Services

If you've spent even 2 seconds looking at my posts, you'll know I very much enjoy running and writing software for myself to fulfil my needs, rather than relying on hosted services. With that said, there are some times when it's just better, more reliable, or there's no getting around it.

### VPN

I have VPN for 2 main reasons. 1 being when browsing the internet from untrusted locations, and the other for downloading _linux ISOs_. Granted I don't really like using public WiFi, sometimes it's just a requirement, as is a VPN.

This year, my subscription with [PIA](https://www.privateinternetaccess.com/) finally ran out, and I threw myself head-first at [Mullvad](https://mullvad.net/) and have never looked back. It's a great service, good ethos, and great clients, not to mention just being able to download the WireGuard config myself to run natively.

Perhaps my biggest gripe with them is the connection limits with WireGuard. Mullvad give you 5 devices, which is great, but I find myself often needing to at least have the app installed on more than 5 devices, even if they're not being actively used. Most other VPN providers give 5 _concurrent_ devices, which makes much more sense. Having to delete and recreate the WireGuard keys manually, hoping I don't delete the ones installed on my server, is definitely getting annoying!

### Email

Email is still alive and kicking in 2021, and sure isn't going anywhere in 2022. I try to use it for as little as possible, but there's no getting around it in some cases. As I have been for many years, I'm a happy [Fastmail]({{<referralurl fastmail>}}) user. They have the features, UX and pricing which can't be beat. Yes they're in a [five-eyes](https://en.wikipedia.org/wiki/Five_Eyes) country, but they have a strong focus on privacy and security, which is enough for me. Yes companies like [Proton Mail](https://proton.me/) will probably be better, but their [pricing tiers](https://proton.me/pricing) are a complete dealbreaker for me.

Client wise, I'm still a pretty big fan of [Thunderbird](https://www.thunderbird.net/). I use it a lot for work (because Gmail is garbage), but I'll often find myself just using the Fastmail web UI for most things. Thunderbird is still showing its age, but the renewed focus from Mozilla and the community is slowly starting to show through (like the [rumored](https://bugzilla.mozilla.org/show_bug.cgi?id=1712710) Matrix client support).

### Music

2021 has definitely had some increased music usage. Whilst in the before times there was an office to drown out, now there's just my brain which needs distractions drowned out. Apparently, I've listened to **35000** minutes of Spotify in 2021, which is quite amazing!

As for the platform, there's just nothing to beat Spotify. Not because it's the got the best library, or the best clients, or the best community, but because it's pretty great at all those things, and has enough of everything I need without any annoying _features_.

Whilst I definitely find myself listening to specific albums and artists on repeat, I do try and keep a few dedicated [playlists]({{<relref "music">}}) for specific purposes.

### Monitoring

I run a lot of different monitoring services for monitoring a bunch of different metrics around my systems. Whilst I like to monitor as much as I can myself, what monitors my monitoring? This is where [Uptimerobot](https://uptimerobot.com/) comes in. Uptimerobot is a hosted monitoring service with support for HTTP, TCP and ping targets. I monitor very little directly with uptimerobot, it mostly exists for the critical services (website, analytics, nextcloud) and my [uptime-kuma](https://github.com/louislam/uptime-kuma) instance itself.

This way, most of the monitoring happens from uptime-kuma, and if that goes down, uptimerobot catches it. I've used uptimerobot for a few years, and it's been very reliable, and if uptimerobot goes down, they have their own team to get it back up and working. Hopefully this way, if something I have goes down, I'll find out no matter what.

### Video

This year I finally wrote about my YouTube workflow. For a few years now I've watched [YouTube primarily through RSS]({{<relref "consuming-youtube-through-rss">}}), for the simplicity and ease of managing subscriptions without "the algorithm" deciding what I'm allowed to watch. This year, that hasn't really changed, although I have encountered some issues.

Probably the biggest issue is stability. For reasons I haven't been able to work out, sometimes the embedded player just doesn't appear in my RSS reader. 1 video loads fine, but the second is just blank, but appears fine after a page reload. It's not a major issue, but it really grinds my gears.

The second issue is mobile. Yes the embeds work on mobile, but the experience just isn't very nice. Fortunately I do almost no YouTube consumption on my phone, but it'd still be nice to have a more streamlined option.

As far as alternatives go, there are 2 main ones: [Piped](https://github.com/TeamPiped/) and [Invidious](https://github.com/iv-org/invidious). Invidious was so promising, but is a bit of a [mess](https://github.com/iv-org/invidious/issues/1438) when it comes to resource usage and "best practice". Which leaves Piped, which is definitely the front-runner. Piped is missing some fairly important features, especially [syncing played status between devices](https://github.com/TeamPiped/Piped/issues/371).

Piped is a project I'm following _very_ closely.

### Podcasts

[Pocketcasts](https://www.pocketcasts.com) is still where it's at for me. It has all the show feeds, all the player features, and exists everywhere I need it. I even paid the $11 per year for access to the web player, for the rare cases it's useful. I did take a look at [AntennaPod](https://antennapod.org/), and whilst the client is quite nice, the sync left a lot to be desired. [Gpodder](https://gpodder.net/), the backend it uses, just lacked any kind of syncing around a play queue, or how far played through an episode was to pick up on a different device. For me having that backup is an absolute must. It's a project I keep an eye on, and will probably give it another look sometimes soon, but in the meantime, I'm pretty happy with the albeit closed-source Pocketcasts.

Without my commute, my podcast usage has fallen well behind. Granted it has given me a reason to go out for regular walks, but the backlog is still rather deep. 2021 has definitely seen an increase to the number of longer drives I do, which helps.

2021 also saw me appear as a guest on my first podcast: [Episode 42 of the Self-Hosted Show](https://selfhosted.show/42), where I talk about my favourite self-hosted applications.

## Productivity

### Calendar

Unless an event is in my calendar, I'll almost certainly forget about it. Whether that's work meetings, social events or even birthdays. My calendar is one of the most stable tools I've ever had around, but last year I finally decided to change things. Whether that's for the better is something only time will tell.

For almost a decade, I've used Google Calendar for calendar hosting. I'm not proud of it, but it's work flawlessly for all that time. I looked into switching to [Nextcloud's calendar](https://apps.nextcloud.com/apps/calendar) when it came out, but it presented a rather scary message around not supporting certain recurrences, which stopped that investigation in its tracks.

In the last month or so though, I finally took the plunge and migrated my rather large `.ics` file of calendar events into Nextcloud calendar, and haven't looked back. With great android sync apps like [DAVx⁵](https://www.davx5.com/) (which is where I do most of my calendaring), I barely notice a difference. I'm still using the Google Calendar app, but that'll be next to fall...

### Todo

I quite often find myself balancing a number of different tasks at once, and having the memory I do, I'll often forget at least something very important. I've been saved countless times from forgetting important things by having simply written them down somewhere.

I'm still a fairly loyal [Todoist](https://todoist.com/) user. It's still not perfect, but in [June](https://twitter.com/RealOrangeOne/status/1403014453130584071) they gave me the feature I've been needing the most: Task descriptions! Finally, I can add a few extra notes or links to tasks without bloating the actual task name or resorting to comments.

My todo system is one of the last tools I don't self-host. I'm still actively on the look-out for potential tools, but nothing quite makes me want to switch from todoist. [Nextcloud tasks](https://apps.nextcloud.com/apps/tasks) does look quite interesting, but I don't want to spend the time switching unless it's actually going to be better.

### Editor

As a developer, I spent a lot of my life in a text editor of some kind. I, like it seems almost everyone else on the planet, use [VSCode](https://code.visualstudio.com/). Not because I necessarily like it, or think it's perfect, but because it's the _least bad_ editor out there.

I'm not a huge fan of electron applications, but VSCode is definitely a success story for it. It feels pretty good, but in some places it can still show when it comes to performance and resource usage (yes, I'm saying that having used [IntelliJ](https://www.jetbrains.com/idea/) in the past). VSCode's extension library however is second to none, and has something for almost anything I could need. It's a shame it's yet more javascript in the world, but I'll survive.

A lot of what I do involves the SSH and Docker [remote extensions](https://code.visualstudio.com/docs/remote/remote-overview), to connect to development VMs ([vagrant](https://www.vagrantup.com/)) and local docker environments. Whilst these work great, they are unfortunately both closed source and only work with the official VSCode distribution, rather than one compiled from the repository. This is also true for the [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) extension, which seems to work much better than [Jedi](https://pypi.org/project/jedi/) for Python intellisense.

Shortly before putting this post together, Jetbrains announced [Fleet](https://www.jetbrains.com/fleet/), their "next generation IDE". I can't tell if it's yet another electron-based editor, but by the looks of it, it might finally fix my biggest gripe with the Jetbrains suite: 1 editor per language. And if this editor is anything like as featured and powerful as intellij, it's going to give VSCode a run for its money! I didn't quite get to the beta in time, but I'm very interested in what comes of it.

### Notes

This year, how my notes are stored hasn't changed at all. I'm still loving the vendor-neutral "markdown files in directories" approach, as it completely avoids any kind of lock-in, makes backups much simpler, and means I can edit things however I like wherever I like.

As for the client, this one has changed. At the start of the year I was using [Qownnotes](https://www.qownnotes.org/), but since trying [Obsidian](https://obsidian.md/), I've made the switch. Obsidian is designed more for [roam-style](https://roamresearch.com/) writing, as that is its main selling point. But it also works perfectly well as a nice, simple, feature-rich markdown editor. Yes I'm aware I'm using it wrong, but I'm ok with that. I've also finally stepped up my mobile game. In 2021, Obsidian released a [mobile app](https://obsidian.md/mobile), which gives a nearly identical editing experience on mobile. Given I don't use most of Obsidian's features, it's sort of lost on me, but it's still a good notes editor.

Obsidian has a [sync service](https://obsidian.md/sync) for $10/mo, which acts both as a backup for your "vault" and allows syncing to mobile. My notes are already in Nextcloud, just where I like them, but I still need android sync. Whilst you't think it's what it's designed for, the Nextcloud app just cannot do this at all, for reasons unknown to science. Whilst ranting about this, I was introduced to [Foldersync](https://play.google.com/store/apps/details?id=dk.tacit.android.foldersync.lite&hl=en_US&gl=US) on android, which whist not quite perfect, does a great job at doing a 2-way sync of a directory to my phone. It used to occasionally miss updated, but since forcing it to perform a sync every few hours, in addition to when it detects changes, most of my content is there when I need it to be (mostly when shopping with dodgy internet).

### RSS

Basically everything in my life is consumed through RSS. YouTube, blogs, application updates, security notices. It makes me really happy to see that RSS is still going strong in 2021, and perhaps even growing!

Way back in the beginning of my RSS journey, I used [FreshRSS](https://www.freshrss.org/), but very quickly transitioned to [TT-RSS](https://tt-rss.org/). I never really liked the "single page" view of FreshRSS, and whilst TT-RSS's looks are definitely ageing, it's feature packed and works fantastically. I've tried a few times to use desktop clients, like [newsflash](https://gitlab.com/news-flash/news_flash_gtk), but never really switched. The web UI supports all the features I need, and is just a browser shortcut away.

Whilst we're on the topic of RSS feeds, if you're after one to subscribe to, [check out mine](/index.xml).

## Tools

### Password manager

Password managers are basically essential on the internet today.

Early last year, I said goodbye to [KeepassXC](https://keepassxc.org/) and hello to [Bitwarden](https://bitwarden.com/). The clients are nicer, the sync is cleaner, and the android experience is infinitely better. There are still some features I miss from KeepassXC, but the experience overall has been good so far.

I don't use the bitwarden.com hosted offering, instead going for [vaultwarden](https://github.com/dani-garcia/vaultwarden), a community-driven re-implementation of the server components in Rust. All the clients are 100% identical (meaning they're audited), but the data itself is stored entirely on my server.

The Bitwarden clients unfortunately suffer from similar issues to KeepassXC - whilst they're functional, they lack polish. In 2022, I'd love to see Bitwarden massively improve their UX, and focus on some quality-of-life improvements. Oh, and having [multiple accounts in 1 client](https://community.bitwarden.com/t/account-switching-log-in-with-multiple-bitwarden-user-accounts-client-profiles/).

I haven't quite convinced my family to join me on the Bitwarden bandwagon, but I'll wear them down soon enough...

### Storage

Whilst I may not like it, [Nextcloud](https://nextcloud.com/) is slowly becoming an integral part of everything self-hosted I do. Last year, I said I wanted to find something more "sane" than nextcloud. Instead, Nextcloud itself appears to have got its act together and become saner on its own.

Nextcloud has definitely had its issues. Previously around authentication, then around performance. Since then, the issues appear to be slowly resolving themselves. By removing the very slow and unnecessary to me [Dashboard](https://nextcloud.com/it/dashboard/) app, the initial load time gets faster, and whatever they're doing internally for performance is definitely making a difference. I removed a few others to disable the features I don't need, and whilst I'm not entirely sure if it has helped performance, it hasn't seemed to hurt it.

Running the [linuxserver.io](https://linuxserver.io) [nextcloud container](https://fleet.linuxserver.io/image?name=linuxserver/nextcloud), I wrote [a mod](https://github.com/RealOrangeOne/lsio-mod-more-processes) which adds extra processes to both nginx and php-fpm to massively improve performance, especially with multiple / intense users. There's also a "beta" `php8` tag which claims to improve performance even more. I've played around with it briefly, but didn't notice much of a difference initially. Hopefully once that's out, it'll help things. Given I already run Redis, MariaDB, and more processes, this might just be as fast as it can go.

### Git

A lot of what I do involves `git` - both professionally and personally. Whether that's programming, infrastructure management or even [writing this blog](https://github.com/realorangeone/theorangeone.net). Whilst most of my work lives on my [GitHub account](https://github.com/realorangeone/), I do like to [self-host](https://git.theorangeone.net) as much of it as I can.

I've switched between [Gitea](https://gitea.io) and [GitLab](https://about.gitlab.com) more times than I care to admit. Gitea is far more lightweight, doesn't hide features behind a paywall (I'm looking at you [pull mirroring](https://docs.gitlab.com/ee/user/project/repository/mirror/pull.html)), and is much simpler to set up. However, I could never quite get on with its UI (even through yes it's basically GitHub's). The [explore list](https://gitea.com/explore/repos) was always way too padded and never quite gave things the tree-like view I wanted. Yes, GitLab is heavier and has fewer features, but [its discover page](https://git.theorangeone.net/) is almost exactly what I'm after, and first party CI support is also a huge plus.

For a time, I even considered going all the way back to [cgit](https://git.zx2c4.com/cgit/about/) using [`gitea-cgit-adapter`](https://github.com/RealOrangeOne/gitea-cgit-adapter/) to update the repositories. I've always liked the simplicity of cgit, even if the UI is a little clunky. For years, I've considered writing a similar alternative, but never had the reason to start.

On the client side, I've started using [lazygit](https://github.com/jesseduffield/lazygit) a bit more. I know my way around the `git` command pretty well, but being able to things in a more visual way is much faster for lazy people like me. It's not quite as easy and fast as the `git` integration in VSCode, but in the cases I can't use it (mostly when using remote extensions), it works great!

## The future

2021 may not be the year of Linux on the desktop, but 2022 may well be the year Wayland gets a real uptake. 2021 has seen some great improvements, especially with pipewire. Whatever desktop environment I move to next, wayland support (or at least a migration path) is an absolute must. The constant screen tearing and display issues I have are getting real annoying real fast - although that could also just be my 660Ti.

I think the 2 main things I'm hoping to sort out in 2022 are finding a long-term solution to my YouTube consumption, and doing something about my desktop environment. If I can solve those 2, I'll be happy, but even then if I solve neither, I'm fairly content with the way things are.

Will any of the changes I've mentioned happen? Who knows. Will I change completely unrelated things I had no idea I even wanted to change? Absolutely!
