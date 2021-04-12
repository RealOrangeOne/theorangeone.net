---
title: Consuming YouTube through RSS
subtitle: Reclaim control of your subscriptions
date: 2021-04-12
image: unsplash:VLzAkbs5afg
tags: [privacy]
---

[YouTube](https://www.youtube.com/) is the largest video hosting platform on the planet, serving well over 1 billion videos a day to its over 30 million daily active users. People have had [issues](https://www.guidingtech.com/fix-youtube-subscriptions-not-working/) with YouTube's subscription service for years, and for a service so large and so widely used it seems crazy that one of its fundamental features is so complex and illogical.

## What's wrong with subscriptions

YouTube's subscriptions aren't quite as straightforward as it may seem. On the surface, there are 2 buttons:

- "Subscribe", which adds a channels videos to the "Subscriptions" feed
- "Bell", which sends you notifications when a channel uploads a new video

This separation is great, if it worked. The problem comes from the "Subscriptions" feed itself. It's very common to not only find channels you've not subscribed to appearing there, but even channels you have subscribed to are nowhere to be seen. It shouldn't be up to YouTube to decide what content I see, it should be mine, and should "just work". Whether it be extra YouTube magic on top or not, subscriptions should be subscriptions - it's not hard. And let's not even get started about the [opaqueness of the recommendations](https://www.youtube.com/watch?v=BSpAWkQLlgM).

There is however a solution to these subscription woes, to take back control of your subscriptions, and it's straight out of 1999: RSS.

## What is RSS?

If you've been living under a rock, or your birth year starts "20", [RSS](https://en.wikipedia.org/wiki/RSS) is a text-based feed format services can produce to be consumed by applications to access updates to content in a platform-agnostic format. The intention of RSS is to let you keep track of changes how you want to, and all from 1 place, rather than having to check every site and every source you're interested in.

Whilst you may have never heard of RSS, chances are you're already using it: Almost all podcasts use RSS to distribute episodes to listeners. Many of the sites you use may already emit RSS feeds ready for you to consume, without you even knowing, like:

[GitHub](https://www.ronaldsvilcins.com/2020/03/26/rss-feeds-for-your-github-releases-tags-and-activity/), [BBC](http://feeds.bbci.co.uk/news/england/london/rss.xml), [Reddit](https://www.reddit.com/wiki/rss), [Google Groups](https://daniele.tech/2014/06/google-groups-in-rss-feed/), [Ghost](https://ghost.org/integrations/custom-rss/), [Blogger](https://oscarmini.com/discover-rss-feed-address-of-a-blogger-blogs/), [Arch Linux](https://archlinux.org/feeds/), [Backblaze](https://www.backblaze.com/blog/feed/), [Cloudflare](https://blog.cloudflare.com/rss/), [DigitalOcean](https://www.backblaze.com/blog/feed/), [Arstechnica](https://arstechnica.com/rss-feeds/), [TheOrangeOne](/index.xml), [xkcd](https://xkcd.com/rss.xml), [PyPI](https://pypi.org/rss/packages.xml), [HaveIBeenPwned](https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches), [WordPress](https://wordpress.com/support/feeds/), [Hugo](https://gohugo.io/templates/rss/), [Bitwarden](https://bitwarden.com/blog/feed.xml)... And of course, YouTube.

## RSS Readers

Before you can take full advantage of RSS, you need a reader to aggregate the feeds together, and give you the single source to read all your subscribed feeds and track which ones you've read. Because RSS is an open standard in a reasonably simple format, readers are pretty simple to find. If you're planning on reading on multiple devices, you'll need one with a central server to do the collection. If you're just adding feeds to an app on your phone, then you won't be able to read anywhere else. I personally run my own instance of [TT-RSS](https://tt-rss.org/), but [FreshRSS](https://www.freshrss.org/) is also a pretty good application. If you don't want to host one yourself, [Feedly](https://www.feedly.com/) and [Flipboard](https://flipboard.com/) are also great services.

## Using YouTube through RSS

Now you've got your reader, it's time to get the actual feeds. YouTube natively emits RSS feeds, but unfortunately they're not very well documented. There used to be handy download buttons, but in subsequent redesigns of the UI, they've been removed. Fortunately for us, the URLs aren't difficult to work out.

For this example, I'm going to use [Level1Linux](https://www.youtube.com/channel/UCOWcZ6Wicl-1N34H0zZe38w). You can get the feed URL in a few different ways:

Option 1, is looking at the HTML source for that page. In there will be a tag looking like:

```html
<link rel="alternate" type="application/rss+xml" title="RSS" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCOWcZ6Wicl-1N34H0zZe38w">
```

And there, in the `href` attribute, is the RSS feed URL. Subscribe to that in your reader of choice, and you're all set.

Option 2 is a bit faster. The eagle-eyed of you will have seen that the `channel_id` parameter is the same as the id in the channel URL. Therefore, you can just substitute one for the other, and get the feed URL. This falls over if the channel URL doesn't contain the channel id, like [this](https://www.youtube.com/c/TekLinux/), as "TekLinux" isn't a channel id. If you've got that kind of URL, do option 1.

The subscription unfortunately doesn't contain an embed, just a link to the YouTube video page itself, but for watching videos that's absolutely fine. TT-RSS has a helpful built-in plugin (`af_youtube_embed`) which embeds the YouTube player into the viewer, which means I don't even need to leave TT-RSS.

## Downsides

Subscriptions are now entirely in your control. Only the channels you subscribe to appear in your feed, and all of their videos will appear. Unfortunately, it's still not quite perfect.

The first issue is from a privacy perspective. You're still streaming video from YouTube's servers, on YouTube's site. Even `af_youtube_embed` uses an authenticated embed. YouTube still knows the videos you're watching. It knows a little less about your subscriptions, but that's about it.

The second issue is discoverability, especially when viewing the videos outside YouTube. By using YouTube without the YouTube, you lose out on the recommendation algorithm. Say what you will about its quality or accuracy, but I have found some gems of content in the recommendations for others. Personally I'm not hugely bothered by this, the recommendations which appear after a video are enough for my use. But if it's an issue for you, keep watching on YouTube.

### What about invidious?

[Invidious](https://github.com/iv-org/invidious) is an alternative front-end to YouTube. Subscriptions and viewing is done via Invidious, but the content is streamed from YouTube, via invidious. This way subscriptions are still managed outside YouTube, away from all its _"features"_, but with as little information leakage as possible.

The main reason i'm not using invidious right now is the stability. Before moving to its own [organisation](https://github.com/iv-org) on GitHub, the original project sat stagnant for a while, with some pretty major issues ([massive memory leaks](https://github.com/iv-org/invidious/issues/1438), hard-coded database credentials). Its new home is slowly going through and fixing these issues, and it's getting really close to something I'd consider running (likely with some memory constraints).

Until that day, I'll be sticking with RSS for my YouTube consumption.
