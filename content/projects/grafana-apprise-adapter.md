---
title: Grafana Apprise Adapter
repo: RealOrangeOne/grafana-apprise-adapter
subtitle: Receive Grafana alerts from many more platforms
---

[Grafana](https://grafana.com/) is a great application for monitoring. With a plethora of data sources allowing for analysing and cross-referencing several metrics. Unfortunately, it doesn't support much in terms of notifications.


[Apprise](https://github.com/caronc/apprise) is a great library for creating generic integrations between applications and messaging services for receiving notifications. The only downside is that it's written in Python, which makes integrating it with Grafana's Go codebase rather difficult.

`grafana-apprise-adapter` is a small web server which converts messages from Grafana's webhook notifier into a format the [Apprise web API](https://github.com/caronc/apprise-api/) can consume. Thus allowing for many more notification targets.

{{% repobutton %}}

It's written in Rust, both so it can have low resource overhead, but also for safety, ensuring that the adapter itself will have few issues resulting in messages not going through.
