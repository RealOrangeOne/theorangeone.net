---
title: My Dotfiles
repo: RealOrangeOne/dotfiles
tags: [arch, linux]
---

[Dotfiles](https://wiki.archlinux.org/index.php/Dotfiles) are a way for people to store settings and preferences to make setting up a new computer that much easier. I use both my laptop, desktop and work machine almost every day, and want them to be setup in an almost identical way.

Most people store their dotfiles in version control. This is a great solution as it's possible to add authentication before accessing them, and stores a complete version history. It also means they're public

## _My_ Dotfiles
[My Dotfiles](https://github.com/RealOrangeOne/dotfiles) are built using [Ansible](https://www.ansible.com/). Ansible is an open-source configuration management tool designed to help administer many servers with a single configuration. As people started using Ansible for configuration of the local machine (as I am), Ansible made some optimisations so commands run better locally.

I synchronise these files with git, and publish them [on GitHub](https://github.com/RealOrangeOne/dotfiles).

### Previous iterations

Previously, my dotfiles used  puppet](https://puppet.com/), which is fairly overkill for what I'm using it for, and was incredibly complicated compared to Ansible. Ansible bought with it many other benefits:

- Simpler configuration. YAML vs Puppet
- Wider variety of 1st party modules
- Easier to pin dependencies, as it's installed through `pip`
- Much nicer templating. Jinja2 vs ERB
- Much simpler support for running commands multiple times with [`with_items`](https://docs.ansible.com/ansible/2.5/plugins/lookup/items.html)
- Dry-run support, for validation on a CI

### Private data
Things like SSH config and private environment variables can't go onto GitHub, for obvious reasons. For this, I use my [nextcloud](https://nextcloud.com/) server to sync a private directory to my machines, and depend on those files in the config.
