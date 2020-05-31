---
title: Django 2.2
date: 2019-04-01
tags: [programming]
---

April marks the release of Django 2.2, the latest LTS version of the popular Python web framework. Django 2.2 marks almost two years of development since the last LTS release, 1.11 in April 2017, and brings with it some very large improvements and changes which naturally come with a major version bump.

Django historically works off the LTS pattern of software releasing, providing two channels. LTS releases are maintained far longer than regular versions, and receive regular bug fixes and security patches in line with the main release channel.

![Django update cycle](https://static.djangoproject.com/img/release-roadmap.png)

The bump from 1.11 to 2.2 also bought with it the updates from 2.0 and 2.1. Features used by some users for 18 months finally come to those who need the stability of an LTS release. I've not delved too far into the 2.x releases so far, as most of what I do strongly benefits from using an LTS-based version.

This is far from a complete list - that can be found on the [Django website](https://docs.djangoproject.com/en/2.2/releases/). This is simply the parts I found most interesting. If you're about to upgrade a codebase, or are just interested in what's changed, I highly recommend checking the release notes for yourself!

## ~~Python 2~~

Django 2.0 (ironically named) is the first Django release to completely drop support for Python 2, requiring at least 3.5. Python 2 (commonly referred to as 'legacy python') will retire [in 2020](https://pythonclock.org/), so it's great to see Django fully drop support beforehand so users have to start migrating their codebases. For years there's been a debate as to which major version of python is better: 2 or 3. Considering Python 2 now has an end-of-life date, and the performance gap is now almost a non-issue, this debate is over.

## Simplified URL Routing

In previous versions, Django's URL system relied on regular expressions to match paths. This works fine for very simple data types (like integers, `\d+`), but more complex data structures lead to much more _interesting_ URL patterns. In the past, I've had to resort to a simpler URL pattern, and then doing more URL validation in the view, which is less than ideal. UUIDs were famously very difficult to do, with many people resorting to `[0-9a-f-]+`, whereas the correct regex is in fact [`[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}\Z`](https://stackoverflow.com/a/18359032), apparently.

Thankfully, Django 2.0 fixed this, by drastically simplifying the URL routing syntax to allow for special keywords to be in place of RegEx capture groups. The new syntax is available with the new `path` function:

```python
path('articles/<int:year>/', views.year_archive),
```

This means UUID-based paths can now be written as:

```python
path('articles/<uuid:year>/', views.year_archive),
```

This is a significant improvement over the previous methods. There's support for the following shorthand types:

- `str`
- `int`
- `slug`
- `uuid`
- `path` (any non-empty string)

## Django Admin

### Mobile-friendly

The django admin is now mobile friendly. This isn't a massive deal considering likely how few people are using it in production, but considering it's a fairly useful administration panel for smaller, say self-hosted projects, it's nice to see it getting some much needed UI love.

### Auto-complete

I've personally had to wrestle quite a lot with performance in the Django Admin caused solely by foreign key and many-to-many fields. By default, the Django Admin renders these as `<select />` elements, with all the possible records. This can lead to large lists of models, and potentially some `O(n)` queries if the models `__str__` method also calls queries (please don't get into this habit!).

Django 2.0 resolves this by adding an auto-complete widget for these 2, which means rather than rendering a `<select />`, it renders a custom widget which only searches and populates the search results when the user interacts with it. This will greatly increase the performance in large forms.

## Stronger password hashes

Django uses SHA256 to hash passwords, and then applies some rounds of PBKDF2 over the top, to further strengthen the hash. Exactly why this is done, and what PBKDF2 brings to the table is an interesting topic, for a later date.

Django 2.0 increases the number of PBKDF2 iterations from 36000 to 100000. That's quite an increase, and is meant to increase further to 180000 rounds in Django 3.0. The new round will only be applied to new users, or when existing users change their passwords.

The increase in iterations means hashing passwords is much slower, which can have a huge impact during tests, if they're constantly creating and destroying users. This issue can be compounded if tests need to create lots of users. I've seen 25% increases in test speeds just by swapping to an MD5-based hashing backend, which is significantly faster, as it doesn't use PBKDF2 at all.

## Files can be opened as context managers

Anyone who's opened files with Python, you'll have seen the context manager pattern, and hopefully understand why it's significantly better than opening and closing the file handler manually.

```python
with open("file.txt", "w") as f:
    file.write("Hello world")
```
This pattern can now be used with Django files from file / image fields. This results in slightly cleaner code which is less prone to leaving handles open to files which aren't needed any more.

## New Database functions

One of the largest changes in Django 2.0 - 2.2 is the plethora of new database functions added. These database functions allow more complex queries than were previously allowed, enabling more computation to be done by the database, rather than pulling all the data into python land and operating there.

As with many other things in Django, said functions are named fairly well, so don't require much explanation:

### 2.0
- `StrIndex`

### 2.1
- `Chr`
- `Left`
- `LPad`
- `LTrim`
- `Ord`
- `Repeat`
- `Replace`
- `Right`
- `RPad`
- `RTrim`
- `Trim`

### 2.2
- `Reverse`
- `NullIf`
- `Abs`
- `ACos`
- `ASin`
- `ATan`
- `ATan2`
- `Ceil`
- `Cos`
- `Cot`
- `Degrees`
- `Exp`
- `Floor`
- `Ln`
- `Log`
- `Mod`
- `Pi`
- `Power`
- `Radians`
- `Round`
- `Sin`
- `Sqrt`
- `Tan`
- `ExtractIsoYear`

With all these new functions, focusing around maths and string manipulation, database servers can be leveraged more, and less data returned to the application server. Exactly how useful these are, I don't know - So far I've not found a need for many of them.

## `QuerySet` API

### `QuerySet.iterator` chunk size

`QuerySet.iterator` is an efficient way of loading very large datasets into Django to be used. Simply iterating over a queryset loads the entire result set into memory, and then iterates over it as a `list`. `.iterator` uses cursors and pagination to chunk up the data, so a much smaller amount of data is stored in memory at once.

The new ability to specify a chunk size allows tuning of this to improve performance. The default is 2000, which represents something [close to how it worked before](https://www.postgresql.org/message-id/4D2F2C71.8080805%40dndg.it).

### `QuerySet.values_list` can return named tuples

[Named tuples](https://docs.python.org/3/library/collections.html#collections.namedtuple) are much like tuples, but their keys are, well, named! Named-tuples are a type-safe, lightweight, immutable alternative to passing around dictionaries when there's a limited set of keys. `values_list` being able to return these means the returned objects can be deconstructed in a much nicer way, and allow stronger type inference.

### `QuerySet.explain`, explained.

The new `explain` method on a `QuerySet` hooks into the existing SQL `EXPLAIN` statement to provide additional execution detail on queries. This allows a deeper understanding into the queries Django is using, and how the database will execute them. If you just want to see the query Django will execute, there's a `.query` property on a queryset, but that's been around a while.

### `QuerySet.bulk_update`

Updating many model instances at once often required either using a separate update query, or iterating over queries, resulting in `O(n)` queries, Neither of which are ideal. Django 2.2 introduces the `bulk_update` method, which takes a list of modified model instances, and saves them in a single query.

`bulk_update` requires knowledge on which fields it's updating as the second argument, therefore if there may be modifications to differing fields per instance, this may not be ideal.

Personally, I can't think of many places this will be necessary, but I'm sure someone can! It's always better to have features like this than work around them.

## `createsuperuser` password validators

Django 1.11 added support for password validators, which can be used to measure the strength of users passwords against pre-defined requirements. Often during development, it's easier to have a simpler password than your validators allow (`password` is a perfectly fine password for once!). `createsuperuser` now prompts if these validators should be ignored, allowing super users to have weaker passwords for development.

Even though this exists, please don't use it in production!

## Secure JSON serialization into HTML

Anyone who has dumped JSON blobs into HTML pages should have come across [`django-argonauts`](https://github.com/fusionbox/django-argonauts) (if you're doing this _without_ `django-argonauts`, fear). `django-argonauts` helps prevent multiple different classes of XSS attacks, which there are great examples of in the [project's README](https://github.com/fusionbox/django-argonauts#filter).

Django now has some built-in support for protecting against these kinds of attacks, from the new `json_script` filter. This takes an object in template context, serializes it to JSON (securely), and wraps it in a `script` tag, resulting in:

```html
<script id="hello-data" type="application/json">{"hello": "world"}</script>
```

This can then be used by JavaScript directly by getting the tag by ID. If you still need to inject data directly into JavaScript source, `django-argonauts` still provides additional functionality.

## Constraints

The new constraints API in Django 2.2 allows for far greater control of database-level validation on model fields than previously available in field validators, because they're applied at the model level, rather than the field level. Django 2.2 comes with two built-in constraints: `UniqueConstraint` and `CheckConstraint`. Both constraints are executed at the database level (as additional queries rather than column-level constraints), which whilst making them faster when doing complex relationship-level validation, also increases the number of queries executed when modifying a model instance.

`UniqueConstranint` creates a unique constraint with any number of fields, in much the same way `unique_together` worked. `UniqueConstraint` also provides an additional `condition` argument, which specifies additional `Q` objects which must also apply. For example, `UniqueConstraint(fields=['user'], condition=Q(status='DRAFT')` ensures that each user only has one draft.

`CheckConstraint` works much like standard field-level validators, however can work on multiple fields at once, as it uses `Q` objects to specify the validation.

## No more headers in migrations

Whenever `manage.py makemigrations` is run, Django injects a header into migrations with the generated date and version. These headers are simply for reference, they serve no value at runtime.

```python
# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-07 16:10
```

The new `--no-header` argument removes this when generating new migrations. In a typical workflow, there's little reason to remove this, but it's nice there's the option now! I'd be interested in hearing a use case for this!

## Migration planning

When executing migrations, especially in a production environment, it's useful to know which migrations are going to run. This is especially useful when certain migrations may require some site downtime. Previously, it was possible to see the migrations to run by using `manage.py showmigrations | grep -F "[ ]"`, but this is less than ideal, and a bit of a hack (not that that's a bad thing!).

Django 2.2 adds the ability to see the migrations before they are executed, rather than having to roll this functionality yourself. This is done using the new `--plan` flag.

## `request.headers`

Previously, `request.META` gave access to HTTP headers, in a slightly weird way.

> any HTTP headers in the request are converted to META keys by converting all characters to upper-case, replacing any hyphens with underscores and adding an `HTTP_` prefix to the name. So, for example, a header called `X-Bender` would be mapped to the META key `HTTP_X_BENDER`.

For anyone who's worked with raw HTTP headers in the past, this is a little weird.

Now, `request` objects have a `headers` attribute which allows a far more sane API over the raw request headers. As all headers should be, the accessing API is case-insensitive!

## Use of `sqlparse`

In previous versions, Django's ORM handled every aspect of constructing SQL queries. This added a lot of additional, and arguably unnecessary code to the core of Django. Django 2.2 adds a new dependency which takes care of this: `sqlparse`. `sqlparse` is a library to handle AST parsing of SQL, allowing the conversion from SQL text to Python objects, and vice versa. This doesn't extract Django's ORM into an external package, just remove a small section of it in favour of an existing library.

Using an external library brings with it many benefits. There's now less code inside the core Django codebase, meaning there's less for the core developers to manage and tie in to Django's release cycle. **(Wild speculation alert!)** It also _might_ mean it gets faster. Society is built on specialization, therefore hopefully a library designed to do SQL parsing will be faster and more robust than the one originally written for Django, and also takes some strain off the Django core team!

## Watchman

[Watchman](https://facebook.github.io/watchman/) is a technology from Facebook which enables efficient and powerful file watching in a directory. Django now has the ability to use this when doing live code reload in the dev server, rather than the pure-python alternative. This will give massive performance improvement on large codebases, and use fewer resources as it does.

Watchman support isn't enabled by default. It requires an additional optional dependency `pywatchman` to operate, along with watchman being installed on your machine.

## Database instrumentation

Django supports many ways of modifying the querying and model lifecycle, from executing arbitrary SQL, to using signals to listen for specific model events. Django 2.0 introduces instrumentation, which allows intermediary code to be executed for each query, enabling modification, logging, and any other munging of queries and data you need.

An interesting use for this would be explicitly disabling queries in certain parts of the code, with [`django-zen-queries`](https://github.com/dabapps/django-zen-queries) (ships in https://github.com/dabapps/django-zen-queries/pull/12).

## Upgrading

With Django 2.2 now released, it's time to actually start upgrading. Django 1.11 stops receiving support in April 2020, so large complex codebases don't have long! The next LTS version, 3.2, is due in April 2021. Who knows what Django will look like then!

(On a complete tangent, don't do large software releases on April 1st!)
