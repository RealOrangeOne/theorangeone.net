---
title: What's new in Django 3.2 LTS
date: 2021-04-06
image: unsplash:GFpxQ2ZyNc0
tags: [programming, django]
---

It's that time again, time for another Django LTS release. Since [Django 2.2]({{< relref "django-22" >}}), back in 2019, a lot has changed in tech, in Python and of course in Django.

Historically, I've worked entirely on LTS versions, hence combining these 3 releases together. Staying on the LTS version is a trade-off between stability and shiny new features, but there's no right answer as to which you should be on. If you're not in the habit of upgrading often, stick with the LTS releases. If you enjoy loving life in the fast lane, moving fast and breaking stuff, then the regular releases are for you. That's not to say they're worse, just not supported for as long, so when security issues hit, you're on your own.

## Shiny Newness

This is far from all the changes since 2.2, those can be found on in the release notes for [3.0](https://docs.djangoproject.com/en/dev/releases/3.0/), [3.1](https://docs.djangoproject.com/en/dev/releases/3.1/) and [3.2](https://docs.djangoproject.com/en/dev/releases/3.2/). These are simply the bits I found most interesting or most useful to my development life. If you're basing your upgrade path purely off this post and not reading the full release notes for yourself, you're in for a bad time.

### Asynchronous Server Gateway Interface

Without a doubt, the flagship feature of the Django 3.x release cycle has been [ASGI](https://asgi.readthedocs.io/en/latest/) support, and thus it's now possible to write `async` Django.

Django 3.0 introduced an [ASGI handler](https://docs.djangoproject.com/en/dev/howto/deployment/asgi/), allowing ASGI-compatible servers like [`uvicorn`](https://www.uvicorn.org/) to be used to serve Django applications. This doesn't mean it runs in an event loop, at least not yet, but it means Django can be run alongside other ASGI-based applications.

The best bit came in Django 3.1: Async middleware and views. Now, it's possible to write fully [async views](https://docs.djangoproject.com/en/dev/topics/http/views/#async-views) and [middleware](https://docs.djangoproject.com/en/dev/topics/http/middleware/#async-middleware), leveraging the full power of `async`. Django will happily run async views alongside sync views however, so they can be mixed and matched as needed.

```python
import datetime
from django.http import HttpResponse

async def current_datetime(request):
    now = datetime.datetime.now()
    html = '<html><body>It is now %s.</body></html>' % now
    return HttpResponse(html)
```

It's still worth noting that not everything in Django is async-compatible, like the ORM and caching layers. Instead, these are automatically pushed to a background thread pool, so other tasks can be processed without blocking the event loop. The same principle is used to run sync views under ASGI.

Something important to remember: Async isn't necessarily always better. In fact in some cases, it can be much worse. `async` works best when heavily context switching, thus plays well with IO-intensive workloads. With CPU-bound workloads, all tasks in the async pool are blocked whilst 1 is completing work, which massively affects performance.

[Andrew Godwin](https://www.aeracode.org/), who headed most of the ASGI work in Django (and [`asgiref`](https://github.com/django/asgiref)) gave a great talk about how the `async` implementation works in Django, and when not to use it.

{{< youtube 19Uh_PA_8Rc >}}

There's also a [dedicated page](https://docs.djangoproject.com/en/dev/topics/async/) in the docs about it.

### Django version support

Starting with the release of Django 3.0, the Django maintainers set out some ["suggestions"](https://docs.djangoproject.com/en/dev/releases/3.0/#third-party-library-support-for-older-version-of-django) for which versions of Django 3rd-party packages should support:

> Following the release of Django 3.0, we suggest that third-party app authors drop support for all versions of Django prior to 2.2

I've seen, used and even contributed to packages which still claim support for Django 1.8, which was end-of-life back in 2018. Personally I maintain support for any actively maintained version of Django, if it works on older versions that's a bonus. It's nice to see some suggestions around this, though, and what people think is a "reasonable" support window.

### No more Python 3.5

Python 3.5 was quite a Python release. It was the start of Python's async story, with the introduction of the `async` and `await` keywords. Now, many years later, it's dropped off the end of the Python support lifecycle. Now Django too, no longer supports it. It _might_ still work, but I definitely wouldn't be depending on it for production applications. I also wouldn't want to run an unsupported version of Python at all either, but that's just me.

### `enum.Enum` model fields

[Enums](https://docs.python.org/3/library/enum.html) are a great way of defining a set of values in a way which can be reused in a type-safe way.

```python
class Color(enum.Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Enums like this would be a great fit for Django's `CharField` choices, as in those cases you generally want just a few specific values rather than any string. Previously the only way to do this was to do it yourself, or using something like `django-model-utils`'s `Choices`.

Finally, in Django 3.0, you can get rid of that. You can natively pass `Enum`s as choices arguments to fields. Django will automatically cast to and from the Python-land `Enum` type when reading and writing to the database.

If you're interested in how Django's choices work, and how the changes in 3.0 make life so much easier, there's a [great talk](https://www.youtube.com/watch?v=wQCZ_tcS0uk) from DjangoCon EU 2020 which goes into more detail.

### `SmallAutoField`

`SmallAutoField` [does exactly what it says on the tin](https://www.youtube.com/watch?v=OkGaq9xiQZY). It's like `AutoField`, but smaller.

`AutoField` is most useful as a primary key, whereby it's an auto-incrementing integer starting at 0. Whenever new rows are inserted, the counter increments 1 and uses that as the value.  If your model doesn't explicitly have a primary key, then Django automatically uses `AutoField`.

`SmallAutoField` is much like that, only instead of supporting values up to 2147483647, it only supports values up to 32767. 32767 being smaller than 2147483647, the name makes sense.

Personally I quite like the pattern of using Django's smaller `IntegerField` types when needed, mostly because the database and wire representations are likely much smaller and thus more efficient. But it also makes you less likely to create too many rows, or increment a counter far higher than necessary.

### Default primary key customization

As mentioned before, Django uses `AutoField` by default when giving a model its primary key. For most people this is fine, as it's highly unlikely you'll create 2147483647 rows in a table. Unfortunately, for larger-scale applications this isn't necessarily true.

2147483647 may look familiar to some. It's the largest number it's possible to store in a (signed) 32-bit integer. Django's `AutoField` is backed by a 32-bit field, meaning that's the largest primary it's possible to store. Notice it's stored as a _signed_ value, even though only the positive space is used, meaning really you've only got 31-bits to store data in (which _is_ exactly 2147483647).

It's not uncommon for even medium-sized applications to fall victim to this issue. After inserting `n` rows into a table, your database rejects adding any more, which is an issue! This limitation is very well known (unless you're [Parler](https://twitter.com/sarahmei/status/1348474269064339456) apparently), and so nowadays if you're working on a table with is likely to see a large number of rows, or just never want to be caught by the issue, it's better to use `BigAutoField` (which can hold 64-bits, or 9223372036854775807) or `UUIDField` (which can hold 128-bits, or 340282366920938463463374607431768211456).

The new change in Django 3.2 is that you can configure which field Django automatically attaches to models without a primary key. The default is still currently `AutoField`, however that will change in a future release. If you don't have `DEFAULT_AUTO_FIELD` set, Django 3.2 shows a warning.

```python
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'  # 31-bit
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'  # 64-bit
DEFAULT_AUTO_FIELD = 'django.db.models.UUIDField'  # 128-bit
```

If you run out of 128-bit primary keys, you're either doing something wrong or crazy (or both).

### Database-agnostic `JSONField`

Users of PostgreSQL will know Django has actually had a [`JSONField`](https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#django.contrib.postgres.fields.JSONField) for years, in the `django.db.contrib.postgres` module. `JSONField` allowed storing valid JSON in the database, and transparently converting to and from Python dicts and lists. The postgres-specific nature of this allowed the ability to query based on keys inside said JSON fields inside the database, without needing to read and parse the entire blob in Python.

With Django 3.1, this is now available for all supported database backends, meaning everyone can take advantage of efficient storing JSON objects and querying off them.

The way it works is very interesting, and I highly recommend the Djangocon Europe 2020 talk from the creator on how it works:

{{< youtube o9Zb1RmS8vk >}}

### Admin antipatterns

Anyone who's tried to write anything even remotely complex or custom in the admin, has had to deal with the fact that some features require setting attributes on methods:

```python
class PersonAdmin(admin.ModelAdmin):
    list_display = ('upper_case_name',)

    def upper_case_name(self, obj):
        return ("%s %s" % (obj.first_name, obj.last_name)).upper()
    upper_case_name.short_description = 'Name'
```

Funnily enough, [`mypy`](http://mypy-lang.org/) doesn't really like this, as functions don't have a `short_description` attribute which can be set. Meaning either you'd have to `# type: ignore` the line and lose the mypy benefits. To newcomers to Django, this pattern is also _weird_ and especially hard to discover.

Django 3.2 has a solution. There's now an [`admin.display`](https://docs.djangoproject.com/en/3.2/ref/contrib/admin/#django.contrib.admin.display) decorator, which is used to specify these extra details, rather than assigning attributes:

```python
class PersonAdmin(admin.ModelAdmin):
    list_display = ('upper_case_name',)

    @admin.display(
        description='Name'
    )
    def upper_case_name(self, obj):
        return ("%s %s" % (obj.first_name, obj.last_name)).upper()
```

Now the code is significantly easier to read, more pythonic and perfectly type-safe. The same pattern change also exists for admin actions:

```python
@admin.action(description='Mark selected stories as published')
def make_published(modeladmin, request, queryset):
    queryset.update(status='p')


class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'status']
    ordering = ['title']
    actions = [make_published]
```

### Dark themed admin

Finally, the Django admin has a dark theme! The theme is automatically enabled based on the user's OS settings (CSS [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)), so it'll nicely match the rest of the user's environment.

I've been using [darkreader](https://darkreader.org/) for dark theming for a couple of years, but now this is native it'll almost certainly look more polished. Similar things happened when GitHub unveiled a [native dark mode](https://github.blog/2020-12-08-new-from-universe-2020-dark-mode-github-sponsors-for-companies-and-more/#dark-mode).

![New dark theme](https://user-images.githubusercontent.com/8530546/104440677-f04b8780-5592-11eb-93a4-5378b91ff3b0.png)


### Admin sidebar

The Django admin now has a sidebar. It appears both in list and detail views and shows a listing very similar to what's found on the homepage: a list of project models. The sidebar makes it much easier to quickly switch between models without needing to jump back to the homepage.

![Django admin sidebar](https://user-images.githubusercontent.com/3871354/70239136-06213300-176b-11ea-81f5-cb34656f752a.png)

### Admin no longer supports IE11

Internet explorer 11 - just saying those words brings me out in cold sweats. Internet explorer 11 support is the bane of any developer's life.

Fortunately, Django is no longer one of them. From Django 3.1, there's no longer official support for IE11 in the admin. It might work, but it's no longer guaranteed. Chances are this not only makes the maintenance much easier, but now Django users can quote much higher numbers for maintaining IE11 support in applications, which will hopefully deter people from requiring support for it.

### Password hashing

Storing passwords is both [very easy and very hard]({{<relref "how-to-store-passwords">}}). Unless you know exactly what you're doing, you shouldn't be implementing it yourself. Fortunately, Django has some very strong defaults for password storage, with [SHA256](https://en.wikipedia.org/wiki/SHA-2) for hashing, followed by `n` rounds of [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) on top, to further strengthen the hash.

Django 2.2 increased the number of PBKDF2 rounds quite a bit, and the 3.x series increase it even further:

- 2.0: 100000
- 3.0: 180000
- 3.1: 216000
- 3.2: 260000

The increases are getting larger each time, highlighting the fact that PBKDF2 is an ageing algorithm which may not be suitable on today's modern hardware. [Argon2](https://en.wikipedia.org/wiki/Argon2) is the newcomer to the KDF ring, with more tunables. An argon2 hasher was introduced to Django in 1.10, but It's still not the default as it requires an external library. I suspect some day soon this default will change.

As mentioned before, with greater PBKDF2 iterations comes slower tests, especially if they're constantly creating users. Test performance is important, but there are some ways to [speed it up](https://adamj.eu/tech/2020/05/04/new-book-speed-up-your-django-tests/), one of which may be to [store passwords in plaintext](https://github.com/RealOrangeOne/django-plaintext-password) during tests.

Along with rounds increases, the default salt size was increased from 71 bits to 128. Exactly why salting is important is a [separate topic]({{<relref "how-to-store-passwords">}}#salting).

### Stronger `Signer`

Django uses hashing in a number of places internally. Not only when hashing passwords for the database (which uses a different implementation), but also:

- Password reset tokens
- Cookies
- Sessions
- `Signer`

Prior to Django 3.1, the default algorithm was SHA1. SHA1 is now considered _basically broken_ and not suitable for security purposes.

{{< youtube Zl1TZJGfvPo >}}

Django 3.1 changed the default algorithm to SHA256, a much stronger algorithm (no, not 256x stronger, that's not how it works). The previous behaviour can be restored by setting `DEFAULT_HASHING_ALGORITHM` to `"sha1"`, but unless you have a strong reason too, I recommend embracing the new stronger algorithm. Support for SHA1 will be removed in Django 4.0.

### Deny iframes

Iframes are a very weird and rarely useful part of HTML, but when they're needed they're invaluable. Iframes simply allow you to embed 1 website as a part of another, in its entirety.

There can however be some security issues around allowing your website to be embedded into another. Clickjacking is a method of ticking a user into clicking on something invisible or disguised as something else. For example, a malicious website could load in your banks website in an iframe (which thanks to cookies, you'd probably be logged in to), make it mostly invisible, but stick a regular button over the "Send all my money to this Nigerian prince" button. When you click what you think is the website's button, you're actually clicking the one on your bank. This is generally done by embedding a page using iframes.

The easiest way to mitigate this is by using the `X-Frame-Options` header, which instructs the browser not to allow your website to be shown in an iframe. "SAMEORIGIN" would allow `yourbank.com` to be embedded into `you.yourbank.com` but not `nastybank.com`. "DENY" prevents embedding altogether - because it's 2021 and chances are you don't need iframes!

Anyway, back to the topic of Django. Django 3.2 changes the default option to "DENY", preventing your site from being embedded. The setting has existed for a while, and is easily changeable, so should you need iframing for whatever reason, it's easy to keep.

### Referrer policy

Django 3.1 now sets the [referrer policy](https://scotthelme.co.uk/a-new-security-header-referrer-policy/) explicitly to `same-origin`, when previously it was undefined. For most people, this is a good thing for security and privacy, however on some sites this can cause issues.

I'll let [someone else](https://chipcullen.com/django-3-referrer-policy-change/) explain why.

### `get_random_string` length

Django's `get_random_string` is a helper from `django.utils.crypto` I find myself using quite often. It's a way of generating a fixed-length string of random characters, but from a [source of randomness](https://docs.python.org/3/library/secrets.html) deemed ["cryptographically secure"](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator). It's useful both for secret generation, or if you change the character set to numeric, for generating SMS tokens.

It's used by Django internally quite a lot. A notable example is `manage.py startproject`, which uses it to generate a value for `SECRET_KEY`. Django doesn't really have a way of generating a secure value for `SECRET_KEY` other than that, but that's [a different story](https://django-secret-key-generator.netlify.app/).

Prior to Django 3.2, for reasons I don't know, `get_random_string` defaulted to generating 50 characters, also the default size of `SECRET_KEY`. Now, that value is required. Really this shouldn't affect you, but it's a nice change to a really useful method.

### Database `CreateExtension`

Not all databases were created equal, and even those similar can be extended in different ways using extensions. PostgreSQL, my database engine of choice, supports a number of extensions which are enabled using subclasses of the [`CreateExtension`](https://docs.djangoproject.com/en/3.1/ref/contrib/postgres/operations/#createextension) operation.

In PostgreSQL, you have to be a superuser to enable extensions, and rightly so. Unfortunately, or at least hopefully, your web application's database user isn't a superuser on the database server. This is a problem when you try and run migrations and are presented with a permissions error instead.

The reason this happens in Django is quite interesting. Here's the query Django will run to install an extension:

```sql
CREATE EXTENSION IF NOT EXISTS citext;
```

Looks perfect, and there's even a check for not trying to install it if it already exists. But then, why does it fail?

It seems PostgreSQL checks if the user can perform the creation _before_ checking whether the extension is already installed.  The way I've got around this in the past is manually loading the extension as a superuser, then fake the migration which adds the extension.

Now, Django 3.2 explicitly checks whether the extension is installed before issuing the above query, and so assuming a superuser loads the extension, the migration will run fine. It's kind of a pointless migration, but does assert that the extension is loaded, which is still useful.

### `Queryset.alias`

Whenever you're doing a query in Django, and need to reference the value of a related model, you can _annotate_ it onto the queryset. When doing this, Django sets it as an attribute on the underlying model, so it can be accessed in future. However, for the sake of clean reusable code, it's often necessary to annotate a value which is used only in future filters. In this case, the value would still be returned to the client, resulting both in unnecessary computation and network IO.

Django 3.2 adds a new API: `QuerySet.alias`. This allows for annotating values onto the queryset, but doesn't return them.

```python
Blog.objects.alias(entries_count=Count('entry')).filter(entries_count__gt=5)
```

In this example, `blog.entries_count` would raise an `AttribueError`, because it doesn't exist. Aliased values can be used with `annotate`, `exclude`, `filter`, `order_by`, and `update`. For anything else, notably `aggregate`, you'll need to use `annotate`.

### Database functions

Back in the Django 2.2 release, there were a huge number of [database functions added]({{<relref "django-22">}}#new-database-functions), especially around maths. 3.2 isn't quite at the same level, but it still brings some interesting ones, and some interesting changes.

#### `Random` database function

It's now possible to generate random numbers right from the database. `Random` can be annotated onto a queryset, and returns a value between 0 and 1. Rather importantly, this random number is **not** suitable for cryptographic or security-related applications!

#### Database hashing functions

As of Django 3.0, Django has the ability to hash data in the database:

- SHA1
- SHA224
- SHA256
- SHA384
- SHA512

Depending on your needs, these may be much faster than loading all the data and doing the hashing in Python.

#### `JSONObject`

Have you ever wanted to serialize your row to JSON from _inside_ the database? No? Well now you can anyway! The [`JSONObject`](https://docs.djangoproject.com/en/dev/ref/models/database-functions/#django.db.models.functions.JSONObject) function allows you to build up a JSON blob and annotate it onto a queryset or use it in an aggregation.

```python
>>> from django.db.models import F
>>> from django.db.models.functions import JSONObject, Lower
>>> Author.objects.create(name='Margaret Smith', alias='msmith', age=25)
>>> author = Author.objects.annotate(json_object=JSONObject(
...     name=Lower('name'),
...     alias='alias',
...     age=F('age') * 2,
... )).get()
>>> author.json_object
{'name': 'margaret smith', 'alias': 'msmith', 'age': 50}
```

Personally, I can't quite see many use cases for this, but it'd be mighty interesting to see one. I can't quite see it replacing [DRF](https://www.django-rest-framework.org/)'s serializers any time soon, though.

#### `AVG` and `SUM` database methods support distinct

To annotate the number of nested items (related using a `JOIN`), Django has the [`Count`](https://docs.djangoproject.com/en/3.1/ref/models/querysets/#id8) database method. Depending on the query and the filtering being done on this nested data, it's possible for some rows to be counted twice, or more. To combat this, you can pass `distinct=True`, and Django will add a `DISTINCT` constraint ensuring rows are counted exactly once.

This functionality now also exists for the `Sum` and `Avg` functions, useful when rather than simply counting rows, you need to pull out specific values from them.

### Signed JSON

Django's [`Signer`](https://docs.djangoproject.com/en/dev/topics/signing/) is a great tool when transferring data to a user. By signing it you can prove (at least beyond reasonable doubt) that it wasn't tampered with, intentionally or otherwise.  Outside the Django world, [`itsdangereous`](https://github.com/pallets/itsdangerous) is a great library to do similar things.

```python
signer.sign('hello')
>>> 'hello:1NMg5H:oPVuCqlJWmChm1rA2lyTUtelC-c'
```

Previously, Django would only sign primitive data types like ints and strings. In 3.2 there's a new [`sign_object`](https://docs.djangoproject.com/en/dev/topics/signing/#signing-complex-data) API, which serializes data to JSON before signing, allowing more complex data to be signed. This does still only support types which can be converted to JSON, but that's far more secure than using Pickle (although you can swap it out to something other than JSON if you wanted to (please, not Pickle)).

Yes it's been entirely possible to JSON format or pickle an object before signing for a while, but native functionality leads to cleaner code. And the less code I have to write, the better.

### Testing improvements

Testing is a core part of any application, no matter the size. Without testing, you can't really be sure any piece of code works, nor that changes to it won't break it entirely. Django has always had some great testing tools available, but 3.2 really brings some great improvements to this:

[`setUpTestData`](https://docs.djangoproject.com/en/dev/topics/testing/tools/#django.test.TestCase.setUpTestData) is a new method on Django's `TestCase` class which allows you to create model instances once per _test class_ rather than once per _test case_. This will massively speed up testing time, as there's no need to keep destroying and creating test models between cases. If you can't upgrade yet, but absolutely need this now, it can be [installed separately](https://pypi.org/project/django-testdata/).

Naturally, tests will fail at some point, but it's important to understand why they fail. Generally it'll either be because your change is wrong, so you need to fix it, or it'll be because the test is now defunct. It's also entirely possible that your code is right, but the test is wrong, but let's pretend that never happens. In the event you do need to do some deep debugging into why a test case is failing, `manage.py test` has a handy `--pdb` flag, which launches you into a [`pdb`](https://docs.python.org/3/library/pdb.html) (or [`ipdb`](https://github.com/gotcha/ipdb), if installed) session when a test fails.

In production, when an exception is raised during a request, Django nicely catches that and returns a somewhat-friendly 500 error to the client. During tests however, that handling doesn't happen, instead failing the test with the exception directly. In some cases, this may not be what you want, so now the test client has a `raise_request_exception` attribute which when set, safely responds with a 500 instead.

There are a couple more handy ones, but [@AdamChainz](https://twitter.com/AdamChainz/) has a great write-up on these [new features](https://adamj.eu/tech/2021/02/10/new-testing-features-in-django-3.2/).

### Non-pytz time zones

If someone ever tells you "timezones are easy", they're either wrong, or they've never really done time zones. Time zones are hard, really hard.

{{< youtube -5wpm-gesOY >}}

`pytz`, the library Django uses for time zones internally, can make working with time zones even more difficult if you don't know what you're doing (often being described as a [footgun](https://blog.ganssle.io/articles/2018/03/pytz-fastest-footgun.html)). Django 3.2 attempts to rectify this somewhat and make it easier to work with Django's time zone internals, by supporting non-`pytz` time zones, like the new [`zoneinfo`](https://docs.python.org/3/library/zoneinfo.html#module-zoneinfo) module.

### Setting headers easier

The web is powered by a lot of things, one of them is headers. Changing the headers on a response lets you control the format, caching, security and performance of your site.

Django's header APIs have been a little strange. Prior to 2.1, request headers were read from [`.META`](https://docs.djangoproject.com/en/dev/ref/request-response/#django.http.HttpRequest.META), which contained upper-case versions of the headers, often prefixed with `HTTP_`. That's a syntax which may be familiar to [PHP devs](https://www.php.net/manual/en/reserved.variables.server.php), but us python devs want an API which is a bit nicer. Setting headers on responses was nicer, but relied on pretending the response was a dict, and setting headers directly on that.

```python
>>> response = HttpResponse()
>>> response['Age'] = 120
>>> del response['Age']
```

In [2.1]({{<relref "django-22">}}#requestheaders) the headers could be retrieved from `.headers`, which is a simple dict. In Django 3.2, responses got the same new treatment. Response headers can be set using `.headers` in a nice normal way.

```python
>>> response = HttpResponse()
>>> response.headers['Age'] = 120
>>> del response.headers['Age']
```

### Listing migrations

Django's aptly-named `showmigrations` command lists out the migrations in a project, showing whether they've been run or not. Combining this with [`--plan`](https://docs.djangoproject.com/en/dev/ref/django-admin/#cmdoption-showmigrations-plan) in 2.2 shows you just those which need applying. However, occasionally it's useful to see when the migration was run.

Django keeps track of the applied migrations in the `django_migrations` table (again, apt name). The table notes the Django app, migration name, and when it was applied.

```
 id |     app      |     name     |            applied
----+--------------+--------------+-------------------------------
  1 | contenttypes | 0001_initial | 2021-03-23 11:28:41.238803+00
  2 | auth         | 0001_initial | 2021-03-23 11:28:41.275085+00
  3 | users        | 0001_initial | 2021-03-23 11:28:41.422706+00
...
```

Django's always had this data, and it's been reasonably simple to get it (`SELECT * FROM django_migrations;`), but there's now a better way. In Django 3.0, `showmigrations` can now show the `applied` column, and thus when the migration was applied, without resorting to raw SQL.

### Check for unapplied migrations

Database migrations are one of the pieces which makes deployments hard. For anything high-scale, migrations and the codebase need to be both forwards and backwards compatible. For the few cases where that's not possible, it can be critical to know whether a migration has been run before executing certain bits of functionality.

Now, it's possible to check whether there are unapplied migrations, and do something if not. [`manage.py migrate --check`](https://docs.djangoproject.com/en/dev/ref/django-admin/#cmdoption-migrate-check) will exit unsuccessfully when migrations aren't up-to-date. This was achievable using a mixture of `showmigrations` and `grep`, but the less weird bash I have to write, the better. It's possible to do similar with [`makemigrations --check`](https://docs.djangoproject.com/en/dev/ref/django-admin/#cmdoption-makemigrations-check), to see whether there are any model changes not reflected in migrations.

## Installation

Django 3.2 has now been released upon the world, which means it's time to start upgrading projects. Django 3.2 has very little [backwards incompatible](https://docs.djangoproject.com/en/3.2/releases/3.2/#backwards-incompatible-changes-in-3-2), so it should be a _seamless_ process. Django's lifecycle puts 2.2's end-of-life date around April 2022, which isn't that far away.

![Django release cycle](https://static.djangoproject.com/img/release-roadmap.png)

[Django 4.0](https://docs.djangoproject.com/en/dev/releases/4.0/)'s release is set for the end of this year, and the next LTS April 2023.
