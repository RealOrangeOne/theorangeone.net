---
title: CircleCI Artifact Proxy
repo: RealOrangeOne/circleci-artifact-proxy
---

My favourite feature of [CircleCI](https://circleci.com/), besides the fact it's the fastest CI I've used, and support docker natively, is artifacts. Artifacts allow you to store files from your build, and download them from the web interface. This means you can use the interface to build mobile apps, installers, or even disk images! The artifacts can be easily downloaded from the web UI, however the URLs aren't discoverable, which makes automatically generating links difficult.

A very important missing feature, is the ability to just get a download link for the latest build available. This would make using CircleCI as a file host for documents, or various other things, great!

My proxy enables both these features. URLs become discoverable, and allow referencing the latest build. Using the [CircleCI API](https://circleci.com/docs/api/v1-reference/), it gets the less-discoverable URLs from the artifacts, and stream it back to the client.

The URLs take the structure `<org>/<repo>/<build>/<path>`, allowing easy editing of links, as they're very human-readable. You can also use `latest` as the build number to get the most recent build automatically. Streaming the artifact rather than redirecting allows keeping the nicer URLs, which is especially nice for files viewed in the browser, like PDFs.

The server is written in [Rust](https://rust-lang.org/), using [rocket](https://rocket.rs), because I'd never written a web server in rust. With Rust, the resulting binary is incredibly small (`4mb`), but also is lightweight at runtime, and incredibly fast! The resulting binary should require no additional dependencies, and binds to port `5000` (or `$PORT`).

The server is already deployable in heroku-like environments, with [the rust buildpack](https://github.com/emk/heroku-buildpack-rust). It should also be very simple to build a docker container or custom deployment workflow around it.

{{< repobutton >}}
