---
title: Git Mirror
repo: RealOrangeOne/git-mirror
subtitle: Provider-agnostic mirroring of git repositories
---

Recently, I started moving most of my archived projects from GitHub onto my own Git server. Unfortunately, the self-hosted offerings aren't perfect for mirroring. [Gitea](https://gitea.io/) supports mirroring repositories _into_ itself, but not pushing (work is [planned](https://github.com/go-gitea/gitea/issues/7609)). [GitLab](https://gitlab.com/) supports pushing repositories _to_ an upstream, but not mirroring into itself unless you pay them a lot of money.

This meant if I wanted the primary for my repositories to be on my server, but still be visible on GitHub, I couldn't. That is, unless I wrote something myself.

`git-mirror` is a small scheduler which simply pushes changes from repository to another. Simply specify an interval, a source repository and a destination, and it'll handle the rest. It only runs on a schedule rather than detecting automatically, but this makes it platform agnostic.

{{% repobutton %}}

Since writing `git-mirror` I've moved from Gitea to GitLab, which has native push support. I do plan to migrate back to Gitea just as soon as they have push mirror support. Or sooner, we'll see.
