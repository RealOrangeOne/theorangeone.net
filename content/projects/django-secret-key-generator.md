---
title: Django secret key generator
repo: RealOrangeOne/django-secret-key-generator
subtitle: Generate a secure key for Django's `SECRET_KEY`.
---

## What's a "secret key"?

Django's [`SECRET_KEY`](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key) is the setting used as the basis for secret generation and signing. It's used to generate session keys, password reset tokens and any other text signing done by Django.

For the safety and security of a Django application, this **must** be kept as secret as possible. Exposure of this key compromises many of the security protections Django puts in place.

## Why does this application exist?

There are a number of key generators out there, including [miniwebtool](https://miniwebtool.com/django-secret-key-generator/) and [djecrety](https://djecrety.ir/).

Previously I used and recommended miniwebtool, however they recently added a number of intrusive adverts and cookie policies which make it annoying to use and difficult to recommend. Djecrety is nicer, however the site is far more complex, and doesn't share a codepath with the package it recommends (with the same name).

Instead, I've decided to [write another](https://xkcd.com/927/), which is much simpler, generates tokens more securely, and thus is easier to use and recommend.

## How does this application work?

I've intentionally copied the [implementation](https://github.com/django/django/blob/3.1/django/core/management/utils.py#L77) from Django as closely as possible (whilst converting it to Typescript). Django's keys are 50 characters by default, as are these. The set of possible characters is also the same as Django's.

Secrets are generated solely in-browser, using the [`WebCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) API, and in a way which doesn't introduce [modulo bias](https://stackoverflow.com/questions/10984974/why-do-people-say-there-is-modulo-bias-when-using-a-random-number-generator). A single random value is generated, and used as an index into the possible characters. This is then repeated as many times as characters are needed for the key. Each chosen characters is then concatenated together to form the final key.

## Do you need this?

Probably. Django's `startproject` command does generate a secret key for you in a secure way for your newly created Django project. But it's good practice to have a different key for each environment, whether that be development, staging or production. Therefore, there's a need to generate one after a project has been set up, when you're creating a new environment or starting a project from something other than `startproject`.

## Can I see the source code?

[Of course](https://github.com/RealOrangeOne/django-secret-key-generator)! If you spot a problem or can do something better, please open an issue or PR.

{{< iframe src="https://django-secret-key-generator.netlify.app/" >}}
Django secret key generator
{{< /iframe >}}
