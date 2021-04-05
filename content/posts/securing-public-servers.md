---
title: Securing public servers
date: 2021-02-11
image: unsplash:HOrhCnQsxnQ
tags: [security, self-hosting]
---

At some point, servers need to be put on the public internet. Whether that be a VPS in the cloud, or your [new homelab]({{< relref "server-2020" >}}). Once a server is on the internet, it's subject to anything and everything the internet has to offer, from botnets to hackers and script kiddies. It's important to know and understand what exactly you can do to keep your servers safe.

The security of a server is especially important if it's sitting in your home, as it could allow an attacker to pivot to any device on your home network, which chances are isn't set up quite as securely. The "S" in IoT does stand for "security" after all! When connecting a server to the internet, there are [some options]({{< relref "exposing-your-homelab" >}}), but those are separate to the tips below, and all should work regardless.

## Methods

### Firewall

The golden rule of managing servers on the internet is to have some kind of firewall protecting your services and networks from the rest of the internet. Whoever wrote that rule knew what they were doing, because they're right. A firewall not only protects your internal devices from the darkness which is the internet, but also protects your servers and the services on them.

Firewalls come in 2 main forms, 1 being on the machine itself, the other being external. For the sake of simplicity, I'm considering the firewalls provided by many VPS providers as being "external", even though yes I'm aware they're not. Both of them achieve the basics of blocking all ports besides a few specific ports you want open, and potentially only allowing certain IPs to use them. If for some reason your VPS provider doesn't provide you with a firewall, run away from them as fast as you can.

Where possible, I prefer to use an external firewall. Not only does this mean traffic gets blocked before it ever reaches my servers, but it also means configuration on my machine can't accidentally get around it. Docker famously doesn't play nicely with many iptables-based firewalls, as it overrides and ignores your firewall.

