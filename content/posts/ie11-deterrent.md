---
title: Educating internet explorer users
date: 2022-04-15
tags: [website, security, programming]
image: https://stopinternetexplorer.com/img/stop_using_ie.webp
---

[Internet Explorer](https://en.wikipedia.org/wiki/Internet_Explorer) was, in its prime, the most popular internet browser in the world. Originally released alongside Windows 95, its headline feature [seemed to be](https://web.archive.org/web/20031002010203/http://www.microsoft.com/windows/WinHistoryIE.mspx) that it was maintained by Microsoft and was automatically installed. It wasn't until Internet Explorer 2.0 in November 1995 that feature we're used to, like SSL and cookies. But it's not 1995 any more.


In 2022 (which apparently it is now), Internet Explorer is rarely ever used, reserved mostly for those still clinging to the tools and technologies they're familiar with. However, because Internet Explorer is so old, it doesn't support many of the [shiny new features](https://caniuse.com/?compare=ie+11,edge+100,firefox+99,chrome+100&compareCats=all) we've come to expect from websites (don't even get me started on Web 3.0). With people sticking to what they know, but developers wanting to use the new shiny, we need to start strongly encouraging users to migrate to something better, or at least newer.

{{% youtube es9DNe0l0Qo %}}

From today, anyone trying to view my website in Internet Explorer will be met with an [educational message](https://stopinternetexplorer.com/).

## Why

{{<block tldr>}}
Because, I quite enjoy trolling people.
{{</block>}}

But seriously, Internet Explorer is no longer maintained. It's not received feature updates for a while, and even when it was maintained, it was living in [its own world](https://code.tutsplus.com/tutorials/9-most-common-ie-bugs-and-how-to-fix-them--net-7764) doing its own thing, requiring a number of polyfills and special cases to make sites look like every other browser. [Back in May](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge/) Internet Explorer began its retirement process, being replaced by "IE Mode" in Edge.

![IE11 retirement plan. source: Microsoft](https://blogs.windows.com/wp-content/uploads/prod/sites/2/2021/05/New-Timeline-1024x361.png)

On June 15th 2022 (exactly 2 months from today), Internet Explorer will be officially retired. Although tools and services have been dropping support for ages. Heck, even [Office 365 dropped support for Internet Explorer back in August](https://techcommunity.microsoft.com/t5/microsoft-365-blog/microsoft-365-apps-say-farewell-to-internet-explorer-11-and/ba-p/1591666). You can even tell Microsoft to forcefully redirect your site to opening in Edge instead, which is something [Stack Overflow](https://stackoverflow.com/questions/63731061/how-do-i-redirect-ie11-to-edge-like-stack-overflow) do.

And then of course, there's what to switch to. More modern browsers bring with them security fixes, performance improvements, and new shiny features both you and developers will appreciate. Personally, I've been a Firefox user for [as long as I can remember]({{<relref "state-of-the-apps">}}), and have 0 intention of going anywhere.

## How

We've talked about the why, but how can we inform people of the new ways? How can we inform them that their browser is inferior to what's already out there. Well, by telling them.

When someone in IE11 visits this site, they are automatically redirected to the aptly named [stopinternetexplorer.com](https://stopinternetexplorer.com/), which educates them on why Internet Explorer is outdated, and suggests alternatives they may be interested in.

But how does it work?

### Detecting IE11

Step 1 is detecting Internet Explorer. Because it's so old, not everything in Javascript is supported, which is why there is often the need to polyfill even the most basic of APIs. I'm not normally one for using libraries for something so simple, but rather than copy someone's code, I decided to depend on a tiny library simply called `is-ie-11`.

`is-ie-11` uses Javascript APIs which were only ever implemented and used by Internet Explorer to fingerprint it and determine whether it's running there in as safe of a way as possible (browser standards are a mess, right!).

### Shaming

Now, we do the redirect itself. I didn't trust Internet Explorer at all, so I had to check, but fortunately [`window.location.assign`](https://developer.mozilla.org/en-US/docs/Web/API/Location/assign) is [supported](https://caniuse.com/mdn-api_location_assign).

Marrying it all together, we end up with a very tiny script:

```javascript
const { isIE11 } = require('@ledge/is-ie-11');

if (isIE11()) {
  // Stop using internet explorer!
  window.location.assign('https://stopinternetexplorer.com/');
}
```

Added right at the top of the `<head>` tag, this should do the trick nicely!

## Performance

I take the performance of my website very seriously. Professionally I focus on performance, from both the server and client sides of development.  My website is currently a [static site](https://github.com/realorangeone/theorangeone.net) created with [Hugo](https://gohugo.io) using a very custom theme. Because it's static, it's incredibly fast to load, and is compressed as much as it can be.

The additional weight on the page is as small as possible. The script itself is tiny (288 **bytes**), sent compressed (214 bytes over the wire), and executed [async](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-async) to prevent any impact. Additionally, the file will only be downloaded once, so subsequent visits won't need to download it. And, because the script is so small and simple, it barely takes any time to run anyway.

## Impact

I'm never going to notice this in action, and take advantage of the message it's preaching, but I'm sure someone out there will. I use [Plausible](https://plausible.io) for my analytics, which currently reports almost no one uses Internet Explorer to visit my website, which given its target audience is not entirely surprising.

It's just another tiny _fun_ Easter egg to go alongside the others, like that "To top, in _style_" button way down there in the footer. Go on, give it a click...
