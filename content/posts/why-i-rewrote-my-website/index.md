---
title: Why I rewrote my website
date: 2017-11-13
image: resource:new-site-screenshot.png
tags: [programming, website]
---

I've had a website for around four years now, starting with a python CGI-based site hosted at [1&1](https://www.1and1.co.uk/), and evolving into its current form, powered by [Hugo](https://gohugo.io/).

Although I'm a web developer, I'm very far from a designer. I really can't design anything!

## Alternatives
In the past, I've used services like [StartBootstrap](https://startbootstrap.com/) and [HTML5UP](https://html5up.net/). These allow me to just throw together a site, and not really worry how it looks, because the design is done for me. However, slight modifications I need to make to the theme, end up spiralling out of control and wrecking things.

## Solution
After deciding to do yet another redesign, I had an epiphany. Rather than using a fancy, modern-looking design, let's use something simple! The Hugo theme [_Vec_](https://themes.gohugo.io/hugo-theme-vec/) looked _almost_ perfect. I used _Vec_ as a base for a complete redesign of my site. Rather than actually using _Vec_, I used Bootstrap to replicate it closely, with a few optimizations of my own.

Making the design this simple means there's very little to go wrong. If the whole site looks so simple, it's very hard for it to look quite so bad.

## Implementation
I implemented it in just over two weeks, in a [single PR](https://github.com/RealOrangeOne/theorangeone.net/pull/1). In this refactor, I also fixed many things I didn't like about my sites build process. I even installed a [compressor](https://github.com/gschier/speedpack) for deployment.

Overall I'm really happy how the rewrite looks, It's far nicer and more original than my previous sites. Now, to push it live!
