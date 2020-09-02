---
title: Calming down Clickhouse
subtitle: Why is Clickhouse so intensive?!
date: 2020-09-02
tags: [containers, self-hosting]
image: https://clickhouse.tech/images/index/intro.svg
---

[Clickhouse](https://clickhouse.tech/) is a column oriented database engine, mostly designed for analytics. It was developed and deployed by [Yandex](https://yandex.com/) in their analytics offering, but [Plausible](https://plausible.io), my analytics provider of choice, uses it to store the analytics data, as it's more suited to this than [PostgreSQL](https://www.postgresql.org/).

Unfortunately, the [official docker container](https://hub.docker.com/r/yandex/clickhouse-server) is pretty crazy intensive. As soon as Plausible starts up, Clickhouse jumps to around 10% CPU usage, and sustains 30MB/s writes to the database directory. My hourly ZFS snapshots allocate over 1GB each!  The server I run Plausible is reasonably powerful, but even this is just crazy!

Initially I thought this was [a bug](https://github.com/plausible/analytics/issues/301) in Plausible, as it only occurred when Plausible was running. However, after raising an issue, and being told Plausible's production servers don't _appear_ to suffer this issue, it was time to dig deeper.

Before anything else, let's take a quick look at the data directory for anything obvious:

```
$ df -hs clickhouse/
8.2G    clickhouse
```

Well, that's definitely not right! Let's investigate...

## Looking at the data

Looking at the filesystem structure of `clickhouse/` (nice simple layout!), most of the usage came from the [`system.query_log`](https://clickhouse.tech/docs/en/operations/system-tables/query_log/) and [`system.query_thread_log`](https://clickhouse.tech/docs/en/operations/system-tables/query_thread_log/) tables. These aptly-named tables are responsible for logging all queries executed by Clickhouse, and for me had over 20 million rows in, **each**! After scouring through the docs, this is enabled to [aid with debugging](https://clickhouse.tech/docs/en/operations/system-tables/query_log/). For the majority of people, you don't really need all this data, and it's definitely not worth the trade-offs of the huge amount of disk usage relative to the actual stored data.

### Log file

Looking at the Clickhouse log file (`/var/log/clickhouse/clickhouse-server.log`), it was incredibly verbose, and outputting far more than it needs. The default log level is set to `trace`, which basically means absolutely everything is logged, even more so than regular `debug` logs. The log level of `trace` matches the mantra of helping with debugging, but again is unnecessary in the majority of environments.

## Calming down

So, given how Clickhouse is behaving, and logging far too much data into both the system tables and log files, how can we go about toning Clickhouse down? Chances are it's the additional logging work both to tables and log files which is using up the extra resources.

### Stop logging queries

The first step, and likely the one which makes the most difference, is to flat out disable query logging. Doing this should alleviate CPU cycles spent collecting This is done using the [`log_queries`](https://clickhouse.tech/docs/en/operations/settings/settings/#settings-log-queries) and [`log_query_threads`](https://clickhouse.tech/docs/en/operations/settings/settings/#settings-log-query-threads) variables in [`users.xml`](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/plausible/files/clickhouse-user-config.xml):

```xml
<yandex>
    <profiles>
        <default>
            <log_queries>0</log_queries>
            <log_query_threads>0</log_query_threads>
        </default>
    </profiles>
</yandex>
```

### Reduce logging

Step 2 is to reduce the log level on both the file logger, and any other table logging we can't disable entirely. This change is done in [`config.xml`](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/plausible/files/clickhouse-config.xml). I set the level to `warning`, so it's still obvious to see when something is wrong, but it won't bombard me with information.

```xml
<yandex>
    <logger>
        <level>warning</level>
        <console>true</console>
    </logger>
    <text_log>
        <level>warning</level>
    </text_log>
    <metric_log>
        <level>warning</level>
    </metric_log>
    <trace_log></trace_log>
</yandex>
```

For easier debugging, I also push logs through to the console with `<console>true</console>`, so it can be seen using `docker-compose logs`.

In addition to reducing the log level, I moved the log files to a`tmpfs` mount. I did this initially to reduce writes to disks, but it's still there anyway just in case it makes a difference.

### Reclaim some disk space

The final step is to reclaim the disk space we lost to the overly verbose logs. Because everything was logged to tables, it's all still around. This probably won't impact runtime performance much, but disk usage went from 8GB to 200MB, which is quite nice!

1. Log in to the Clickhouse shell: `docker-compose exec clickhouse clickhouse-client`
2. Truncate some tables: `truncate table <table_name>;`
    - `system.query_log`
    - `system.query_thread_log`
    - `system.metric_log`
3.  Quit: `\q`

## Review

Reading through Clickhouse's [documentation](https://clickhouse.tech/docs/en/), it's incredibly configurable for any scale of need - unsurprising given it's being used by Yandex. With that said, whilst the defaults might make sense at that scale, for the smaller use case they're not especially appropriate.

I'm still currently convinced there's a small bug in Plausible, in the healthchecks performing too many queries, but that's another day's investigation.

After deploying these changes, not only have resource uses dropped off a cliff, but Plausible even seems a bit snappier!
