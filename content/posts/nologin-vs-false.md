---
title: nologin vs false
subtitle: What's the best way to disable a Linux user account?
date: 2020-03-05
tags: [linux,security]
---

When disabling a user account on a Linux box, it's good practice to also change the shell to something which, well, isn't a shell. The point of these shells is rather than presenting the user with a prompt to execute further commands , it returns a failure code, and log out the user.

If you look around, people recommend a couple different things to set as the user's shell: `/bin/nologin` and `/bin/false`. Not once have I seen someone say why to use either, nor what the differences are.

## `/bin/false`

`false` is a foundational part of the shell. It's an incredibly simple application which does nothing but exit.

Even the source code is simple: [`false.c`](https://git.savannah.gnu.org/cgit/coreutils.git/tree/src/false.c)

The source code itself is slightly misleading. `false` is actually an extension of `true`, but with a different return code. `false` returns status code 1, whilst `true` return 0.

The real logic actually lives there: [`true.c`](https://git.savannah.gnu.org/cgit/coreutils.git/tree/src/true.c)

Both `true` and `false` are incredibly simple, even if you nothing about C. And as a result are incredibly fast.

## `/bin/nologin`

`nologin` is designed to do exactly what we want it to. It's specifically designedo to prevent login by being set as a user's shell.

`nologin` does a little more than false, but it's still very simple code to read: [`nologin.c`](https://git.kernel.org/pub/scm/utils/util-linux/util-linux.git/tree/login-utils/nologin.c)

Once executed, `nologin` will try and read `/etc/nologin.txt` to get a custom message to show the user. If it exists, it prints that and exits with code 1. If it doesn't exist, it shows the default message, and exits with code 1. This customization makes it much more user friendly, although because the file is global, 1 system can only have 1 configured message.

## `rssh`

[`rssh`](http://pizzashack.org/rssh/) is a unique shell. Rather than executing commands, like `bash`, it allows filtering of specific SSH uses down to exactly what's needed. For example, you can block all access unless it's SCP.

`rssh` is a much larger application compared to `false` and `nologin`, but it's still not especially complex [code](http://pizzashack.org/rssh/downloads.shtml).

## _Which should I use?_

Realistically, it doesn't really matter. The point of a disabled prompt is to exit with a fail quickly, which both `false` and `nologin` do. So long as you block access, it really doesn't matter how.

If you're hyper paranoid, use `false`, as it's simpler and smaller. But you'll want to pair that with a whole lot more lockdown if you want things that locked down. Alternatively, if you want it to be more obvivous what's going on, use `nologin`, as its name makes a bit more sense, and terminates with a message.

`rssh` solves a specific issue. It's best not to use it unless you need its features, but if you do need them, it's a valuable tool in the kit!
