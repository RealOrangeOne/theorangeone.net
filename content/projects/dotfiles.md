---
title: My Dotfiles
repo: RealOrangeOne/dotfiles
tags: [arch, linux]
---

[Dotfiles](https://wiki.archlinux.org/index.php/Dotfiles) are a way for people to store settings and preferences to make setting up a new computer that much easier. I use both my laptop, desktop and work machine almost every day, and want them to be setup in an almost identical way.

Most people store their dotfiles in version control. This is a great solution as it's possible to add authentication before accessing them, and stores a complete version history.

## My Dotfiles
[My Dotfiles](https://github.com/RealOrangeOne/dotfiles) are built using [puppet](https://puppet.com/), which is designed to allow fast setup of servers from declarative configuration. This is fairly overkill for what I'm using it for, but it works really nicely, and supports everything I could possibly need.

I synchronise these files with git, and publish them [on GitHub](https://github.com/RealOrangeOne/dotfiles). 

### Private data
Things like SSH config and private environment variables can't go onto GitHub, for obvious reasons. For this, I use my [nextcloud](https://nextcloud.com/) server to sync a private directory to my machines, and depend on those files in the puppet config.
