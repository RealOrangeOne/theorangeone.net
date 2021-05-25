---
title: Website Deployment
date: 2021-05-25
subtitle: How do posts get from my brain to your eyes?
image: unsplash:L4gN0aeaPY4
tags: [self hosting, programming]
---

[My website]({{<relref "/">}}) is a very important project to me. I've written a lot of content over the years, useful both to me and other internet folks. Currently, my website is a static site, powered by [Hugo](https://gohugo.io/). Because it's static, the content is served insanely quickly and handles any insane load spikes like a champ (not that any have happened).

Unlike other platforms like [Wordpress](https://wordpress.org/), [Ghost](https://ghost.org/blog/), or something [more custom](https://fasterthanli.me/articles/a-new-website-for-2020), static sites don't really talk about how to deploy them in production. With that said, here's how mine works:

## Local changes

I do all my content writing locally, in a variety of different tools depending on my mood. Because it's a static site, I can just write the content in markdown anywhere, then bring it into the site repository once it's ready for publishing and do any clean up to make sure it's displayed properly.

And again, because it's a static site, spinning up the whole thing locally is a breeze. I use the dev server both to check the content is rendering properly and to make any non-content changes like styling.

## Push to GitHub

The source for the site lives in a `git` repository, which makes versioning and syncing incredibly simple. At the moment, the [canonical repository](https://github.com/realorangeone/theorangeone.net) lives on GitHub, so yes you can go see all the source (and judge me all you want).

As a developer, I use `git` quite a lot, and know how to do anything I could realistically need to with it. It can be quite a [complex tool](https://xkcd.com/1597/), but it's incredibly powerful.

## Continuous integration

Whenever code is pushed to GitHub, the site is automatically run through CI. For this I use [GitHub Actions](https://github.com/RealOrangeOne/theorangeone.net/actions), as it's completely free for open-source projects, and is nicely integrated with the rest of GitHub. During the build, the site is built and formatting [checked](https://github.com/RealOrangeOne/theorangeone.net/blob/master/scripts/test.sh) it meets my OCD nature. This makes sure that the site works perfectly before it's deployed, so what you read is always perfect (ish).

## Upload to server

Once the site is built, it's not very useful sat in GitHub actions, it needs deploying to the world. Static sites are by their nature stateless - all you need are the files. Given it's me, the site itself is hosted on my own servers.

There are quite literally hundreds of ways to move files between servers. A lot of people quite like using SSH and `rsync`, but for me, I'd rather not do things like that. Key management is annoying, and I normally reject all SSH traffic not over a VPN, which I'd have to change. I [previously](https://github.com/RealOrangeOne/theorangeone.net/blob/33258916726b917ed1f673cd3c6b42c452ef00c8/.github/workflows/deploy.yml#L46) used the AWS CLI to upload to [minio](https://min.io/), but found minio far heavier than I really needed, not to mention that the performance really wasn't great ([over a minute](https://github.com/RealOrangeOne/theorangeone.net/runs/2325913989?check_suite_focus=true) to upload my site).

Once the site is built, I use [`rclone`](https://github.com/RealOrangeOne/theorangeone.net/blob/master/.github/workflows/deploy.yml#L46) to upload it via WebDAV to nginx. WebDAV is a beautifully simple protocol with very minimal overhead, `rclone` is a powerful upload tool and nginx is also incredibly lightweight. The same process is used for my [notes](https://notes.theorangeone.net/), and a couple other sites. The upload process takes just a few seconds, a huge improvement over the previous minio-based approach - I don't know whether this is from minio or `rclone`, but I'm happy with how things work now.

Because the files are uploaded in-place, the deployment isn't blue-green, and it's theoretically possible for a race condition in content, but given the number of requests I get, it's unlikely to happen. I've also not had any reports of it, so it's not really worth looking at yet.

The nginx container is [one of mine](https://github.com/RealOrangeOne/docker-webdav), designed just to be a WebDAV server. Simple, lightweight, secure and protected with basic auth.

## Server

Whilst the uploads are done to nginx, nginx isn't used to serve it - it's far more engineered than that! TLS is terminated using [Traefik](https://doc.traefik.io/traefik/), my [reverse proxy of choice]({{<relref "traefik">}}). But unfortunately it doesn't natively support just serving files like nginx does. So I did a thing...

Requests are served using [`traefik-pages`](https://github.com/realorangeone/traefik-pages), a tool I wrote to serve files from a directory, and [hook](https://github.com/realorangeone/traefik-pages#how-it-works) into Traefik to advertise domains and some powerful middleware. It's a project which is quite complex, and solves likely quite a niche issue, but I think it's super useful - hence writing it. And the icing on the cake: It's written in Rust! :tada:

In the past I've also used a [custom nginx container](https://github.com/RealOrangeOne/theorangeone.net/blob/86dff22e02372554806a7dda61a53ec9e0f3ba1c/Dockerfile), my own GitLab pages, and even nginx on the host.

## Future

I'm not one to really sit still, and keep things the way they are. I've not been especially happy with Hugo for a while, nor my website. I'm likely to completely rebuild it this year, but I don't know exactly how or what in. Given I now professionally build sites with [Wagtail](https://wagtail.io/), I suspect that could play a part.

Until that time, when you see a new post deployed, and get notified about it through [RSS](/index.rss), this is how it happens.
