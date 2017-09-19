---
title: My Dotfiles
repo: RealOrangeOne/dotfiles
tags: [arch, linux]
---

### What are dotfiles?
Dotfiles are a way for people to store settings and preferences to make setting up a new computer that much easier. I use both my laptop, desktop and work machine almost every day, and want them to be setup in an almost identical way.

Most people I've seen store their dotfiles on GitHub. This is a great solution as it's possible to add authentication before accessing them, and stores a complete version history. This solution doesn't really work for me, having to run `git pull` is just too much effort to update files!

## How I did it
I used my nextcloud server to sync all my dotfiles between my devices, and then used symlinks to split out some of the files into the right locations. This means that changes can be updated live between machines

This worked brilliantly, config files were automatically synced as soon as I made a change, just as soon as they connected to a network.

After I got this all setup, I started committing the files to my GitHub too, so they could be publicly accessibly. I had to use the `.gitignore` to stop some parts being public like SSH config, but the rest is completely open!

### Atom
The main problem was with atom packages, I had to manually store what packages were installed, then manually install them on the other machine from the saved file. This was made easier by `apm` allowing me to list them and automatically save it to a file, but it wasn't perfect.

Eventually, after looking into possible solutions, I came across the [`Sync settings`](https://atom.io/packages/sync-settings) package, which was the answer to my prayers! It saved all my config data for atom into [a gist](https://gist.github.com/RealOrangeOne/9f9a4dd799ad01aa0502a09f06cbf454/), which I could then backup and restore too from within the application. It also warned me when my local data was out of date from the remote, and prompt me to download the updated data.