As far as OS-level firewalls go, almost all of them wrap `iptables` in some form.  `iptables` is famously hard to configure, so `ufw` is a simple wrapper which makes it that bit simpler. Is it worth learning `iptables` and skipping the abstractions? Maybe. Check out [2.5 admins](https://2.5admins.com) [episode 24](https://2.5admins.com/2-5-admins-24/) for a discussion on it far better than I can provide.

To get a sense of your open ports, you can use `nmap` or [shodan.io](https://www.shodan.io/).

#### VPN

Sometimes, you want to access things from outside your network, but not expose it to the internet fully. For example, you may want web traffic accessible to anyone, but only you to access SSH. The simplest way to do that is with a VPN, tunnelling traffic through a single port opened on the firewall. Both [WireGuard]({{< relref "wireguard-haproxy-gateway" >}}) and [nebula]({{< relref "nebula-intro" >}}) are great options for something like this. Alongside SSH, this may also be useful for web applications, if you only allow access to VPN IPs.

This is far from an all-or-nothing type deal. If you just want to give access to your Jellyfin server from outside the house, that's fine (and probably doesn't need a VPN). By mixing firewalls and IP restrictions, it's simple to achieve this opt-in publicity.

### Fail2ban

Many commercial service APIs have some form of a rate limit to prevent abuse. If your applications are overloaded it can either lead to a denial of service, or someone brute-forcing your credentials. Enter [`fail2ban`](https://www.fail2ban.org/wiki/index.php/Main_Page), which allows you to apply rate limits at the network level, so your applications neither know nor care they're being limited. `fail2ban` uses `iptables` to do the actual blocking, and blocks based on IP address, so the blocks are performant and low-overhead.

This also means you can limit things in more interesting ways, and for arbitrary network traffic like SSH. By enabling fail2ban, you can prevent brute force attacks on your SSH server, and block users after a certain number of tries.

Fail2ban knows how to integrate with a number of services out of the box, but it's simple to add an integration with any service through log files and `systemd` services. Take this SSH configuration:

```ini
[sshd]
enabled  = true
bantime  = 600
findtime = 30
maxretry = 5
port     = 7743,ssh
ignoreip = 10.32.32.0/24
```

This configuration will ban someone for 10 minutes if they attempt to authenticate over SSH more than 5 times in a 30-second period. However, connections from `10.32.32.0/24` won't be tracked and will always be allowed through, which is useful in ensuring you don't block yourself out. Just be careful not to ignore too many IPs!

### Geofilter

Especially in the current climate, moving around doesn't happen a huge amount. Chances are if someone's trying to access my services from Australia, it's probably not me. Armed with this assumption, it's possible to eliminate a number of threats by just blocking all connections from Australia, or more specifically blocking connections from anywhere other than the UK (where I live).

Reducing the number of devices who are allowed to even connect to your servers massively reduces the attack vector at the cost of annoyances. If I do find myself in Australia, I'm doomed! If you're deploying this, you also need to consider who else you want to access your services and ensure they have access. If you've got users in the USA and Germany, gotta make sure they're allowed too! It's for this reason I don't bother geoblocking my servers, but [the tools are there](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-by-geoip/).

Geofilters generally require support from your reverse proxy, so they can be applied to specific ports or connections. If you want to apply it to services which don't have support, nginx's `stream` directive may be ideal to put in between the outside world and the service, for example SSH.

### HTTPS

Running services on your LAN over HTTP is "fine" (well, it's not, but [one thing at a time]({{< relref "lan-only-applications-with-tls" >}})), but as soon as it's on the internet, it should be encrypted using HTTPS. If you need to use other protocols, ensure there's some form of encryption layer (usually TLS) over the top too.

#### Redirects

Any self-respecting reverse proxy will let you configure redirects to immediately redirect HTTP traffic to HTTPS before the upstream services can do anything. This prevents any traffic being sent unencrypted. As soon as you visit your sites you'll be automatically redirected to the secure version without doing anything.

You may also want to only listen for HTTPS traffic and completely ignore HTTP, but in my experience that causes more annoyances than it's worth.

#### Versions

Not all SSL is created equal. In fact, if you are actually using SSL, then you're doing something very wrong. Whilst the terms are used interchangeably, nowadays most things which claim to use SSL are actually using TLS, its successor. Most web servers will still happily accept SSL connections by default, but much like SSL, not all TLS is created equal. All versions of SSL along with versions of TLS before 1.2 are considered "broken" and should not be used. Unless you're specifically trying to support incredibly old clients, restricting the TLS versions to just 1.2 and 1.3 adds a lot of extra security whilst affecting almost no users.

Qualys have a [great tool](https://www.ssllabs.com/ssltest/) for checking the versions supported by your web server.

#### HSTS

Along with redirects, you can set an [HSTS](https://developer.mozilla.org/en-US/docs/Glossary/HSTS) (HTTP Strict Transport Security) header on your applications. The HSTS header informs the browser to remember to only ever connect over HTTPS for a certain period of time. This means that after the first connection, your browser won't even attempt to connect over HTTP, it'll immediately redirect.

You do have to be careful setting this header, as because it's remembered by all browsers, unsetting isn't really possible until the time runs out. If your TLS stops working and you need to check things over HTTP temporarily, you're out of luck without clearing bits of your browser storage.

For example, my nextcloud server sends:

```yaml
strict-transport-security: max-age=15552000
```

Which will prevent my browser from making insecure connections for at least 6 months.

HSTS unfortunately only works _after_ the first connection meaning new visitors or those with new devices / OS installs won't benefit from the protection. The Chromium project maintain an [HSTS "Preload"](https://hstspreload.org/) list, which is hardcoded into almost all browsers. This list instructs browsers to always use HTTPS, regardless of whether they've visited the site before.

### Honeypot

Honeypotting is the idea of adding a fake system or service, which serves only to attract potential attackers and steer them away from your actual services. Honeypotting generally works either by either giving them a dummy service to expend time attacking, or with something entirely fake purely taking up an attacker's time, so they won't be attacking yours or someone else's actual services.

[`endlessh`](https://github.com/skeeto/endlessh/) is an SSH tarpit designed to take up valuable time and resources of the attacking machine, leaving yours free to service actual requests. `endlessh` isn't an SSH server, but instead pretends to be one just enough send a slow, random SSH banner, locking up the attacking machine for hours or even days. This could even be tied in to [`fail2ban`](#fail2ban) and immediately blocking connections to `endlessh` from hitting any other ports, as no real user should be using that port. Personally I run `endlessh` on port 22, and my actual SSH server on something else.

An alternative honeypotting technique is simply to redirect to random URLs, to both entertain and annoy an attacker. For example, have you ever been to [stackoverflow.com/wp-login.php](https://stackoverflow.com/wp-login.php)? Anyone familiar with stackoverflow will know it's not a wordpress site, but that doesn't stop them accepting requests at `wp-login.php` and trolling anyone trying to scan the internet for wordpress.

### SSH Hardening

SSH is the most common window into a server, allowing you shell access to a machine you're not sitting in front of, securely. Or at least, SSH _can_ be secure. The defaults for SSH are _ok_, but they're not great, and definitely not suitable for internet-facing applications.

The exact ways of hardening your SSH configuration are very well documented, but biggest 2 wins are to disable password authentication and root login. We live in a world where `sudo` exists, so there are very few reasons to be root and fewer still to log in as root. Choosing a secure SSH password is great, but no password is going to be quite as secure as an SSH key.

Another big win is to change the port SSH listens on, 22 by default. Anyone with a free half hour can do a scan of the internet and try thousands of common username and password combinations, wasting CPU time and inflating your access logs. By moving it to a non-standard port, you're not necessarily making it harder for a skilled attacker, but novice bots won't bother checking alternative ports. This pairs rather nicely with the previously mentioned [`endlessh`](#honeypot).

If you're feeling especially paranoid about your SSH configuration, I recommend `ssh-audit`, which shows if you're using an insecure version or weak ciphers.

For those interest, [this](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/base/files/sshd_config) is my SSH config.

### Updates

It feels like something I shouldn't have to say, but installing updates is an incredibly important part of security. Security is a moving target, what used to be secure chances are isn't (remember when `sha1` was "unbreakable"?). The only way to keep your systems secure is to keep your applications updated. For stability, this doesn't mean running the latest version, but at least running something with up-to-date security patches. For example Debian distributions will often run much older versions of software, but thanks to the hard work of the Debian project, security fixes are usually backported to older versions.

Not all applications update in the same way - it depends massively on how you installed them. Sometimes it's all through the system package managers, others might be through Docker, `pip` or just downloading a static binary. It's best to know exactly how your applications are installed, and that they're as simple to update as possible.

Some package managers will allow you to install security updates automatically. This way you can ensure you're always up-to-date on security patches, without updating the entire system, which could result in instability. `apt` is great at [doing this](https://ostechnix.com/install-updates-security-patches-automatically-ubuntu/).

### Bots

I've mentioned "bots" quite a lot in this post, but what are they? Really a bot is just a program designed to emulate human interaction, either to find security holes, gather information or just waste your time.

At its core, Google (search) is powered by a bot designed to scan the internet and report findings back to build a search index. For my website, I want this bot all over my website - a great deal of traffic to my website comes from search engines, but does my nextcloud server really need to be indexed by Google? No, no it does not. Note that Google would only be able to index the public URLs like the login screen, but still I don't really want or need that appearing in search results.

{{<block remember>}}
[Other](https://duckduckgo.com/) search engines also available
{{</block>}}

[`robots.txt`](https://www.robotstxt.org/) is a standard file which instructs bots what to try and index and what not to. Pinning things down either by the path or user-agent of the bot. Unfortunately, This won't block intentionally malicious bots, as `robots.txt`is more guidelines for bots rather than anything enforced, but it will block legitimate crawlers. By blocking at least some bots, you can greatly reduce traffic load on your sites as well as prevent your "internal" sites from appearing in search results.

This website's [`robots.txt`](/robots.txt) is set up to allow everything. If you didn't want that, it's as simple as changing `Allow: /` to `Disallow: /`.

{{<block remember>}}
Security through obscurity is no security at all.
{{</block>}}


Note that `robots.txt` will obviously only work for web traffic. For other kinds, you'll need to rely on [`fail2ban`](#fail2ban), however bots for other types of traffic are far rarer, and generally far less malicious.

## How necessary is all of this?

Personally, I'm of the opinion you should at least _try_ to do everything you can to secure your systems. No matter how much you think you might not be a target, access to your systems or data is always valuable to someone, if only to sell or mine cryptocurrencies. Some of the things I've outlined above are more for the tinfoil-hat wearing crowd, but nothing is strictly incorrect, nor will it cause you major issues, and the majority are universally useful to all.

Following at least some of the tips above **will** make your servers at least slightly harder to "hack". Does it make it impossible? Not by a long shot - But it's never "impossible", just very difficult. It's all about return on investment. Given an infinite amount of time and resources, your devices **will** be compromised. The best you can do is raise that barrier of entry to deter all but the most motivated (or financially backed) attackers, whom you couldn't do anything to stop anyway.
