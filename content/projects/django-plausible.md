---
title: Django Plausible
repo: RealOrangeOne/django-plausible
subtitle: Django module to provide easy Plausible integration, with Wagtail support
---

It's no secret I'm a huge fan of [Plausible](https://plausible.io) when it comes to analytics. I've jumped around a number of different platforms, and this one just clicked. I've been [running Plausible]({{<relref "self-hosting-plausible">}}) on my websites (yes, even this one) for a while now.

Adding it to your website is as simple as just [adding a script](https://plausible.io/docs/plausible-script):

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
```

Solutions like that are often not suitable for environments like CMSs, especially those hosting multiple sites, where certain aspects need to be dynamic and controlled by users who may not have or need access to the code itself.

I'm a full-time developer who works with [Django](https://www.djangoproject.com/), so I created [`django-plausible`](https://pypi.org/project/django-plausible) to help with that. It exposes some handy template tags which make adding Plausible very simple, and allow it to react to multiple sites.


```jinja
{% load plausible %}

{% plausible %}
```

Will result in:

```html
<script defer data-domain="example.com" src="https://plausible.io/js/plausible.js"></script>
```

And, allows some further customization:

```jinja
{% plausible plausible_domain="my-plausible.com" script_name="plausible.hash.js" %}
```

It additionally supports [Wagtail](https://wagtail.io/) (I do work for Torchbox, after all), so it can be configured from the Wagtail admin using Wagtail's [settings](https://docs.wagtail.io/en/stable/reference/contrib/settings.html#settings).


{{% repobutton %}}
