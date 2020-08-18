---
title: Keeping your Docker containers up to date
subtitle: Updating your applications with minimal effort
date: 2020-07-27
tags: [self-hosting, containers]
---

Last year, I switched all of my hosting from arbitrarily installed packages to Docker. This made installing and configuring incredibly simple, but updating a little less defined. Whilst Docker itself is updated through the system package manager (probably), the containers themselves aren't.

Docker container versions are known as "tags", and unlike regular version numbers, can be reassigned to a different container, meaning containers can be updated inside a version constraint, in much the same way a git tag can move to a different commit. This enables a pretty handy feature, whereby container maintainers can create tags for `1.12` and keep it up to date with the latest patch version (eg `1.12.0` - `1.12.99`). As nice as this is, it also adds a layer of complexity. If you're noting that you want version `1.12` of a container, there's no telling if that's actually the _latest_ `1.12.0`. Unfortunately, very few maintainers follow any sane [SemVer](https://semver.org/) for their tags.

When you install a docker container, it's always constrained to a version, which by default is `latest`. If you just `pull` all new containers, those pinned to `latest` will fetch newer versions, but anything pinned to a specific version (`1.12.4`) won't be updated.

So, how can we deal with this?

## Update your tags manually as needed

Well, the obvious way to deal with this is to just keep on top of your tags. When a new version comes out, update the tag in your `docker-compose.yml`, `docker-compose pull`, and then restart the container (`docker-compose down && docker-compose up -d`). This is simple, and robust, and means nothing will update without you knowing.

The downside is that this is obviously quite a lot of work. There are projects which [expose RSS feeds from docker hub](https://docker-hub-rss.now.sh/), but you've still got to go manually update each container and issue a `docker-compose pull`etc.

Here are some examples of the changes needed:

- [Update Synapse patch version](https://github.com/RealOrangeOne/infrastructure/commit/452118e2a9f07b802840e34954e4a8ad9074e694)
- [Update Duplicati LSIO version](https://github.com/RealOrangeOne/infrastructure/commit/ba486a26e4457214509b8682473280d239036cd4)
- [Update Nextcloud](https://github.com/RealOrangeOne/infrastructure/commit/005cc528b6ace28b70197d1d73afb92443d1a1d7)

## Pin to `latest`

This method is probably the most like the conventional package manager approach. If you just pin your versions to `latest`, then you can just periodically pull and restart all containers. Simple, right?

Well yes, but actually no. Pinning latest is generally considered bad practice unless you don't actually care which version it's using. In the event you need to rebuild your infrastructure, there's no way of knowing which version you were actually running (without looking at the hash of the container), and getting back up and running can be just as annoying.

##  `watchtower` (the #YOLO approach)

Docker doesn't have an "update all running containers and restart the new ones" command, which is where `watchtower` comes in. [`watchtower`](https://containrrr.dev/watchtower/) is a tool which automatically fetches the newest version of a container, and restarts it for you with the same settings. `watchtower` won't change tag for you, it'll only update if the container under the tag changes.

By pinning all your containers to `latest` in combination with using `watchtower`, you'll ensure your containers are always up to date 100% of the time. This sounds great, but it's not. If a package releases a major version and breaking changes, your system will update automatically, perhaps leaving itself in a broken, unrecoverable state. Not something you want to wake up to!

## Combination

A more optimal solution is a combination of the above: some containers auto-update, and others are pinned to the versions you need, for when updating isn't straightforward (eg Nextcloud).

So, here's a workflow:

1. Pin your containers as you need them, as loosely as you're comfortable with. If you don't actually care what version it's using, and are confident it can update itself, pin `latest`. If you need a specific patch version for _reasons_, pin that. If you're unsure, pin the latest major version, as anything below it shouldn't have breaking changes, and should be backwards compatible.
2. Use `watchtower` to keep these pins up to date. This ensures `latest` always means `latest`, and that specific pins always reflect upstream, which makes rebuilding easier.
3. Have some way of knowing when new versions are released. Whether that's via [DockerHub RSS](https://docker-hub-rss.now.sh/), [GitHub releases](https://github.community/t/rss-feeds-for-github-projects/292), or something else, it doesn't matter.
4. When new versions are released, bump the pinned version in your `docker-compose.yml` (or alike), and re-deploy (`pull`, `down`, `up -d`).

With this, you'll have a container setup which reasonably matches the package management workflow you're used to, with a couple niceties around auto updating. Only the packages you want to automatically update will automatically update, and the rest you can update when you're notified of updates.

### "But my container doesn't have (sane) versions?"

Unfortunately, all of what I've said above relies on the container maintainer publishing the relevant tags, in a way which you can keep updated. The official containers are great examples of how **to** do pinning: `1`, `1.12`, `1.12.3` and `latest` are all available for use and updated, as all containers should be.

{{<block rant>}}
[LinuxServer.io](https://www.linuxserver.io/) maintain a number of really great containers, but don't maintain these meta versions. You either have to pin to the exact version, including their own versioning (`18.0.4-ls81`) or `latest`.

This makes updating incredibly annoying, and requiring fairly constant updates to ensure the applications work correctly. If you use these containers, and want some slightly better tagging, go show your support: https://github.com/linuxserver/docker-jenkins-builder/pull/50
{{</block>}}

If a container you want to use doesn't expose pinned versions like this, then there's little you can do but ask the maintainer to add some more tags.

## Concluding

Maintaining a docker-based infrastructure is different, especially around updating, but it's a decision I don't regret. Mostly because it means I don't need to care about inter-application compatibility, security or exactly how to run the application, it "just works".

If you put in some work to set up notifications about software updates, it's not too dissimilar to regular package managers, and yet has the nice benefits of keeping some things up-to-date.

I've been running this process for about 6 months, and it's not caused me a single issue. Whilst there are some packages I need (looking at you [LSIO](https://github.com/linuxserver/docker-jenkins-builder/pull/50)!) which I've been forced to pin to `latest`, the rest remain nicely pinned to versions.

You can see all of this in action in my [infrastructure](https://github.com/RealOrangeOne/infrastructure/) repository!
