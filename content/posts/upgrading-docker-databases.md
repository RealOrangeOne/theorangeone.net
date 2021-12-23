---
title: Upgrading Databases in Docker
tags: [containers]
date: 2021-12-23
image: unsplash:lRoX0shwjUQ
---

For me, every Monday is updates day. I run through all the entries in my Ansible [hosts file](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/hosts) and install any updates which may need running. All machines have OS updates, and the handful which run docker get their [containers pulled](https://github.com/RealOrangeOne/infrastructure/blob/master/ansible/roles/docker_cleanup/files/docker-utils/update-all). However, pulling containers merely updates the underlying container OS, or maybe patch versions of the application (because I do container pinning [properly]({{<relref "keeping-docker-containers-updated">}})). Updating actual versions can be a bit more fiddly, and is always a manual process. The most fiddly updates are by far databases.

Database upgrades are _fun_ at the best of times. By their nature they contain some of the most important data to an application's operations. When you add Docker into the mix, it can get even more complex. But it doesn't have to be difficult. With a little planning, and a tiny amount of downtime, the upgrade process is just a few simple steps, depending on the engine you're using.

Before you do any of this, absolutely make sure you have backups. Containers are wonderfully [simple]({{<relref "backup-restore-containers">}}) to back up, and you do not want your upgrade to result in complete loss of data! I give each application its own database container, to keep things separate and clean, but these upgrade instructions are the same regardless.

## PostgreSQL

PostgreSQL (or "postgres") is my database engine of choice. I've been using it professionally for many years, it makes sense, it's fast, and it's been rock solid for years.

When it comes to upgrading postgres, it comes with a [`pg_upgrade`](https://www.postgresql.org/docs/current/pgupgrade.html) command which automagically upgrades the database storage on disk to be compatible with the new version. Unfortunately however, it does this in a rather strange way: by requiring access to both the new and old server binaries during the upgrade. There's almost certainly a good reason for this, and it likely massively reduces the complexity of the `pg_upgrade` application, but in a dockerized environment it's just not possible - there's only 1 binary available in the container.

There are [ways](https://github.com/tianon/docker-postgres-upgrade) around this, but in reality the simplest solution is to just export the database, nuke it, create a new fresh database, and then re-import. It's slower, and a bit more of a faff, but it's going to be much more reliable and less magical.

1. Stop the application (`docker-compose down`)
2. Start just the database (`docker-compose up -d db`)
3. Export all databases on the server into plaintext (`pg_dumpall -U username > data.sql`)
4. Stop the database (`docker-compose down`)
5. Remove the contents of the database directory, wherever you've mounted in `/var/lib/postgres`
6. Update the tag you are using, and pull the new container (`postgres:12-alpine` &rarr; `postgres:14-alpine`)
7. Start just the database (`docker-compose up -d`). This will recreate a fresh database, using the credentials from the environment.
8. Import the data into the new database (`psql -U username < data.sql`)
12. Stop the database container (`docker-compose down`)
13. Start everything (`docker-compose up -d`)

Once the database has been imported, you may need to reset the database user's password (`ALTER ROLE username PASSWORD 'password';`). Newer versions of postgres hash passwords differently, which older versions may not configure correctly. Alternatively, you can comment out the `CREATE ROLE` and `ALTER ROLE` statements in the `dump.sql` file before importing it.

It's a shame it's this fiddly, but there is an [open issue](https://github.com/docker-library/postgres/issues/37) around improving this workflow, so hopefully it gets resolved.

## MySQL / MariaDB

MySQL is easily the most popular database engine out there, used by the likes of Facebook, GitHub, and basically every PHP application you come across. MariaDB started life as a MySQL fork under a more permissive licence, but has since gained its own following, and is growing in popularity for smaller deployment scales. If I need MySQL, I deploy MariaDB 100% of the time, as they're compatible.

I love PostgreSQL, but MySQL definitely makes the upgrade process much simpler. Instead of requiring access to both the old and new server binaries, there's just a single upgrade command which modifies the on-disk schema as necessary.

1. Stop the application (`docker-compose down`)
2. Update the tag you are using, and pull the new container (`mariadb:10.5` &rarr; `mariadb:10.7`)
3. Start just the database (which should now be the new version) (`docker-compose up -d mariadb`)
4. Run `mysql_upgrade`, likely using the `-u` and `-p` flags to specify credentials (`mysql_upgrade -uroot -p`)
5. Once complete, stop the database container (`docker-compose down`)
6. Start everything again as normal (`docker-compose up -d`)

If all goes according to plan, your application should act like nothing ever happened, but in reality you're running a newer database engine. Both MariaDB and MySQL have [similar issues](https://github.com/MariaDB/mariadb-docker/issues/350) to postgres open around automatically upgrading versions.

## Clickhouse

[Clickhouse](https://clickhouse.com/) is a very niche database, but the things it's useful for it is fantastic. I run Clickhouse as the analytics store for [Plausible]({{<relref "self-hosting-plausible">}}), my analytics tool of choice. MySQL's upgrade process is pretty simple, but Clickhouse definitely wins on this one:

1. Stop application (`docker-compose down`)
2. Update the tag you are using, and pull the new container (`clickhouse/clickhouse-server:21.6-alpine` &rarr; `clickhouse/clickhouse-server:21.12-alpine`)
3. Start just the database (`docker-compose up -d clickhouse`)
4. Wait for CPU usage to die down (`docker stats` is a great tool to see this). This is just as an indication for some upgrade work Clickhouse does in the background on the schema.
5. Stop the database (`docker-compose down`)
6. Start everything (`docker-compose up -d`)

Yes, it really is that simple: upgrade and go. The least used or understood database for me turned out to be the simplest to upgrade - excellent!

## Improvements

As with many things, upgrades are a part of life and there's no way around them. Sure you can bury your head in the sand, firewall off your application and hope nothing bad happens, but it just takes 1 log4shell-level event for your castle to come crashing down.

And of course, that's not to say anything about the new features and improvements which often come from newer versions. Newer database engines often come with a flurry of performance optimizations, storage improvements and syntax features, many of which require little to no input from the application developers.

![New _is_ always better, apparently](https://media.giphy.com/media/lqNBMrcSQdXZ4KvQhZ/giphy.gif)

Of course, before you go around blindly upgrading, you should check the application actually supports the versions you're upgrading too. Usually it's fine, and a quick smoke test should uncover most issues, but it's something to watch out for. I was caught out by Nextcloud and had to recover from a backup, as it turns Nextcloud still doesn't officially support greater than MariaDB 10.5, for some reason, but that might also need some more playing.

With some containers, you may feel like it's ok to just pin `:latest` and move on - databases should not be one of them. More often than not, a database will refuse to start up if its storage is the wrong version, leading to unexpected downtime and annoyances. Personally, I pin to wherever the breaking change boundary is (for postgres this is major versions, for MariaDB it seems to be minor versions), resulting in `postgres:14-alpine` (which pins postgres to version 14, and uses the alpine-variant of the container). This way when I run my weekly updates, any patch or underlying OS upgrades are applied automatically, security fixes and all.
