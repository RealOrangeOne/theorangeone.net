---
title: State of the Apps 2020
date: 2020-01-01
aliases:
    - /stack/
    - /sota/
    - /posts/my-stack-2019/
---

This year marks the 3rd year of my pattern for publishing a "My Stack" post, noting down how I get work done both professionally and personally ([2018]({{< relref "my-stack-2018" >}}) / [2017]({{< relref "my-stack-2017" >}})). This year, I'm ~~stealing~~ borrowing inspiration from [CGP Grey](https://www.cgpgrey.com/) / [Cortex](https://www.relay.fm/cortex/) and their ["State of the Apps"](https://www.cgpgrey.com/blog/state-of-the-apps-2014/) episodes, and also talking about productivity, and the other services I use to get things done.

## OS

For the last couple years, I've been an avid [Antergos](https://web.archive.org/web/20190903082315/https://antergos.com/) user, but May of this year saw [the project end](https://web.archive.org/web/20190809064653/https://antergos.com/blog/antergos-linux-project-ends), forcing me to move. With all my [dotfiles]({{< relref "dotfiles" >}}) configured for an arch-based base, I had little choice other than moving to Arch. [Manjaro](https://manjaro.org/) also looked promising, but I'd wanted to move to Vanilla [Arch](https://www.archlinux.org/) for a while, so this felt like as good of a time as any.

7 months later, I've only hard migrated three machines, the rest still run Antergos, and they still run fine. The Antergos repos don't exist any more, but Antergos was really just an installer for vanilla arch with an extra repo, so the fact everything still _just works_ doesn't surprise me.


## Desktop Environment

I'm still an i3 user. I recently [tried using macOS]({{< relref "macos-review" >}}), and the lack of a strict tiling window manager got on my nerves very quickly. There are still some things which get on my nerves, and Gnome is looking quite nice right about now, but then muscle memory around tiling is just too strong. [Material Shell](https://github.com/PapyElGringo/material-shell) just looks far too strange, and [i3-gnome](https://github.com/i3-gnome/i3-gnome/) isn't quite gnome enough.

## Editors

My editor situation also hasn't changed much in the last year. I still use [VSCode](https://code.visualstudio.com/), although the config has been slightly thinned out so remove extensions I don't use. I recently tried switching back to [IntelliJ](https://www.jetbrains.com/idea/), for the far superior intellisense, but it just didn't feel right, and felt incredibly heavy, not to mention the lack of automatable configuration.

Last year I used [GhostWriter](https://github.com/wereturtle/ghostwriter/) for my markdown editing, but recently I transitioned that into VSCode, so I don't need to remember two sets of keyboard shortcuts. The fancy WYSIWIG formatting from GhostWriter wasn't a benefit to me, but it's still my recommended markdown editor.

[Vim](https://www.vim.org/) is still my terminal editor of choice, but I am looking for something simpler. Some friends often preach [Nano](https://www.nano-editor.org/), which can apparently do many of the editing features Vim has, but the muscle memory is quite hard to get rid of. My [dotfiles]({{< relref "dotfiles" >}}) currently sync a custom Vim configuration, which much like my VSCode configuration, I've also thinned out, but I think there's more thinning to do.

## Shell

Naturally, I do spend much of my time in the shell. I still use [ZSH](https://www.zsh.org/), [Alacritty](https://github.com/jwilm/alacritty/) and [Tmux](https://github.com/tmux/tmux), and it fulfils everything I want to do. my only gripe is that clipboard management is pretty weird, somewhere.

Copying multi-line text from the terminal into the system clipboard just doesn't work, and I've not been able to work out why. My current solution is [`tmux-yank`](https://github.com/tmux-plugins/tmux-yank), but that changes the mechanism to copy to the clipboard, which takes a lot to remember. Some day I'll work out what the issue is and fix things, I hope. But for now, this is fine.

## Browser

As last year, [Firefox](https://www.mozilla.org/en-GB/firefox).

Previously, I've used [Chromium](https://www.chromium.org/Home) for development, to keep an isolation between development tooling and actual browsing. This year, I migrated this to [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/), and it's great! The dev tools take a little to get used to coming from the Chromium ones, but besides that they're pretty powerful! My workflow is now 100% Firefox too, which is nice!

## SSH

I spend a large amount of my life shelling into various machines, whether it be machines on my network, my home server, or various VPS instances. I don't use [Mosh](https://mosh.org/), as I'm generally on a reliable connection, but I do have a large, complex SSH config to manage. For this, I use [`assh`](https://github.com/moul/assh), a tool I wish more people knew about. In short, it converts YAML configuration into the native SSH configuration, and enables support for things like extending other configuration, nicer gateways, templating, and various other things.

## Todo Lists

I have a lovely habit of forgetting really important things I need to do, hence rely quite heavily on todo lists and calendars to limit it.

I started with [todoist](https://todoist.com/), and it works pretty well for me. I've looked into other tools, such as [Remember the Milk](https://www.rememberthemilk.com/), [TickTick](https://www.ticktick.com/) and [TaskWarrior](https://taskwarrior.org/), but nothing felt ideal to me. Todoist has a great UI, it's cross-platform, and has a nice API (I'm looking at you, TickTick!).

The [Quick-Add](https://get.todoist.help/hc/en-us/articles/115001745265) feature is something I also find pretty useful to quickly add tasks without faffing around. I wrote a [small wrapper](https://github.com/RealOrangeOne/rofi-todoist) around it, although I don't actually use it...

[Asana](https://asana.com/) is something I've been tempted by, for its customizability and power, but it feels a little too bulky to me. Definitely something I'll be spending some more time looking at in 2020.

## Password Manager

Password management is something I feel quite strongly about. Really, everyone should have and use a password manager, if they do anything valuable online. No matter what people think, everyone has important information online they don't want everyone seeing.

<div style="max-width:854px; margin: 0 auto"><div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://embed.ted.com/talks/glenn_greenwald_why_privacy_matters" width="854" height="480" style="position:absolute;left:0;top:0;width:100%;height:100%" frameborder="0" scrolling="no" allowfullscreen></iframe></div></div>

Currently, I use [Enpass](https://www.enpass.io/). Enpass has a crazy amount of features, and can be synced between devices using my Nextcloud server. Enpass isn't open-source, which annoys me, but really it's the best there is. The only real feature keeping me is the versatility of entries. Entries are really just a list of fields. Each field can have various different types, be private, or contain files, email addresses or TOTP tokens. [KDBX](https://keepass.info/help/kb/kdbx_4.html), the format behind [KeePass](https://keepass.info/) doesn't support this in quite the same way. You can add random other entries, but it's not the same. The day this is added to KeePass, I'm switching, immediately.

## VPN

If you frequent public Wi-Fi, you need a VPN. I don't think VPNs are necessary for everyday use (even though my phone is always connected to one), but if you're on a public or untrusted network, you definitely need one.

Probably the most famous is [NordVPN](https://nordvpn.com/), simply because of the amount of advertising they do. I don't trust them very much.

My current VPN of choice is [Private Internet Access](https://www.privateinternetaccess.com/) (PIA). They have pretty good clients, lots of servers, and a SOCKS5 proxy, which is often handy. PIA was recently bought out, and [reddit](https://www.reddit.com/r/Piracy/comments/dyqdno/private_internet_access_bought_out_by_cyber_ghost/) wasn't too happy about this. Since that they've open-sourced their desktop client, and have committed to improving transparency. I'm personally a large fan of [Mullvad](https://mullvad.net/en/), and they're definitely a close second, but for now, I think I'm sticking with PIA.

## Email

I've been a pretty loyal [Fastmail](https://ref.fm/u19842056) user for a couple of years now. It's not encrypted at rest like [ProtonMail](https://protonmail.com/), but they claim very high levels of privacy, and the feature list is incredible!

As a client, I still quite like [Thunderbird](https://www.thunderbird.net/). I tried [Mailspring](https://getmailspring.com/), [Evolution](https://wiki.gnome.org/Apps/Evolution/), and just the web UI, but Thunderbird is really nice in terms of features and performance, and the calendar integration is really handy. Since Mozilla stopped supporting it, the community has picked it back up, and there's now full-time work being done on it, and it's improving quite a lot. But there's still quite a long way to go before it's really ready to start recommending to people.

## RSS

For the last two or so years now, I've been a heavy RSS user. I've fully replaced YouTube subscriptions with it, because the subscription management is famously rubbish.

As an aggregator, I use [tt-rss](https://tt-rss.org/). [Last year]({{< relref "my-stack-2018" >}}) I said the UI was hard to get to grips with, but after spending more and more time with [FreshRSS](https://www.freshrss.org/), their UI got on my nerves even more.

As I use RSS more and more, I'm starting to notice a potential for RSS to be bought up to date a bit. The urge to write an RSS aggregator is rising quite fast.

## Music

Whilst working, I listen to a *lot* of music. I, like the rest of the sane world, use [Spotify](https://www.spotify.com/). Cross-platform, huge library, so [many playlists]({{< relref "music" >}}), great student discount, what's not to love!

## Storage

Most file storage lives on my server, through [Nextcloud](https://nextcloud.com/). As every thread on [/r/selfhosted](https://reddit.com/r/selfhosted/) agrees, there's nothing better. Nextcloud works on all platforms, is reasonably simple to set up, and has apps/plugins to support basically everything.

For the sake of simplicity and performance, I don't install that many plugins for extra features. No calendar, chat, contacts, notes, or anything like that. Nextcloud deals with nothing but storage for me. Anything else is probably better handled by a bespoke application, anyway.

## Podcasts

This year, my podcast intake has only increased, rather massively actually - My backlog is growing faster than I can listen. I really only listen on drives to the office, to make straight roads far more interesting.

I'm still a [Pocketcasts](https://www.pocketcasts.com/) user, but recent updates are really ruining the previously polished experience, so much so I'm kinda tempted to give [castbox](https://castbox.fm/) a try again.

## Notes

This is a category I'm in desperate need of improving. I currently use [Turtl](https://turtlapp.com/), which is a nice, self-hosted, encrypted notes app, but it's not very active, and the interface is a bit clunky, but as features go, it's perfect!

Most of the note apps seem to be designed for larger notes, rather than tiny bits of text / lists, but it seems that's a niche. I think Turtl may be here to stay, but I'm still on the lookout.
