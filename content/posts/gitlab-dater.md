---
title: Updating GitLab project dates
date: 2021-07-08
subtitle: Set the updated dates for GitLab projects
tags: [self-hosting, programming]
image: unsplash:uelgKvAFIoA
---

As a developer I do basically everything in `git` and for fun I run [my own `git` server](https://git.theorangeone.net) on my home server. I've swapped around quite a lot between [GitLab](https://gitlab.com) and [Gitea](https://gitea.io/), but finally settled on GitLab. It's a bit heavy, but the deep CI integration is really nice.

After setting up GitLab, I imported the repositories from my previous Gitea server, and some other really old projects from [GitHub](https://github.com/RealOrangeOne?tab=repositories). GitLab supports a variety of import sources, and will even auto-discover repositories from both Gitea and GitHub (although the UI really hangs with the nearly 700 GitHub repositories I have access to).

However, once you go back to the ["Explore"](https://git.theorangeone.net/explore) page, there's a problem. By default, repositories are listed by their "Last updated" date, which according to GitLab is right now, at the import date, rather than when the source repository was last updated. This means not only are the imported repositories not in the correct order, but over time they mix in with the rest of my repositories.

## Fixing it

The exact definition of "Last updated" is quite difficult to establish retroactively - it could be anything: commits, PR creation / merges, branch pushes. Because most of the repositories were only contributed to by me, there weren't really any outstanding PRs or other activity, so the latest commit on `master` was close enough for me.

My original plan was to write a nice and generic program (in Rust, of course) to talk to GitLab's API, scrape the repositories and commit dates, filter them based on whether they were imported, and then manually talk to GitLab's PostgreSQL to update the relevant database rows (there's no web API for this, unsurprisingly enough). I started writing this tool, and quickly [realized](https://twitter.com/RealOrangeOne/status/1412527079929827336?s=20) I was going to run it exactly once in bulk, and then every other time would only need a handful of repositories fixing. For all the time it'd take to develop something, the return on investment just wasn't worth it.

![XKCD - Is it worth the time?](https://imgs.xkcd.com/comics/is_it_worth_the_time.png)

Instead, it turns out that it's incredibly simple to do with just a few lines of bash. That way I'd be able to fix things quicker, and stop having to look at the abomination every time I loaded up GitLab.

## The script

The script itself is very simple, it takes the GitLab id for a "project" (what GitLab calls the whole repository) and the date to set. Much like my original plan, it still updates the date using SQL directly, which on the 1 hand means it's incredibly fast, but makes it a bit of a hack. My intention was to compromise and just use the date of the latest commit, but GitLab doesn't store the commits in the database, meaning doing this all as a single query isn't an option.

Whilst GitLab does show the commit date in the UI, it's in a tooltip, making it difficult to copy. However, GitLab does give you the ability to download an email patch for a commit, which do contain the date as a standard format. Postgres, in its infinite power, accepts this date format as a standard, making using these dates even easier.

GitLab stores the updated date in a few columns, and reads different ones for different parts of the UI. From lots of trial and error, I've narrowed down the important ones to 3 columns: `last_repository_updated_at`, `last_activity_at` and `updated_at`. Setting these to the relevant date updates the UI in all the right places.

[The script itself](https://git.theorangeone.net/sys/gitlab-dater/) lives, rather aptly, on my GitLab server.

## Execution

Armed with a handy script, it's very simple to update a repository to the right date:

1. Find the project
2. Copy its id
3. Open its latest commit, click "Email Patch" and copy the date from the resulting commit
4. Feed both bits of data as arguments to the script

What's less simple, and much more annoying, is I now have to go through all the repositories which need updating - it's pretty monotonous work. 50 odd repositories, and that short loop takes quite a while. 10 minutes here and there, and it only took a day or so to clean them all up.

Finally, [my repositories](https://git.theorangeone.net/explore) are in the right order and I no longer cringe at the sight.
