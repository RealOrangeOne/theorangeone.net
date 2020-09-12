---
title: VSCode Grammar Checks
subtitle: Improving grammar when writing in VSCode
date: 2020-05-31
image: unsplash:1UDjq8s8cy0
---

I write quite a lot. Whether it be coursework, blog posts, or any other random thing. Most of my time is spent in either VSCode or QOwnNotes, neither of which have any kind of spelling and grammar checking. It's rare I'll actually go back over something and fully check its grammar, unless there's a very obvious issue or typo. What I really want is something automated to do it for me.

## Spelling Check

To check spelling, I use [`code-spell-checker`](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker). It runs really quickly and works for both regular text and source code files, which makes spotting typos in code much easier. It's not perfect, and there are words it doesn't understand but really should, but it's good enough for me!

## Grammar check

Grammar checking was the one I've added most recently, and realized the grammar in some of my posts is shockingly bad!

The tool I settled on was `languagetool`, which closely resembles [Grammarly](https://www.grammarly.com/). It does do some built in spell checking, but it's not quite good enough to replace `code-spell-checker`. `languagetool`is designed to run as a service, either using the public hosted one, or running it yourself. I'd intended to just run it myself on a server, but that would require internet access which isn't ideal.

The [`languagetool` extension for VSCode](https://github.com/davidlday/vscode-languagetool-linter) has an additional option called "managed", where it will start up the server locally on your machine as and when you need it, so long as it's installed. With `languagetool` in the [arch repos](https://www.archlinux.org/packages/community/any/languagetool/), that was a no-brainer deal, even if was a bit of a pain to set up. [Here's](https://github.com/RealOrangeOne/dotfiles/commit/50c248b71955bc5f2fb8f76d0df912f73126bef9) my installation in case it's useful to someone.

## Summary

Once installed, I went over all the pages and applied the relevant fixes. Judging by the [diff](https://github.com/RealOrangeOne/theorangeone.net/commit/8877a183e6047138b5cba1d532288bfc978b1bc8), there were a lot. Looking back at some of them, I really can't write!

But now they're installed, it definitely feels a lot nicer knowing it'll catching things, so I don't deploy embarrassing mistakes. At least not in grammar...
