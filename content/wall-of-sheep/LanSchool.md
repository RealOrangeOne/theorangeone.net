---
title: LanSchool
subtitle: The tool of choice of my college to monitor students usage of computers. Turns out it's not particularly secure!
---

LanSchool was the software of choice for my college to monitor and control computer usage. It allows teachers to see students screens, interact with them, and even block certain functionality like the internet and removable storage.

By far the worst feature of LanSchool was the screen blocking. At will, a teacher could show an overlay on your screen, usually consisting of test saying _"Eyes front"_ etc. There was no way to hide this product, it just appeared suddenly and forced you to stop using your computer.

Within a few weeks, A friend of mine discovered how to get around it in a really primitive way: just unplugging the ethernet. It's rather incredible this worked, but it had some problems:

- It took around 10 seconds after disconnect before the screen was restored, not a major problem, but still annoying.
- With all documents and programs bring stored on the network, you couldn't access any programs and documents you didn't already have open.
- When you reconnect the cable, the screen returns to the state of everyone else.
- Your computer would suddenly disappear from the list of machines on the teachers screen. If they were observant, they'd notice!

This solution worked, but wasn't ideal. Another solution was to log out (using the `ctrl + alt + delete` shortcut, which still worked for some reason), and log in again. Our network was slow, so sometimes it wasn't worth the wait if your screens were only disabled for a short period of time. However the main issue was that it didn't always work, only around 30% of the time.

#### The best fix

The original idea for this came from someone else, but the implementation and refinement was mine, so I like to think it was mostly me.

Using an ubuntu live CD loaded onto a USB drive, we booted to ubuntu, and renamed the LanSchool executable. This meant the program wouldn't be able to run on start up, and so the client couldn't communicate with the teacher to lock our computers. __Result!__

This method worked almost perfectly, however had a few problems:
- It took at least 10 minutes to go from completely enabled, to completely disabled
- It worked for every user account on that computer, so it had to be done on each computer I used.
- A teacher would notice, as you would never show up on their list.

Fortunately this last point is a non-issue, as usually the teachers put it down to the software messing up, not a student breaking it intentionally. Another key problem with this is that it's rather obvious when everyone else's is disabled.

#### The silver lining

Disabling the client on a machine also allowed for another feature that I had never thought of, but was by far the greatest feature of disabling LanSchool: __Teacher Mode!__

Due to me being able to have access to a teachers computer one evening, I was able to copy the executables for the teachers console onto a USB drive, and then run them later on my computer. Obviously I know most software won't work in this way, but I'm so glad this one did!

Now, I had access to everything the teacher did, which made lessons much more exciting. I could block peoples screens, send them messages, or even take complete control of their computer, it was great! Eventually a few more in my class knew [I had the power](), and I became a tool for trolling people, which was made extra simple by the fact I had access to all student computers in the college, not just my class. The only downside to this (something I didn't realise until I tried to prank a friend), is that it comes up with your name on the client computer if you try and take control of one that's not in your class, an annoying and dangerous feature.

#### Phase 2

While writing this, over 2 years after leaving, I realised I could improve it considerably. Writing some kind of wrapper program, to detect my username, and run LanSchool for users other than me, would be harder to work out there was a problem with the computer, as well as prevent it disabling LanSchool for every user.
