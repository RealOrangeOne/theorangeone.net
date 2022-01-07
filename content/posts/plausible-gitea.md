---
title: Plausible & Gitea
date: 2021-01-19
image: unsplash:New8EgKnSds
subtitle: Tracking activity on Gitea using Plausible
tags: [self-hosting]
---

Yesterday, I moved my Git server from GitLab to Gitea. There's nothing wrong with GitLab, I actually quite like it, but it's a rather large tool for my needs. Gitea is much more [lightweight](https://twitter.com/RealOrangeOne/status/1351262593776840714), faster, and provides all its features for free. Now, it'd be nice to add some analytics to Plausible, for no reason other than personal interest.

Plausible, [my analytics tool of choice]({{< relref "self-hosting-plausible" >}}), simply requires a single `script` tag be added somewhere on the page. With GitLab, modifying templates or adding custom ones was a bit of a pain. GitLab has a tonne of theming and configuration options, but none seem to quite go as far as "here's some custom HTML". Gitea on the other hand has some great options for adding custom HTML to certain parts of the page, and even supports just being given an entirely custom theme.

## Custom footer content

Plausble recommends putting the tracking script in the `<head />` of the page. Personally I prefer to keep scripts like this at the end of the page, so they don't impact the actual site load. If you want to follow Plausible rather than me, just change `footer.tmpl` below with `header.tmpl`, and everything should work fine.

Gitea's documentation on this [used to be](https://github.com/go-gitea/gitea/pull/14399) a little hard to understand, so I fixed it just before writing this post. Gitea wants the custom templates to live in a `templates` directory, which will sit next to the `conf` directory with your `app.ini`. Here we need to create the file `custom/footer.tmpl`, which will contain the extra HTML Gitea will put immediately before the closing`</body>`.

Inside `footer.tmpl`, add the script tag for Plausible. You can find this in the Plausible admin panel.

```html
<script async defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
```
Once added, simply restart Gitea, and it'll start being tracked by Plausible!

## Just tracking unauthenticated users

Now analytics is working, that's great! But personally I don't really want it tracking me as I use it, just other people. Eagle-eyed readers will notice the extension on `footer.tmpl` implies it's a template - because it is. `footer.tmpl` is a fully-fledged Go template, meaning you can use Go's template system as needed.

One of the items in the footer context is `SignedUserName`. If the user is logged in, this is their name. If they're not logged in, it's empty. Therefore, this can be used to check whether the user is logged in, and only show the script if they aren't:

```html
{{ if not .SignedUserName}}
  <script async defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
{{ end }}
```

Now, when anonymous users visit the page, the Plausible snippet will be injected, and their browsing tracked. When you're browsing around, there'll be no snippet, so no tracking!

For more on how to customize your Gitea instance, check out [their docs](https://docs.gitea.io/en-us/customizing-gitea/). For my Gitea instance, check out [git.theorangeone.net](https://git.theorangeone.net/).
