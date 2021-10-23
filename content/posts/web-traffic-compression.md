---
title: Compressing your server's web traffic
subtitle: Save some bandwidth across your network
date: 2021-10-23
tags: [self-hosting]
image: unsplash:eIlJ2CtQezU
---

The internet is a [pretty big place](https://www.internetlivestats.com/) - a huge amount of data (approximately [131TB per second](https://www.internetlivestats.com/one-second/#traffic-band)) is transferred over it every second of every day. The backbone of the internet is designed to transfer huge amounts of data, but people are impatient creatures, and want data as quick as possible. To speed up data transfer, there are 2 ways to do it: Send less data, or send it faster. Sending it faster often hits limits out of your control, particularly if you have a particularly stingy ISP. This is where compression comes in. By compressing data, the same amount can be transferred in less amount of time, by trading off a bit of compute at either end.

As far as web traffic goes, there are 2 main compression algorithms: gzip and brotli. Brotli is more effective than gzip, however is slower to operate. Because of this, it's more common to see brotli used for compressing static files, and gzip for on-the-fly compressing dynamic content.

The exact support depends on the browser (almost all modern ones support [brotli](https://caniuse.com/brotli) and [gzip](https://caniuse.com/sr_content-encoding-gzip)), but if a client doesn't support a specific algorithm (it sends the ones it does in the `Accept-Encoding` header), then the server won't respond with it. It's also well know that some files don't compress well at all, hence many servers only compress certain file types, and even then only send the compressed data if it's actually smaller. This way, enabling compression is 0 risk.

Take a look at this website for example. Loading this page (just the HTML) transferred 5.23KB, but the file is actually 15.32 KB, and you didn't even notice a difference. Loading the whole page, assets and all should have been 2.1 MB, but only transferred 1.81 MB - saving 13%! Savings like that almost every request sounds like a pretty great deal to me!

{{< block "mini-rant" >}}
For reasons I don't understand, [Unsplash](https://unsplash.com), the service I use for most of the great images you see at the top of my posts, doesn't serve its images compressed. Whilst images aren't necessarily ideal for compression, they can still gain a decent amount. That's where most of the weight comes from for this page.
{{</block>}}

Normally, an application won't support compression in itself - it's more common on reverse proxies to do the compression on the fly. However, if the application _does_ support it, I'd strongly recommend enabling it too (you can enable it in both places just fine). If the server enables it too, it may allow it to serve pre-compressed static assets if available, removing the need to compress those files on the fly, reducing resource use and latency (not that it'd be much to notice on most scales). Reverse proxies will be aware not to try and compress data which is already compressed (using the `Content-Encoding` header), this way you can enable it on all sites at the reverse proxy level, and they all benefit - but if a specific application supports it itself, then enabling that will give just that application a little extra boost.

Enabling on-the-fly compression varies depending on which reverse proxy you're using, so best consult their documentation. In the case of nginx, it's just a case of specifying [`gzip on;`](https://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip), and it does the rest. And for my favourite, [Traefik]({{<relref "traefik">}}), it's just the [Compress middleware](https://doc.traefik.io/traefik/middlewares/http/compress/).

So, now you now what compression is and how it works - should you enable it? Absolutely! In the best case, you can save a huge amount of data transfer over a metered or limited connection. And in the worst case, well, there isn't really a downside. Unless you are running your server on a Raspberry Pi v1, you will almost certainly not notice the resource and latency increase from compression.
