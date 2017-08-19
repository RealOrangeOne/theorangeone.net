---
title: Fix steam under linux with an iGPU
subtitle: Fixing "`libGL error failed to load driver i965`"
image: http://stuffpoint.com/steam/image/91140-steam-steam-wallpaper-circles.png
---

Running steam on linux is great, besides the triple-a game support obviously. But running it on an iGPU has recently been causing me problems, mainly under Arch.

## Stacktrace:
```text
jake@***:~$ steam
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
Running Steam on antergos  64-bit
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
STEAM_RUNTIME is enabled automatically
Installing breakpad exception handler for appid(steam)/version(1468023329)
libGL error: unable to load driver: i965_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: i965
libGL error: unable to load driver: i965_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: i965
libGL error: unable to load driver: swrast_dri.so
libGL error: failed to load driver: swrast
```

## The solution
I have no idea why it works, or why it works, but speaking to some people online, this is the best solution:

```bash
LD_PRELOAD='/usr/$LIB/libstdc++.so.6 /usr/$LIB/libgcc_s.so.1 /usr/$LIB/libxcb.so.1 /usr/$LIB/libgpg-error.so' /usr/bin/steam %U
```

I have no idea why it works, but it works perfectly for me! Steam client runs with no problems.

```text
jake@***:~$ LD_PRELOAD='/usr/$LIB/libstdc++.so.6 /usr/$LIB/libgcc_s.so.1 /usr/$LIB/libxcb.so.1 /usr/$LIB/libgpg-error.so' /usr/bin/steam %U
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
Running Steam on antergos  64-bit
~/.local/share/Steam/steam.sh: line 154: VERSION_ID: unbound variable
STEAM_RUNTIME is enabled automatically
Installing breakpad exception handler for appid(steam)/version(1468023329)
```

Unfortunately, it doesn't seem to work if you add it to the `steam.desktop` file, for reasons I don't quite understand. But, just edit `/usr/bin/steam` to include the variable, and that works perfectly!

```bash
export LD_PRELOAD='/usr/$LIB/libstdc++.so.6 /usr/$LIB/libgcc_s.so.1 /usr/$LIB/libxcb.so.1 /usr/$LIB/libgpg-error.so'
```
