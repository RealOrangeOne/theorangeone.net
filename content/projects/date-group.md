---
title: Date Group
repo: RealOrangeOne/date-group
subtitle: Group files by date
---

Over the years, I've taken a lot of photos on my phone, and it's hard to keep them organized properly. Large directories of files don't play nicely with [Nextcloud](https://nextcloud.com/), my storage of choice.

`date-group` is my tool to solve this. Give it a directory of files, and it'll group them into directories by year and month. It gets the date in a couple ways:

1. Image EXIF data
2. Parse the filename

{{% repobutton %}}

I [originally wrote the tool in Python](https://github.com/RealOrangeOne/date-group-py/), but ported it to Rust for easier deployment, quite a performance improvement, and of course a safer implementation.
