---
title: Finding RSS feeds
date: 2022-06-26
tags: [privacy]
image: unsplash:bSlHKWxxXak
---

I love [RSS](https://en.wikipedia.org/wiki/RSS), and I love that it exists. RSS is an open standard for "content syndication", which basically means you can scrape a list of content from a website and then read it wherever and however you want. Because it's an open standard, and a fairly simple one at that, you'll find it in a very large number of places - even [YouTube]({{<relref "consuming-youtube-through-rss">}}).

It's all well and good knowing about RSS, or even using it, but _finding_ the feeds can be a different beast altogether.

## _What's atom_?

In this article, when I say "RSS Feed", I'm talking about a standardized feed of content which is easy to consume. The most popular of which, by a long way, is RSS. But some sites use [Atom](https://en.wikipedia.org/wiki/Atom_(web_standard)), or both. Atom is a slightly newer standard, but achieves the same thing. The structure itself has some newer features, but the gist of it remains the same: It's an XML format containing a feed of content.

Most RSS readers will happily accept both formats, hence I and many others just refer to them both as "RSS feeds". If you're looking for an RSS feed, and only find an atom feed, try using that URL and seeing if your reader supports it. It'll do exactly the same thing.

## How do you find feeds?

Before you can use a feed, you need to know its URL. RSS feeds are just an XML file that a server generates. If you put the URL to this file into your RSS reader (or "aggregators" as they're also known), it'll monitor the URL, parse its contents and create a list of articles or other content for your consumption. RSS feeds aren't a file you download and then do something with - it's always a snapshot of the current content, so needs to be checked repeatedly to keep up-to-date.

If you're lucky, the website will just give you a link to its RSS feed. Whether on its homepage, navigation, footer, or even on the listing pages themselves. Right-click the link, copy the URL, and you're set. Whilst I make sure [my feed](/index.xml) is easily available, sadly, not all sites are this simple.

### Metadata

Normally, a site will "advertise" the link to its RSS feed, so it can be picked up automatically by any bots or other integrations scraping the site. If you know a little HTML, you can read the same code the bots will and pick out the links for yourself.

As part of a web page's metadata (found in the `<head>` tag), a page can tell anything (or anyone) reading it that there is an "alternative" `application/rss+xml` format of the page (presumably this page is listing the content which would appear in a feed), and provide a URL to that format.

For example, when trying to find the RSS feeds for your favourite [YouTube channel](https://www.youtube.com/channel/UCOWcZ6Wicl-1N34H0zZe38w), you'll see a tag looking something like:

```html
<link rel="alternate" type="application/rss+xml" title="RSS" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCOWcZ6Wicl-1N34H0zZe38w" />
```

And there, in the `href` attribute is the RSS feed URL we need. Subscribe to that in your reader of choice, and you're all set. The same is true for most other websites, and this is definitely the most common and reliable way of finding a feed.

### Common URLs

The internet is built on standards - until it's not (don't even get me started on Javascript). Whilst pages can state that they support an alternative RSS format, they don't have to. But, more commonly than you'd think, a feed does exist, it's just not documented anywhere. This is where a little guesswork comes in. Because feeds are just URLs, you may be able to take a few educated guesses as to what the URL might be, based either on other URLs for the site, or one of the technologies the site is using.

{{<block tip>}}
If you want to find out some technologies a website is using, check out [builtwith.com](https://builtwith.com). It won't necessarily pick up everything, but it'll be an interesting insight into at least some tools a website is using - [Like mine](https://builtwith.com/theorangeone.net).
{{</block>}}

#### Hugo

My website is currently a static site built with [Hugo](https://gohugo.io). Hugo [natively supports](https://gohugo.io/templates/rss/) creating RSS feeds for all of its listing pages - in fact it does it by default. But the aforementioned `link` tags have to be added manually - and if they're forgotten about, the feeds remain unmentioned, but they're definitely there, at known URLs.

For example, the list of all my posts can be found at [`/posts/`](/posts/). In reality, the file Hugo outputs is `/posts/index.html`. Right next to it, at [`/posts/index.xml`](/posts/index.xml), Hugo outputs an RSS feed. This is the same for all listing pages on my site, and likely the vast majority of other Hugo sites out there. If you know where the listing pages are, it's a small step to find the feeds.

#### WordPress

WordPress is basically everywhere - Around [43% of the internet is powered by WordPress](https://w3techs.com/technologies/overview/content_management). WordPress is many things, but one of its built-in features is the ability to create posts, and with that comes a feed of content in a variety of formats. Buy default, WordPress creates an RSS feed at the helpfully named URL `/feed/`. This contains all the posts on the given site, ready for consumption.

Of course, it's possible to [disable these feeds](https://www.wpbeginner.com/wp-tutorials/how-to-disable-rss-feeds-in-wordpress/), but if you're reading this, then why would you?!

#### Podcasts

Since _the events_ of early 2020, podcasts have really taken off - it seems practically everyone has a podcast nowadays. The infrastructure behind podcasts is very simple: it's just an RSS feed with links to audio files. Of course these feeds often contain [much more metadata](https://github.com/Podcastindex-org/podcast-namespace) about the shows than a website's RSS feed might, such as author information, chapters etc. And that's before we even start talking about [value for value](https://podcastindex.org/podcast/value4value).

Given all of this, it's quite likely you're already a user of RSS (unless you consume your podcasts through [Spotify](https://beard.fm/blog/spotify-is-killing-podcasts)). Whilst you can absolutely subscribe to your favourite podcasts in your favourite RSS reader - using a dedicated podcast app is almost certainly the better approach (I personally use PocketCasts).

## What if a site doesn't have an RSS feed?

Because of the popularity of RSS, or lack thereof, many websites simply don't have an RSS feed. The larger the site, the less likely it is to have one. Think you could get a feed of your friend's Facebook posts? Think again!

If you desperately need a feed, there are services out there which claim to scrape sites and produce an RSS feed for you automatically. I've used a few services like this, and they work _fairly_ well, until they don't. If the site changes its styling, moves some content around, or generally modifies the page in some other way - the feed just stops.

If you can't find the feed for a specific website - try asking them. RSS not only helps users keep up-to-date with new content, but also easily connect automation and deep integrations for when new content is posted. Anyone who reads a lot of content online (e.g. _the media_), likely does so through RSS, so ensuring those people are told about content when it's available, rather than having to search and remember to look for it means more readers or viewers.

If you run a website, no matter the size, consider adding an RSS feed for any content you have. Blog posts, publications, events, all perfect candidates. The more content consumable through RSS, the more the internet becomes the open and easily connected world it was intended to be.
