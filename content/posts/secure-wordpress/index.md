---
title: Creating a fast, secure WordPress site
date: 2018-10-08
---

In terms of security, [WordPress](https://wordpress.org), and PHP in general for that matter, have become a bit of a [joke](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/). If you want a site to be secure, people tend to steer clear of WordPress and PHP. That being said, nothing stands even close to WordPress with regards to plugin support, community size, and documentation. As much as we may not like it, I think WordPress isn't going anywhere.

Recently, I was approached by an old friend to setup a small-scale online store and blog. After doing lots of research into cheap, static options, I eventually settled on WordPress and WooCommerce, on the advice of a colleague. Having never setup a site like this, which relies on being secure, and fairly fast, it was going to be a challenge, and doing it on a shoestring budget was going to make things harder!

And so, after 2 weeks of on-and-off poking, research, re-installation and optimisation, and [an oddly timed twitter thread with @CryptoSeb](https://twitter.com/CryptoSeb/status/1035611479800721408), I eventually settled on a setup on how to do it which is secure, fast, and satisfies my inner DevOps' OCD.

## OS

Decisions on the OS are fairly simple. For my site, I used Debian. In part because I'd not used it extensively before, and wanted to see if there were any benefits to Ubuntu, my go-to alternative, but also because it's considered to be dependable and secure. The Debian repos are some of the largest, containing any application I could need for a project like this, all of which have been well tested.

There's nothing about this project, or article, which is Debian specific, or even Linux specific. Running this on something like FreeBSD would work great (and debatably be more secure). Theoretically it's possible to run all these applications on a Windows server. But running a windows server by choice seems crazy to me!

## Web Server

Most WordPress tutorials I came across used Apache2 as the web server. The tutorial I used was from [Debian](https://wiki.debian.org/WordPress), so I assumed it contained best-practices. After doing almost all the setup with Apache, page loads were hitting around 10 seconds (wish I'd recorded some actual benchmarks now!), which is far from ideal! After playing around with a couple [cache] plugins, they didn't make much difference, even with a warmed browser cache.

I tried doing a re-install on a fresh machine, served using NGINX and `php-fpm` instead, dropped page loads down to 1.3 seconds without a cache, and 140ms with! The installation notes I used for that came from the wonderful people at [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-with-lemp-on-debian-9).

The other benefit of NGINX, besides sheer speed, is that it's much simpler. Apache2 has a lot of additional extensions which allow it to do incredible things, most of which we don't need. Because NGINX is much simpler, most of the computation is offloaded to `php-fpm`, which is designed specifically to do these kinds of things. Keeping the processes running the application, and the processes handling things like web routing and SSL separate is almost certainly a good thing.

### HTTPS

Any site should be using HTTPS now. With services like LetsEncrypt, there's really no excuse! The fact that certificates can be issued, revoked, renewed and installed, all with a simple command-line interface, removes almost all friction. [`certbot`](https://certbot.eff.org/), the main client for LetsEncrypt, automatically detects the sites in your NGINX configuration, and modifies them with the correct and secure configuration for your certificate.

### HTTP2

[HTTP2](https://http2.github.io/) brings a lot of performance improvements over HTTP 1.1. Enabling it in NGINX is as simple as adding `http2` to the `listen` statement, and WordPress with automatically detect it and optimise. If you require support with very old browsers and OSs, then you may not want to enable this. HTTP2 is very different to HTTP 1.1, both in its structure, and feature-set.

## Database

WordPress only supports MySQL, so that's what we have to use. In the Debian repositories, Oracle MySQL is replaced by MariaDB. I've not had much experience with either, and so I can't really tell the difference, but I trust the Debian team that the decision was correct. MariaDB is designed to be an almost-perfect drop-in replacement, so I'm just going to call it MySQL to avoid confusion!

If you're running MySQL anywhere, you should have run [`mysql_secure_installation`](https://dev.mysql.com/doc/refman/8.0/en/mysql-secure-installation.html). If you've not, then go run it now! In simple, the script hardens your install against common MySQL configuration issues.

When it comes to creating the database for WordPress, it's really very simple. Just be sure to use a secure password, and you're set!

## Wordfence

In simple terms, Wordfence is a firewall for WordPress. It monitors the requests to your application, and blocks suspicious activity, and attempts to block brute-force attempts. The nicest feature I found was the check for commonly exposed configuration files, and prompting to remove them.

{{< resource src="wordfence.png" >}}
Categories Wordfence protects
{{< /resource >}}


## Validate your work

After you've setup your site, you're going to want to give it a test from the outside, to make sure everything's setup correctly.

### `wpscan`

[`wpscan`](https://wpscan.org/) is a command-line tool which scans your WordPress site, and reports any issues with exposing too much information, vulnerable plugins, or just bad configuration. Simply point it at your domain, and set it loose.

### `nmap`

[`nmap`](https://nmap.org/) is a tool to assist with service and device discovery on a network. `nmap` can be pointed at a server, and inform you of services it has open, and what ports they're listening on. This let's you check there's no additional services running on your server that you've not secured. This isn't exactly, but if you want to be super paranoid, and cover all bases, you might as well.

```
$ nmap ******
Starting Nmap 7.70 ( https://nmap.org ) at 2018-10-06 21:58 BST
Nmap scan report for ***** (***.***.***.***)
Host is up (0.047s latency).
Not shown: 995 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
554/tcp  open  rtsp
7070/tcp open  realserver

Nmap done: 1 IP address (1 host up) scanned in 0.69 seconds
```

## Updating

When managing a server running applications such as this, it's important to stay updated. WordPress handles its own updates, so updating WordPress and its plugins can be done through the web application. Jetpack is a plugin by WordPress, which links your site to [wordpress.com](https://wordpress.com) and allows it to monitor plugin versions, and alert you when plugins require updating.

The rest of the applications installed on the server can be handled through your OSs package manager (in my case, `apt`).

WordPress gets a lot of bad reputation with regards to security. But it's more than possible to create something secure, if you make sure to use trusted and battle-tested applications, highly regarded plugins, and don't let your clients install plugins for themselves!
