---
title: Backgrounds
repo: RealOrangeOne/tbg
---

Even though I use i3, a window manager well known for being minimal, and black, I still like having desktop wallpapers. It makes my desktop feel far less plan, and my lock screens far less boring. I'm not one for keeping things the same, and so my backgrounds cycle, every minute. The background images can be found [here]({{< relref "backgrounds" >}}).

When I started, I used [variety](http://peterlevi.com/variety/), an incredibly powerful application to scrape images from a variety of locations. Variety however uses far too much memory for my liking, so, I wrote a replacement!

## Meet `tbg`
'tbg' is a simple program which cycles through images in a directory, and uses `feh` to set one as your background. It's written in Rust, and designed to be very lightweight. Selecting the image and actually setting it as the background is more intensive than I would like, but it uses around 10% the memory of `variety`.

## Lock screens
My lock screen of choice is [`betterlockscreen`](https://github.com/pavanjadhaw/betterlockscreen), a take on `i3lock` which adds a minimal-looking clock in the bottom right of the screen. `betterlockscreen` requires an image cache before running, so the image can be correctly resized / blurred, without affecting how long it takes to lock the machine.

{{< figure src="https://raw.githubusercontent.com/pavanjadhaw/betterlockscreen.demo/master/scrots/scrot2.png">}}
Lock Screen Example
{{< /figure >}}

Using `tbg`, I can set the background using `feh`, then build the cache for `betterlockscreen`. This is part of the issue which makes cycling an image very expensive.

```text
exec --no-startup-id tbg ~/Pictures/Backgrounds/ -m 1 -c "betterlockscreen -u /_"
```

Adding the above to my i3 config selects an image from `~/Pictures/Backgrounds/` every minute, sets it as my background, and builds the `betterlockscreen` cache with it. i3 handles running this application to make sure it's executed correctly on start-up.
