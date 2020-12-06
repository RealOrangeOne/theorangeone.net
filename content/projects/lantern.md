---
title: Lantern
repo: RealOrangeOne/lantern
subtitle: Write a web server in almost any language.
---

Lantern is a generic web server which wraps any application and allows it to respond to HTTP requests. The request body and headers are passed to `stdin` as JSON, and anything sent to `stdout` is returned to the client.

Is this useful? Not really.

Isn't this basically just [CGI](https://www.geeksforgeeks.org/common-gateway-interface-cgi/)? Yeah kinda.

Should this be used for production deployments? Definitely not!

It's just a fun experiment with [`sanic`](https://sanic.readthedocs.io/en/latest/) and async programming in its early days.

{{% repobutton %}}
