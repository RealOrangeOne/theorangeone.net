---
title: Docker Website Server
repo: RealOrangeOne/docker-website-server
subtitle: Static file server designed for serving websites
---

If you, like me, have a website, you'll probably need some way of serving it. And if, like me, your website is static, `nginx` is a great, lightweight and insanely fast file server. But, how do you configure it? Sometimes, you just don't care, and want someone else to do it for you - like me!

{{<block irony >}}
This website doesn't actually use this container - It does [something else]({{<relref "website-deployment-process">}}).
{{</block>}}

## Why not just use `nginx:latest`?

If you're not really bothered, the default [`nginx`](https://hub.docker.com/_/nginx) container will work just fine for you, however this container has a few modifications which make it more suited to serving sites:

- Use environment variables for customization
- Healthcheck endpoint
- GZIP and Brotli support
- Serve pre-compressed files
- Use `X-Forwarded-For` header when getting client IP

{{% repobutton %}}

Note this isn't designed to merely serve files. If you want to just serve files, take a look at  [`docker-static-server`]({{<relref "docker-static-server">}}).
