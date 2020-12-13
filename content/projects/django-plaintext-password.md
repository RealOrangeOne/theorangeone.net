---
title: Django Plaintext Password
repo: RealOrangeOne/django-plaintext-password
subtitle: Store your passwords in Django in plain text! Because reasons...
---

It's [well known]({{< relref "how-to-store-passwords" >}}) that storing passwords in plain text is a bad idea, A *really* bad idea. For production applications, there really is no excuse for it.

Really, there's no real reason for this module to exist. Although there are a couple reasons it might be handy. For example, during tests. If your unit tests create a large number of users, or you're only creating a few users but have a lot of tests, you can get quite a performance improvement by setting a password hasher.

{{% repobutton %}}

For obvious reasons, there's a [check](https://docs.djangoproject.com/en/dev/topics/checks/) provided with the package to prevent its use in a production environment. Just in case someone is crazy enough to try (or does it by accident).

## How does it work?

By default, Django will store the password password123 in a format similar to:

```
pbkdf2_sha256$216000$gd57n4OWJrXh$Xs/TqhwJICOxsLONGlKXorjuWccooiuJmJOUaxbwcOQ=
```

This is good for security as the password has been both salted and hashed before being saved into the database, making it almost impossible to retrieve the original password. This library however, stores the password as-is:

```
plaintext$$password123
```

This makes searching by password possible, as well as comparing users passwords and allowing you to email users their passwords if they forget them - neat!

Changing the password hasher from the default PBKDF2-SHA512 to a simpler unsalted MD5 can bring a nearly 50% speed-up in tests. `django-plaintext-password` is designed to be even faster, both in hashing passwords (or not as the case may be), and in comparison (by not using [`secrets.compare_digest`](https://docs.python.org/3/library/secrets.html#secrets.compare_digest)).

## Benchmarks

These benchmarks were run on [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners#cloud-hosts-for-github-hosted-runners), using Python 3.9 and Django 3.1.

```
-------------------------------------------------------- benchmark 'test_make_password_performance': 5 tests ---------------------------------------------------------
Name (time in us)                                          Min                     Max                    Mean                StdDev                     OPS
----------------------------------------------------------------------------------------------------------------------------------------------------------------------
test_make_password_performance[plaintext]               1.1000 (1.0)          416.0000 (1.0)            1.4847 (1.0)          2.0765 (1.0)      673,557.9450 (1.0)
test_make_password_performance[unsalted_md5]            2.0000 (1.82)       1,539.7000 (3.70)           2.4725 (1.67)         7.9929 (3.85)     404,451.5903 (0.60)
test_make_password_performance[unsalted_sha1]           1.9000 (1.73)       1,302.8000 (3.13)           2.9199 (1.97)        11.0522 (5.32)     342,474.7830 (0.51)
test_make_password_performance[pbkdf2_sha1]        99,171.6800 (>1000.0)  110,000.3790 (264.42)   103,357.5339 (>1000.0)  3,546.0440 (>1000.0)        9.6752 (0.00)
test_make_password_performance[pbkdf2_sha256]     151,467.7660 (>1000.0)  168,037.7630 (403.94)   157,480.9086 (>1000.0)  5,975.3254 (>1000.0)        6.3500 (0.00)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------
```

```
--------------------------------------------------------- benchmark 'test_check_password_performance': 5 tests --------------------------------------------------------
Name (time in us)                                           Min                     Max                    Mean                StdDev                     OPS
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
test_check_password_performance[plaintext]               1.8000 (1.0)          251.6040 (1.0)            2.3724 (1.0)          1.6704 (1.0)      421,520.4074 (1.0)
test_check_password_performance[unsalted_md5]            4.0000 (2.22)         543.2000 (2.16)           4.6860 (1.98)         4.2452 (2.54)     213,400.5405 (0.51)
test_check_password_performance[unsalted_sha1]           3.8000 (2.11)         556.7090 (2.21)           5.0706 (2.14)         4.9180 (2.94)     197,214.0655 (0.47)
test_check_password_performance[pbkdf2_sha1]       101,769.3860 (>1000.0)  106,992.6850 (425.24)   103,438.6452 (>1000.0)  1,640.9670 (982.38)         9.6676 (0.00)
test_check_password_performance[pbkdf2_sha256]     153,384.4760 (>1000.0)  157,334.1760 (625.32)   155,635.7613 (>1000.0)  1,661.6355 (994.75)         6.4253 (0.00)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
```

`django-plaintext-password` is around twice as fast as the built-in MD5 hasher.
