---
title: Recovering orphaned git commits
date: 2020-10-22
image: unsplash:Vqg809B-SrE
tags: [programming]
---

I recently had a far from fun morning. I had my website cloned on my desktop, with some commits which weren't upstreamed. Having done some work on my laptop, upstream was ahead of my desktop, which needed rectifying.

[`git pull -r`](https://gitolite.com/git-pull--rebase) is a great feature of git, which does a rebase rather than a merge commit when pulling a diverged remote. Normally this would rebase my commits, leaving me with the 2 local commits I'd made to push locally. For reasons beyond my understanding, instead I was left with 0 commits to push - the 2 commits I had locally vanished.

## Git object storage

Git does some pretty magical thing behind the scenes. The important one here being that Git stores files in ["objects"](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects), referenced by a hash of their contents. If you move a file, it doesn't duplicate the object, as the content hasn't changed. When you create a commit, it references these objects. Commits themselves are also objects, which are referenced by branches. If you're interested in more, checkout [Plumbers guide to Git](https://alexwlchan.net/a-plumbers-guide-to-git/).

The most important thing about objects is that it's very rare they actually get deleted. If have a committed file you delete, the object is still there. Most importantly to my case, if you do some branch-fu and remove a commit, the commit _may_ still exist.

## Finding commits / files

As mentioned before, commits and files are both "objects". To find my missing commit, all I need to do is look through the object files for a string which I know to be in the commit message or file body, right?

Wrong! Sort of. Git objects are stored compressed, which means simply using `grep` (or [`rg`](https://github.com/BurntSushi/ripgrep/) if you're cool) to search the files doesn't work. `git` does have a command to search through files (`git grep`) but for this use case it wasn't appropriate, as that only searches the current state of the checked out repository. Instead, we need to use some `git` tooling to get at the data _cleanly_.

The first step is to list **all** objects `git` knows about, including those not referenced by branches. [StackOverflow to the rescue](https://stackoverflow.com/a/38083908) on this one. This script will list out SHAs of all objects, which can then be pass into `git show` to get the real content, rather than the compressed version. Piping that into a text file, I've now got an entire dump of everything `git` knows about my repository: commits, files, the lot.

```bash
bash ~/object-list.sh | xargs -n1 git show > ~/out.txt
```

It ended up being a lot more than I wanted (the file was around 79MB), but hey I'll take having too much context over not enough!

## Searching large files

For searching large files, I recommend using [`glogg`](https://glogg.bonnefon.org/). It's pretty barebones, but it deals with huge files incredibly well (not that 79MB is very large).

Searching through the output file, I eventually found the commits I needed. Because the file contained the output of `git show`, it gave me 2 options. Either I could copy the content / diff out and store it for later use, or, because `git show` shows commit information, I could `git cherry-pick` the commit SHA onto my branch, and push it. I went for the former, because it was simpler, easier, and I decided I didn't want to push those changes quite yet.

## Lessons

Whilst rather stressful in the moment, experiences like these aren't without their lessons:

- Don't delete your local copies of posts until they're actually live, rather than just committed
- Be careful when relying on `git` magic and rebasing
- `git` is pretty damn good at making sure you don't lose any data
