---
title: My Stack - 2018 Edition
date: 2018-12-31
image: resource:editing-my-stack.png
hide_header_image: true
---

Last year, I wrote [_My stack 2017_]({{< relref "posts/my-stack-2017" >}}), and now it's time for a follow-up. A year is a long time, and my day-to-day stack has changed quite a bit since then.

# OS

I'm still an [Antergos](https://antergos.com/) user, and have no sign of changing. I've had a few instabilities, but the [AUR](https://aur.archlinux.org/) and [Arch Wiki](https://wiki.archlinux.org/) are just fantastic!

## Desktop

As with last year, I'm still loving [i3](https://i3wm.org/), I can't live without a tiled window manager now. For stability, and because I don't like random unicode characters on my bar, I've switched from [`i3status-rs`](https://github.com/greshake/i3status-rust) and [`i3status`](https://github.com/i3/i3status) to [polybar](https://polybar.github.io/), which looks so much nicer!

My favourite addition of the year is [Flameshot](https://github.com/lupoDharkael/flameshot), a screenshot tool which allows selection, basic editing, and uploading.

{{< figure src="https://raw.githubusercontent.com/lupoDharkael/flameshot/master/img/preview/animatedUsage.gif" >}}
Flameshot in action
{{< /figure >}}

# Editors
## Code
My primarily editor is now [VSCode](https://code.visualstudio.com/), because it's faster and lighter-weight than IntelliJ. All the features I need from a large editor, but doesn't take 10 minutes to load! Because VSCode stores its configuration in plain files, in a very simple way, it's easy to sync it between machines, [which I do](https://github.com/RealOrangeOne/dotfiles/blob/master/tasks/vscode.yml).

## Markdown
Last year, I was a fan of [Caret](https://caret.io/), and was eagerly awaiting version 4, which was in beta last year. one year on, and still no closer to seeing anything. It's for that reason I've switched back to [GhostWriter](https://github.com/wereturtle/ghostwriter/). Also because free and open source is great!

## Quick files edits
Nothing beats [Vim](http://www.vim.org/) for anything like this. I've switched my default editor for git commit messages, and have it installed on all my servers. I'm still unfamiliar with many of the advanced keyboard shortcuts, but I can navigate around a file just well enough for me.

{{< resource src="editing-my-stack.png" >}}
Editing my stack, in VSCode
{{< /resource >}}

# Shell
My shell prompt is almost identical to last year. If it ain't broke, don't fix it! I've got plenty of aliases setup to make complex tasks easier, and the prompt looking just how I like it!

# Terminal Emulator
My terminal environment has probably been one of the largest changes in the last 12 months. Previously, I was using [Terminator](https://gnometerminator.blogspot.co.uk/p/introduction.html). In the last year, I've moved from Terminator, to [Tilix](https://gnunn1.github.io/tilix-web/), and finally settled on [Alacritty](https://github.com/jwilm/alacritty), with [Tmux](https://github.com/tmux/tmux). Alacritty is fast, lightweight, and GPU-accelerated. Thanks to Tmux, I can keep the tiled experience in my terminal too. After a colleague started experimenting with Tmux, I gave it a shot, and it's great. My config is modified, like changing the prefix to `C-t`, and to make sure things still work as I'm used to.

{{< resource src="terminal.png" >}}
My shell prompt
{{< /resource >}}

# Browser
[Firefox](https://www.mozilla.org/en-GB/firefox/new/), end of.

# Password Manager
Not much has changed here. I'm still using [KeePassXC](https://keepassxc.org/), and it's still great. The [InputStick](http://inputstick.com/) extension is incredible for authenticating with unknown devices. The UI however is stagnating a little for me, and the integrations are buggy at the best of times. I'm looking at [Enpass](https://www.enpass.io/) again with eager eyes, because the integration quality looks incredible. Whether I can live without the InputStick integration and open-source nature of KeePassXC will require some research and testing!

# VPN
This time last year, I'd just left Astrill for ProtonVPN. In my opinion, this was a mistake. ProtonVPN worked pretty well, and was a step up from Astrill, especially on Android. Last week, I switched to Mullvad, and it's incredible! Mullvad has open-source clients and integrations for all platforms, and supports [WireGuard](https://www.wireguard.com/). I'd be surprised if I can find a reason to switch!

The desktop client for Mullvad whilst functional, isn't great. I recently found [`qomui`](https://github.com/corrad1nho/qomui), which integrates really well with Mullvad.

# Email

After realising that the benefits of [Mailfence](https://mailfence.com/) weren't useful to me, as there's no way I'm uploading a private key, I switched. [FastMail](https://www.fastmail.com/) has all the features I could ever need, and a great UI.

## Email Client
My email client has stayed the same. There really is nothing close to [Thunderbird](https://www.thunderbird.net/en-GB/) on Linux! Mailspring does look nice, but it's still not quite feature-complete for my needs. And the fact Thunderbird is also a calendar app is quite useful too!

# RSS
It might seem outdated, but I still quite like RSS. For me, it acts as a nice way to read content from various sources, all in one place. I can also use it to watch YouTube videos, without having to deal with YouTube itself! [FreshRSS](https://www.freshrss.org/) is my aggregator of choice, with [FeedReader](https://jangernert.github.io/FeedReader/) as the desktop client. I tried [Tiny Tiny RSS](https://tt-rss.org/), but the UI didn't work for me.

# Mobile Podcast Player

In the last year, I've got majorly into podcasts. It's making my drive to work so much more interesting! [Castbox](https://castbox.fm/) was my player of choice in the past, but in the last few months I shelled out for [Pocket Casts](https://www.pocketcasts.com/). It's a more polished experience, and it doesn't screw with the bluetooth connection in my car quite as much!

# Dotfiles

This year, I transitioned [my dotfiles](https://github.com/realorangeone/dotfiles) from [Puppet](https://puppet.com/products/open-source-projects), to [Ansible](https://docs.ansible.com/ansible/latest/index.html). Puppet worked well, but the configuration I had was quite a hack. Ansible has an easier configuration, and integration with more tools. The configuration now syncs far more than the Puppet equivalent ever did, which is great for creating reproducible machines. Unfortunately, Ansible is a fair amount slower, especially when detecting installed packages.
