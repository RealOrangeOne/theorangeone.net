---
title: Self-hosting static websites
date: 2021-08-05
image: unsplash:5cFwQ-WMcJU
tags: [self-hosting]
---

Static sites, ie those which are just files on disk rather than requiring a custom application or database to run, are incredibly simple to write. You can either do it yourself from scratch with a bunch of HTML, CSS and JS files, or use a [generator](https://jamstack.org/generators/) like [Hugo](https://gohugo.io) or [Zola](https://www.getzola.org/). However, it's all well and good having written your site and made it look exactly how you want. But how do you deploy it? Or more importantly, how do you deploy it _yourself_?

The gist of running a static website requires 2 things:

- Some way to get the content you write up to the server
- Some way to serve the files to your users

Naturally, there are several ways of doing either, all with their own pros / cons.

## File Server

A file server does exactly what you think it does: It serves files. It takes the various files which make up your website and expose them over the network to users.

Perhaps the most commonly used is [nginx](https://www.nginx.com/) for its simplicity, versatility and performance. However, both [apache](https://httpd.apache.org/) and [caddy](https://caddyserver.com/) would equally make great solutions. Pick the one you're most comfortable with. If you're already running Docker (or alike) on your server, you can also run the server as a container, making administration that bit easier, as well as providing some process isolation. Performance wise there should be absolutely no difference between running the server on the host and inside Docker, unless you're dealing with enormous numbers of users.

Whilst nginx, apache and caddy all support serving static files out the box, there are definitely things you can configure to make both yours and your users lives better, whether that be transport compression, directory listing, auto index pages or low-level tuning. If you're using Docker, and don't feel like configuring them for yourself, I've written some simple containers designed both for [web serving]({{<relref "docker-website-server">}}) and [file serving]({{<relref "docker-static-server">}}).

_"But wait!"_ I can hear you yelling. _"My static site generator has a dev server. Can't I just use that?"_. Technically yes, but you **really** shouldn't. Writing a high performance production-grade web server is a difficult thing, and so most generators don't. The servers they come with are designed purely for local development to preview your changes. Some are definitely pretty fast, but you're far better off using a server designed specifically for it like nginx. This is particularly true for tools written in Python or Node.js. Hugo's is still pretty fast, yet still falls short of even a stock nginx config by nearly 20%:

| Server | Requests per second | Average response time |
|--------|---------------------|-----------------------|
| [Python `http.server`](https://docs.python.org/3/library/http.server.html) | 674 | 74ms |
| [Hugo](https://gohugo.io) | 14k | 3ms |
| [Caddy](https://caddyserver.com/) | 14k | 3ms |
| nginx (stock) | 17k | 2.8ms |
| [Parcel bundler](https://parceljs.org/) | 5k | 9ms |
| [Gatsby](https://www.gatsbyjs.org/) | 2k | 23ms |
| [mkdocs](https://www.mkdocs.org/) | 2k | 26ms |
| [node `serve`](https://www.npmjs.com/package/serve) | 1.5k | 29ms |

(All tests done locally using [ApacheBench](https://httpd.apache.org/docs/2.4/programs/ab.html): `ab -n 20000 -c 50`)

Performance isn't everything, however. These servers likely don't have the level of tuning customization available to other servers designed for it, meaning any changes you want or need to make are completely out of the question, for example setting the required headers for a high ranking on [securityheaders.io](https://securityheaders.io).

## Transports

A server really is only half the task - Now you need some content to serve. You've created your site however you like, and now need to upload it to the server, so it can be seen by the world. As with everything, there are a variety of different ways to achieve this - it all depends on what you want and what you're comfortable with. Fortunately it's possible to think of this completely separately from the above server. So long as the files end up in a directory on the filesystem, the server will be happy, no matter how you get them there.

### SSH

Of course, there's good ol' SSH. Chances are, you're already using SSH to administer your server, so why not push files up with it?

Well, for exactly that reason. Providing SSH access to a machine allows the user to do more than just upload files. Yes it's possible to restrict the access down, but it's still there, waiting for some security vulnerability. Providing SSH access can also be a little more annoying, as it requires generating and sharing keys, rather than a shared password.

SSH is however just the transport protocol. The files themselves will either be uploaded through `scp` which is super simple, or `rsync` which requires installation, but provides many more features such as transport compression, deleting files which don't exist locally, and only syncing files which have changed, all of which are pretty useful when syncing a static site.

### WebDAV

WebDAV isn't the most well-known protocol, but it's incredibly powerful. WebDAV is a file transfer protocol much like FTP, but over HTTP. This enables you to not only route it using regular techniques like reverse proxies and TLS, but also can be found in many web servers and applications. For example, WebDAV is the file protocol used by [Nextcloud](https://nextcloud.com) to sync files.

For the server itself, nginx has an [additional module](https://nginx.org/en/docs/http/ngx_http_dav_module.html) which can be installed to serve files in the `root` over WebDAV. Authentication for WebDAV takes the form of basic auth, so nice familiar nginx constructs can be used. You can even setup constructs like read-only users, groups and many more. Nginx's WebDAV module will happily run alongside any other `server` blocks, meaning you can reuse nginx for any other sites you have. You probably don't want to share the `server` block for WebDAV with the one for serving your site, else your users will be forced to authenticate.

From the command line or CI, the easiest way to upload to a WebDAV server is [`rclone`](https://rclone.org/). Rclone is a great tool capable of uploading not only to WebDAV, but a bunch of other servers and even cloud storage providers. Simply add some configuration (through environment variables or a config file) and run the command to start transferring - like I do [here](https://github.com/RealOrangeOne/theorangeone.net/blob/master/.gitlab-ci.yml#L61).

### S3-compatible

When I say "S3", most people think [AWS](https://aws.amazon.com/s3/), and therefore not really self-hosted. And yes, you'd be correct. S3 is a commercial service from AWS, but so many applications have copied its storage API, so that anything which can talk to S3 can talk to them instead. And whilst many of these take the form of alternative object storage platforms like [DigitalOcean](https://www.digitalocean.com/), [Vultr]({{<referralurl vultr>}}) and [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html), there are self-hostable servers like [Minio](https://min.io/).

Minio creates an S3-compatible object storage server on your own infrastructure, meaning you can use either the AWS CLI or tools like `rclone` to upload to it. Whilst S3 does natively allow serving websites from it, minio doesn't. Fortunately however, minio's storage is entirely flat in the filesystem, meaning the bucket is just a directory, meaning it's simple to point one of the previously mentioned servers to it, and you're good.

Minio is pretty lightweight, but in my experience it still uses a little more memory than I'd want in something to minimal. It is also slightly more complex than some other methods, especially as it limits the clients used. Fortunately you can create specific access tokens which only have access to certain sites, meaning you only need to give repositories access to the bucket they need, rather than everything.

## Something a bit different

Whilst the most common way to achieve this is with a simple file server serving files from a directory, there are a couple slightly different options which trade complexity and simplicity for additional features.

### GitLab Pages

Now, this does require self-hosting GitLab, as opposed to [gitlab.com](https://gitlab.com), but the integration between GitLab and [GitLab pages](https://docs.gitlab.com/ee/administration/pages/) is as superb, as you'd expect. In much the same way as with gitlab.com, you simply need a CI task which creates an artefact in the `public/` directory, and GitLab handles the rest.

Behind the scenes, GitLab places this artefact in a specific location, which is read by GitLab pages to serve. If you're using the Omnibus deployment, and intend to serve your sites on the same machine, all done. Just expose the pages port to the world, and you're set. If you're not however, there's an extra step.

GitLab pages is still a bit restrictive, in that you can't mix it with sites not built with GitLab, nor does it give you full control over the domain and path (the same restrictions apply as they do with gitlab.com). But for a fully integrated solution, it's pretty great.

### Dokku

[Dokku](https://dokku.com/) is a free and minimal Platform as a service (PaaS) you run on your own infrastructure. Dokku allows you to simply push up some code (with `git`!), have its build steps detected, build the project and deploy the project with little to no configuration. Or if that's not what you want, you can just push a repository with a `Dockerfile`, and it'll build and deploy that instead. To discover and build projects, Dokku uses [herokuish](https://github.com/gliderlabs/herokuish), which has the name suggests, is a copy of [Heroku](https://heroku.com/)'s deployment model, meaning you can take advantage of the plethora of [buildpacks](https://elements.heroku.com/buildpacks) people use on Heroku to build your site exactly as needed, or just write one yourself.

For example, if your site is written in a Node.js-based generator (Gatsby, eleventy etc), Dokku will checkout your code, run `npm ci`, `npm run build`, cache your dependencies then start routing traffic to `npm start`. As I mentioned above, `npm start` probably isn't what you want - but fear not, there's [a buildpack for that](https://github.com/heroku/heroku-buildpack-static)!

Possibly my biggest gripe with Dokku is that it takes over the whole OS. You definitely don't want to be running anything else around it. Not a huge deal, as it's lightweight enough to run on basically anything, just something to bear in mind. With that said, Dokku is very versatile, meaning it can be used for running almost anything, and even has plugins for things like PostgreSQL, automatic TLS through LetsEncrypt, and Redis. This means you can serve your static sites using it, and any other applications just besides it. I personally wouldn't use it to run large, externally developed applications, but scripts etc I've written myself, it works great.

### Baked into a container

If you're going to put the file server in a docker container to serve your files, and upload them using [_something_](#transports), why not just bake the site into the container in the first place? Yes this means you have to run 1 container per site, but in some cases, eg Traefik, that may be a good thing, not to mention that it allows a deeper level of customization and integration with said file server.

Instead of having say a generic `nginx` container on your server, and then use `rsync` to push your site changes, just embed the site into a container, push it to a registry, and then pull it from your server. Using multi-stage builds, this can even be done without needing the build environment either, so it's just nginx and your files. Need some specific settings or headers for this site? Simple. Require that the site be updated in full rather than potentially having half a site deployed? Easy. Depending on your restart mechanism, it can mean a small amount of downtime, but should be pretty minimal.

This all sounds good, but presents a problem. Whilst it's incredibly easy and well documented to have CI automatically build a container and upload it to a registry - how do you get that container onto your server automatically? Well, there are a few ways to do this. A tool I've used in the past is [watchtower](https://github.com/containrrr/watchtower), which watches for changes on the registry, and automatically pulls and restarts the container. When using watchtower, you want to make sure it's scoped to only pull changes for the containers you want, not everything. Simply pinning `latest` and relying on watchtower is **not** a stable update mechanism, there are [better ways]({{<relref "keeping-docker-containers-updated">}}). Some other more reliable solutions would be to have CI SSH in and pull itself, have `cron` run `docker-compose pull && docker-compose up -d` (or alike), or use something like [`webhook`](https://github.com/adnanh/webhook) to pull the changes on the hit of an endpoint.

### Traefik Pages

Earlier this year, I was reinstalling GitLab, and trying to work out a solution which allowed for simple provisioning of sites, simple deployment, and incredibly fast. Unfortunately, I couldn't quite find anything to suit my needs, so naturally I wrote something myself.

[Traefik Pages](https://github.com/realorangeone/traefik-pages) is a static file server which deeply integrates with Traefik to tell it what domains to route. This way, Traefik deals with complex things like TLS termination, whilst Traefik Pages deals with serving the files and switching based on domain. Just as importantly, it meant this configuration could sit beside the existing applications I had behind Traefik, unlike Dokku and in a way GitLab Pages.

## So, which is best?

Well, that's a difficult question - and by difficult I mean impossible. In this case, much like many, "best" is subjective. Above almost all else, use the solution you're most comfortable with and scales for your use case. If you value simplicity and don't want to faff, nginx + SSH will serve you well. Want some more flexibility and security, perhaps WebDAV, or docker. Or want to serve other things completely different alongside in a much more versatile environment, go Dokku. It's entirely up to you.

If you're interested in how I run this website (a static site powered by Hugo), check out my [post about it]({{<relref "website-deployment-process">}}). At time of writing, most of my other small static sites run under Dokku.
