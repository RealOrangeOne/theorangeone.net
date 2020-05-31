---
title: Wiki Game solver
gist: 7da9a3dd1bf90ecdf7be
subtitle: Simple script to win the Wiki Game
---

[The Wiki Game](http://thewikigame.com) is an online game where you attempt to navigate through Wikipedia from a start page to a goal page using as few other pages as possible.

Not long after I was shown it, I realized that I _really_ wasn't very good at it. After about 15 minutes of coming in last place all the time, I started to wonder how it worked, and how I could beat it.

As it turns out, it really isn't very hard! It does require injecting some JS into the page, but it's not that much.

## Usage

1.  Start a [new game](http://thewikigame.com/speed-race), __don't__ press start!
2.  Open your browser's developer console. This will vary from browser.
3.  Paste the compact version of the code (`wiki-game-solver.min.js`), and execute it (press enter)
4.  Congratulations, you just won!


## How it works
The game isn't open source, so I couldn't see how the back end worked, but after playing a few games and checking what happened on the page, I worked out what it was doing.

The game was won when the iframe was at the final page location, or at least a clone of it on their servers with some extra querystring information.

With this, I started to write something that would change the location of the iframe to the goal. Fortunately for me, the goal URL was on the page. So all it took was a little switcheroo to win!

### Source
The source for this was written in pure JS, and relies heavily on the fact that the wiki game uses jQuery. The code can be found in the GitHub gist below. Both the standard and compact versions are available.

{{< gist >}}

### Disclaimer
As I experienced whilst developing this, the people that play Wiki Game don't tend to like people cheating. There were a lot of people getting very annoyed whilst I was developing and testing. So please use this at your own risk! At the moment I don't think there is any kind of banning system, but be warned!
