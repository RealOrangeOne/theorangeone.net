---
title: Docker Static Server
repo: RealOrangeOne/docker-static-server
subtitle: Static file server designed for serving files not websites
---

Sometimes, you just need a simple container to host some static files. Whether that be files for download, images to show, or a directory of files.

## Why not just use Nginx?

If you're not really bothered, the default [`nginx`](https://hub.docker.com/_/nginx) container will work just fine for you, however this container has a few modifications which make it more suited to serving static files:

- Use environment variables for customization
- Healthcheck endpoint
- GZIP all files
- Use `X-Forwarded-For` header when getting client IP

{{% repobutton %}}

Previously I had created [`tstatic`](https://github.com/RealOrangeOne/tstatic) to do this, but Nginx is far better as a server than node. The less node in my stack, the better!

Note this isn't designed for serving websites. In fact, design decisions were made which make it really bad for websites. If you want to serve websites, take a look at [`docker-website-server`]({{<relref "docker-website-server">}})
