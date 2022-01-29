---
title: Backing up databases
date: 2022-01-29
image: unsplash:GNyjCePVRs8
---

Lots of applications use databases to store data. It's a fast and efficient way to store data, whilst also providing features like searching and integrity checks. Password manager, file storage, media library, RSS reader, almost everything will use some form of database. However, backing them up isn't quite as simple as it may seem.

If you look inside the data directory for a given database (eg `/var/lib/postgres/data` for PostgreSQL), there are a bunch of files (not meant for [human consumption](https://www.postgresql.org/docs/devel/storage-file-layout.html)):

```
$ ls -al
total 105
drwx------ 19   70 root    26 Jan 15 23:23 .
drwxr-xr-x  8 root root     8 Dec 11 12:27 ..
-rw-------  1   70   70     3 Dec 22 22:33 PG_VERSION
drwx------  7   70   70     7 Dec 23 16:30 base
drwx------  2   70   70    48 Jan 15 23:24 global
drwx------  2   70   70     2 Dec 22 22:33 pg_commit_ts
drwx------  2   70   70     2 Dec 22 22:33 pg_dynshmem
-rw-------  1   70   70  4821 Dec 22 22:33 pg_hba.conf
-rw-------  1   70   70  1636 Dec 22 22:33 pg_ident.conf
drwx------  4   70   70     5 Jan 29 19:12 pg_logical
drwx------  4   70   70     4 Dec 22 22:33 pg_multixact
drwx------  2   70   70     2 Dec 22 22:33 pg_notify
drwx------  2   70   70     2 Dec 22 22:33 pg_replslot
drwx------  2   70   70     2 Dec 22 22:33 pg_serial
drwx------  2   70   70     2 Dec 22 22:33 pg_snapshots
drwx------  2   70   70     2 Jan 15 23:23 pg_stat
drwx------  2   70   70     7 Jan 29 19:13 pg_stat_tmp
drwx------  2   70   70     3 Jan 29 15:01 pg_subtrans
drwx------  2   70   70     2 Dec 22 22:33 pg_tblspc
drwx------  2   70   70     2 Dec 22 22:33 pg_twophase
drwx------  3   70   70     8 Jan 29 19:07 pg_wal
drwx------  2   70   70     8 Jan 27 09:52 pg_xact
-rw-------  1   70   70    88 Dec 22 22:33 postgresql.auto.conf
-rw-------  1   70   70 28718 Dec 22 22:33 postgresql.conf
-rw-------  1   70   70    24 Jan 15 23:23 postmaster.opts
-rw-------  1   70   70    94 Jan 15 23:23 postmaster.pid
```

{{<block "note">}}
`70` being the user the PostgreSQL container runs as
{{</block>}}

These are the files PostgreSQL uses to persist its data. That way, should the database restart, unexpectedly or otherwise, you don't lose any data. So, to back up a database, we just back up the files, right?

## Why can't we just copy the files?

Well, whilst these files contain the data, it's not necessarily in the most efficient format, nor is it necessarily consistent.

All the time the database server is running, its data files are in an unknown state. The database could be reading data, writing data, re-indexing data, vacuuming data, anything. All of these can affect the state of files on disk, and all of which can have wide-spread impact.


Copy the files from a running database, as it's running, try and restart. Will it work? Let's see what happens.

```
2022-01-23 12:47:31.019 UTC [1] LOG:  starting PostgreSQL 14.1 on x86_64-pc-linux-musl, compiled by gcc (Alpine 10.3.1_git20211027) 10.3.1 20211027, 64-bit
2022-01-23 12:47:31.019 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2022-01-23 12:47:31.019 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2022-01-23 12:47:31.021 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2022-01-23 12:47:31.023 UTC [21] LOG:  database system was interrupted; last known up at 2022-01-23 12:41:09 UTC
2022-01-23 12:47:31.039 UTC [21] LOG:  database system was not properly shut down; automatic recovery in progress
2022-01-23 12:47:31.041 UTC [21] LOG:  redo starts at 9/944CF988
2022-01-23 12:47:31.075 UTC [21] LOG:  invalid record length at 9/94E91810: wanted 24, got 0
2022-01-23 12:47:31.075 UTC [21] LOG:  redo done at 9/94E917D8 system usage: CPU: user: 0.02 s, system: 0.01 s, elapsed: 0.03 s
2022-01-23 12:47:31.188 UTC [1] LOG:  database system is ready to accept connections
```

Yes, in my example it appears I didn't lose any data, which is great news for me. However, generally the reason to copy data files around is for backups. The quieter the database is, the more likely it is to be "fine". Do you really want to rely on a single example from "[some random dude on the internet](/)"? If your answer is "Yes", go have a long think about what you are doing, then come back and listen to said random dude as he tells you you're wrong.

**You're wrong**.

Backups should be as bulletproof and resilient as possible. In the event of a disaster, backups are the thing you'll be relying on, and which have to work.

### What about SQLite?

SQLite is a fantastic piece of technology. It's an entire relational database in a single file. Rather than talking to a separate database server, SQLite is a library which is compiled into an application, and talks directly to a file. No need for separate processes, extra servers, or anything.

SQLite being a single file, can that be backed up simply in itself? I'm afraid not. The SQLite maintainers helpfully have a page aptly named ["how to corrupt SQLite"](https://www.sqlite.org/howtocorrupt.html), which mentions doing exactly this being a great way to corrupt your database. Corrupt databases in your backups is widely considered a "bad thing".

### What about ZFS

Ah ZFS, the filesystem beloved by so many. Because ZFS is a copy-on-write filesystem, it supports very lightweight snapshots, which can snapshot the state of a filesystem in an instant, rather than having to copy the data to an intermediary location, during which time it can change further.

Whilst the snapshot process will be guaranteed to be internally consistent with what's on the filesystem, it doesn't mean what's on the filesystem is correct. As mentioned previously, the main issue with this approach is that what's written into the data files isn't necessarily consistent, which means no matter how consistent your filesystem may be, the data may not be.

Yes, I hear you BTRFS fans. The same is true for BTRFS snapshots, or any other copy-on-write filesystem's snapshots.

## So how _should_ databases be backed up?

Personally, when trying to understand a problem, I find it quite useful to explore a number of avenues, find out what's incorrect about them, in hopes it leads the way towards the correct one. Database backups are no different. We can't simply `cp`, as the files may change during the process. We can't use an instant snapshot, as the files themselves may not be internally consistent. So what if the database could produce an internally-consistent view into its data, and that's what's backed up?

Well, fortunately for me, and you, most databases worth their salt provide exactly that. In PostgreSQL land, the command is `pg_dump`. These backup commands connect directly to the running database server, and create a backup of any data. This is especially useful as it will only contain the data needed to reproduce the database state, meaning temporary data such as indexes are skipped, as those can be rebuilt.

More fortunately still, is the format of these databases. For relational databases at least, these often take the form of a giant `.sql` file, containing the table schema as valid `CREATE TABLE` queries, and load data using giant `COPY FROM` statements. This makes it easy for a human to inspect the backups and review what's been captured. As they are text, they also compress _fairly_ well. Typically, database engines support creating these backups in a binary format, which is generally faster and more efficient, but can cause problems when restoring to slightly different versions.

> If PostgreSQL was built on a system with the `zlib` compression library installed, the custom dump format will compress data as it writes it to the output file. This will produce dump file sizes similar to using `gzip`, but it has the added advantage that tables can be restored selectively.

With these database-produced backup files, they're not only guaranteed to be internally consistent, but are also simple to use, compressible, and easy to do some additional processing on with the likes of `grep`, or the plethora of command-line options commands like these support.

At the time of writing, I still backup both the database's files _and_ the text dump, on the off chance both are useful. Armed with this knowledge, I hope you'll never be afraid in the event of a database recovery. For docker, I have some [automation]({{<relref "docker-db-auto-backup">}}) to make my life easier
