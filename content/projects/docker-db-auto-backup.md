---
title: Docker DB Auto Backup
repo: RealOrangeOne/docker-db-auto-backup
subtitle: A script to automatically back up all databases running under docker on a host
tags: [docker, self-hosting]
---

Databases house a lot of data, and it's [not quite as simple]({{<relref "database-backups">}}) as just backing up their filesystem and getting everything fine. Most database engines will recommend a process for backing them up correctly, generally in the form of a command-line.

So how does that play with databases running in Docker? Well, it's no difference. Just connect to the container, run the relevant command, grab the output file, and send it to your backups. If you don't have many containers, you could easily schedule that with a tiny bash script on the host, but what if you have a lot of databases? Docker already knows exactly how many containers you have, and how to talk to them correctly. Wouldn't it be great to just have Docker tell us where all the containers are, run commands on them, and grab the output?

That's where [`docker-db-auto-backup`](https://github.com/RealOrangeOne/docker-db-auto-backup) comes in.

## `docker-db-auto-backup`

`db-auto-backup` will talk to `dockerd` and find all the containers it knows how to back up. When it finds one, it constructs a backup command for the relevant database engine, and run `docker exec` on the container to run it, streaming the output back. The resulting database backup is then saved into a file ready to be backed up however you see fit.

The backups are unencrypted, so it's up to you to ensure they stay secure. They're also uncompressed, to allow your backup tool of choice (mine is `restic`) to most efficiently snapshot the changes and upload just the parts that changed. Additionally, files are overwritten during the backup, so only a single version is kept, again leaning on your backup tool for versioning.

Backups are configured to run daily

## Performance

`db-auto-backup` is a relatively small Python script, which talks directly to Docker, avoiding the command-line wherever possible. Inside the container, it uses whatever native backup mechanism the database provides, so backups will only ever be as fast as those. There will be a small amount of overhead in the transferring from the database to Docker and on to the filesystem, but in the entire process that should be minimal.

## Support

Currently, it supports the most popular 3 database backends:

- MySQL
- MariaDB
- PostgreSQL

I absolutely welcome contributions for additional engines, or improvements to existing ones.

Something I would really like to do is get SQLite working. Unfortunately due to its nature, it can be difficult to discover _where_ inside the application container the database actually is. Using labels to allow the user to pinpoint it would be great, but that's for a future iteration.

For now, give it a try, and enjoy automatically configured backups for your databases.

{{% repobutton %}}
