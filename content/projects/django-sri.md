---
title: Django SRI
repo: RealOrangeOne/django-sri
subtitle: Subresource Integrity for Django
---

[Subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) is a way of securing your remote CSS and JS from being modified without your consent. This works by adding a hash of the file to the `script` or `link` tags, and if the remote file doesn't match, it's not executed. Most people would think this is only useful for JS, but even CSS can be used for [malicious purposes](https://css-tricks.com/css-keylogger/).

If you're using scripts from a CDN, SRI gives you some confidence that the file won't change without your knowledge. If the CDN is compromised, or a malicious version is published, then yor users are safe.

If you're using scripts hosted by yourself, then SRI can help prevent against man-in-the-middle attacks (albeit slightly), as well as ensure files are served exactly as you expect them to be.

## Using SRI with Django

SRI has been around for a while, as has Django, but no one has put the 2 together it seems. That's where [`django-sri`](https://github.com/{{< param "repo" >}}/) comes in.

By installing and configuring it correctly, you're given a new `sri_static` template tag, which outputs a fully formed `script` or `link` tag, with the required integrity checks setup.

```
{% sri_static "index.js" %} <!-- Will output "<script src='/static/index.js' integrity='sha256-...'></script>" -->
```

The integrity hash is calculated at request time, but is cached in memory to improve performance. The hashing is dome with `hashlib`, which is both fast and won't block the [GIL](https://docs.python.org/3/glossary.html#term-gil).

interested in giving it a try? [Go install it](https://github.com/{{< param "repo" >}}/#installation)! This integration doesn't support remote assets, but that's coming!
