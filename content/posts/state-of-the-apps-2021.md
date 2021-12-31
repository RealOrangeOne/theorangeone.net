---
title: State of the Apps 2021
date: 2021-01-01
image: unsplash:uUBltZemj1E
tags: [linux, programming, self-hosting]
aliases:
    - /posts/my-stack-2020/
---

It's that time of the year again: time to look back at how I work, the tools I use, and how the next year might look. I've been working from home basically full time since the UK went into lockdown 17th March. It's been quite an adjustment barely leaving the house, and has brought with it a number of changes to my desk and tooling.

## Tools

So, still _borrowing_ the idea from [Cortex](https://www.relay.fm/cortex/109), here's how I get work done:

### OS

Back in 2019, I had to give up my beloved [Antergos](https://web.archive.org/web/20190809064653/https://antergos.com/blog/antergos-linux-project-ends) and transition to vanilla arch. In 2020, I'm still running vanilla arch, and don't really plan on changing. The fact everything exists exactly once in the package repositories makes installing software incredibly simple. It's been a long time since I've had a package compatibility issue cause me actual issues.

I briefly tried [Manjaro](https://manjaro.org/), but didn't quite get along with it. Mostly due to the non-standard way it handled kernel updates. It's a great OS, just not for me.

[EndeavourOS](https://endeavouros.com/) is picking up where Antergos left off, but providing even less for itself. It's simply an installer, and a few ancillary packages. Installing arch isn't simple, but if I wanted something more guided, that's probably how I'd do it.

### Desktop environment

I've been playing around with a couple desktop environments, namely KDE, Gnome and [Enlightenment](https://www.enlightenment.org/), and it's all making me realize quite how much I need tiling in my life. [i3](https://i3wm.org/) is still great at this, but it's just not a fully-featured desktop. Now that's not to say it's a bad thing, but I'm starting to lose interest in tinkering and composing lots of smaller applications to get something working. I'd much rather have something configurable, but which works well together out of the box.

[System76](https://system76.com/) have a [tiling extension for Gnome](https://github.com/pop-os/shell), but it's not quite the same. KDE also claims some tiling extensions, but I've not fully played around with them. Enlightenment is a lot to get your head around, but does work super nicely. I'm yet to find a nice way to version its configuration, or fully get my head around its window management.

I somehow doubt this time next year I'll be using the same environment setup I'm using now.

### Editors

I'm still a [VSCode](https://code.visualstudio.com/) user, and whilst I'm not the biggest fan of it, there really isn't anything better. Since I started working remotely due to the pandemic, I've become dependent on a single feature of VSCode: [Remote SSH](https://code.visualstudio.com/docs/remote/ssh). This allows me to use my primary desktop for most tools, but still do the actual development on my work-provided macbook pro. This way I can run all the electron applications and browser tabs I need to do my job, and still have enough room in the 8GB RAM in the macbook for an actual project without it being OOM killed, or sounding like a jet-engine.

On the terminal, it's still [vim](https://www.vim.org/). At some point I'd like to learn how to use more of the advanced features, but for now as an editor it works great. I'm still surrounded by people preaching Nano, but I can't quite get my head out of the muscle memory quite yet.

### Shell

A lot of my day is still spent in a shell of some kind, but in the last year very little has changed. I'm still a [ZSH](https://www.zsh.org/) user inside of [alacritty](https://github.com/alacritty/alacritty) with [tmux](https://github.com/tmux/tmux). I'm still having issues with the clipboard which requires [`tmux-yank`](https://github.com/tmux-plugins/tmux-yank), but it's good enough for now. Some day I'll get something reproducible to raise an issue about, but not yet.

### Browser

Firefox.

### Todo lists

Even though there's a lot less going on with this pandemic about, there's still a lot to juggle, and a lot to remember. If you're not using some kind of todo list or task manager, you really should be. They've saved me countless times in the past from forgetting important pieces of information.

I'm still using [todoist](https://todoist.com/) for my needs. It's not quite perfect, and I'm still **really** missing task descriptions, but for me it works great on all my devices, syncs perfectly and makes it incredibly simple to add tasks without much thought.

Last year, I mentioned trying out and switching to [Asana](https://asana.com/). The more I spend using todoist, the more I think it's fine as-is, and there's no need to mix things up and change.

### Password managers

It's 2020, if you're not using a password manager, you're using a computer wrong.

In 2020, I finally moved away from [Enpass](https://www.enpass.io/) back to my beloved [KeepassXC](https://keepassxc.org/). Enpass was great, and the simplicity of adding multiple entries to fields was great, but it started prompting me to register devices which was incredibly annoying. And no matter how much you [claim](https://www.enpass.io/security/) using SQLCipher is good enough for being open source, it's not.

The Keepass format has a lot of pretty good clients for all devices, and KeepassXC is definitely the best one for desktop. Android it's not quite the same story, with [Keepass2android](https://github.com/PhilippC/keepass2android) being definitely functional, but far from nice looking, and doesn't get updated often.

I've seen many people talking about how they really like [bitwarden](https://bitwarden.com/). I personally couldn't quite get on with the clients, but I might be looking into it more. Obviously I'd more be looking at hosting [`bitwarden_rs`](https://github.com/dani-garcia/bitwarden_rs) than the full-blown variant I suspect - Depends on how dockerizable it is. Bitwarden might be enough to convince my family to use password managers too.

### VPN

The primary reasons I had a VPN was for untrusted networks and downloading **Linux ISOs**. Given I've spent the majority of this year at home, the former hasn't come up very often.

I'm currently still using my previous [PIA](https://www.privateinternetaccess.com/) subscription, and the drama with the buyout has definitely gone down, but it's still there in the background. I think once the subscription runs out I'll be switching back to [mullvad](https://mullvad.net/en/) indefinitely. Their clients are pretty good, entirely open source, and the fact you can just download the WireGuard configuration direct is also handy for when I can't be bothered to mess with clients.

### Email

[Fastmail]({{<referralurl fastmail>}}) is one of the companies I've been using the longest. No they're not encrypted at rest, yes they're in a five-eyes country, but as a service they're amazing, and besides a small blip this year they've been rock solid. [Protonmail](https://protonmail.com/) is nice, and is something I want to use and support, but it's just so damn expensive if you use multiple aliases!

I've been tempted to try spinning up my own email server, but email is still pretty important in 2020, that downtime isn't acceptable. If you are thinking about doing this, i'd highly recommend [mailcow](https://mailcow.email/).

As for email clients, i'm still a big fan of [Thunderbird](https://www.thunderbird.net/en-GB/). Since being revived recently it's really gaining momentum around updates and improvements. It's basically at a point now where i'd be recommending it to people who wanted a free outlook alternative, technical or otherwise.

### RSS

It seems i'm far from the only one who is enjoying RSS in 2020. RSS is far from a dead technology used only by geeks. I use it for all manner of things, from YouTube to software updates, from blogs to newsletters.

[TT-RSS](https://tt-rss.org/) has been a rock solid reader for me, and I have no intention of changing. It's pulling in loads of feeds, working great, and the UI whilst not the best is incredibly functional. For desktop client, i'm starting to use [newsflash](https://gitlab.com/news-flash/news_flash_gtk) more and more, which integrates with tt-rss nicely with the [fever extension](https://github.com/DigitalDJ/tinytinyrss-fever-plugin). It doesn't quite do YouTube videos in the same way though, which is on my list to try and fix at some point.

Whilst you're thinking of RSS feeds, [here's mine](/index.xml).

### Music

Weirdly in 2020 I've been listening to less music than before, perhaps because there's no office to drown out. Apparently many people I know have reduced their listening this year.

I'm still a happy [Spotify](https://www.spotify.com/) user, and there is no way i'm moving any time soon. Spotify is just great, it works everywhere and I've got quite a few [playlists]({{< relref "music" >}}) setup depending on mood.

Here's how my 2020 went out: https://open.spotify.com/playlist/37i9dQZF1EM87XHY3tdJGp

### Storage

My file storage has grown quite a lot since this time last year, mostly because I finally moved a load of data off the HDD in my desktop onto my server. I went from about 10GB up to over 200GB (nothing [r/datahoarder](https://www.reddit.com/r/DataHoarder/) level, but it's something).

Currently everything lives in [nextcloud](https://nextcloud.com/), but i'm growing less and less happy with it. For the machine it's on, it's not especially quick, and having it log me out on some machines every few days is getting really annoying. I'm hoping that my [server upgrades]({{< relref "server-2020" >}}) and [desktop environment research](#desktop-environment) changes this, but it's hard to track down what the issue is.

[Filebrowser](https://filebrowser.org/) has been something I've been meaning to look at for a while, for a much simpler interface to my files. Unfortunately it doesn't solve the syncing issue, which might require [syncthing](https://syncthing.net/). I'm hoping to do all my migrations, properly look into the issues, and see if I can make any sense out of these issues.

### Podcasts

2019 was quite a year for me in podcasts, I discovered quite a lot of favourites. 2020 has unfortunately seen a massive decline in my podcast consumption. Without an hour or so commute each day, there's little time I get to enjoy a podcast. The occasional driving I do gets some played, and certain shows I just have to listen to as soon as they come out, but besides that it's low. I'm hoping to find other activities I can do whilst listening to drive the backlog down.

As for clients, last year I spoke of looking back into [castbox](https://castbox.fm/), but i've not. [Pocketcasts](https://www.pocketcasts.com/) is pretty nice and works great. I think if I were going to move it'd be to [AntennaPod](https://antennapod.org/) as it's open-source, but the backlog of shows exists only in pocketcasts, and migrating that may be quite a pain!

### Notes

Looking back on last year, I have no idea how I survived with notes as they were.

In the last year, [Turtl](https://turtlapp.com/) hasn't seen much activity, so i'm glad I switched away from it. In its place, i'm using [carnet](https://apps.nextcloud.com/apps/carnet) and nextcloud, which whilst a little clunky has quite a feature set and works great on mobile. That's my replacement for simple notes and quick lists of things I need to do (mostly shopping).

2020 has seen me pick up quite a lot of blog post writing - I've written more this year than I have in all previous! At the start of the year I switched between applications for writing. I started mixing between [nextcloud text editor](https://github.com/nextcloud/files_texteditor/), VSCode, [ghostwriter](https://github.com/wereturtle/ghostwriter/), but eventually settled on consistency with [QOwnnotes](https://www.qownnotes.org/) and [Nextcloud notes](https://apps.nextcloud.com/apps/notes). Qownnotes is a great desktop app for writing notes, and it shows directories of notes properly. Ghostwriter is a far nicer writing environment, but I flick between notes and posts quite a lot sometimes, and it's nice to see and edit all my notes in 1 place.

## What will 2021 bring?

2021 is going to be an equally strange year compared to 2020. How much longer i'll be working from home for, I don't know. Will I get my commute back? Will I finally leave i3? Who knows!

I'm expecting next year to bring 2 main changes:

- Leaving i3 to a more fully-featured desktop environment
- Making my storage interface more sane and performant

Will they actually happen though? No idea!
