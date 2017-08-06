---
title: Day 3
image: https://farm5.staticflickr.com/4422/35991781650_81c9763f93_o_d.jpg
linkTitle: Wednesday
date: 2017-08-02
---

One of my highlights of the whole week was on Wednesday, a cyber security talk from Dr Denis Nicole, a lecturer at the university. As soon as I saw this talk on the calendar, I knew I had to be there! The talk went into great detail on the NSAs PRISM project, and the various other communication-tapping schemes by other governments.

This was the day the finishing touches were done to the arena in the cube. Now that the scaffolding was completely setup, we needed to setup lighting, screens, and the gopro we'd mount to the lighting rig. Setting up lighting is infact much harder than it seems, as the axis of movement are relative to the light rather than me.

## GoPro

![View from the sky](https://farm5.staticflickr.com/4400/36220386672_e459081ddd_o_d.jpg)

The gopro we mounted to the lighting was to serve multiple purposes. Not only did it allow judges to see the entire arena from the balcony, but it also allowed us to record the entire arena for a match, without spectators getting in the way of the camera.

We also aimed to try using this feed for automatic judging in future games. Unfortunately the markers we have weren't particularly visible from that far up, so another idea will have to be tried. 

## Kit Setup

The remainder of the day was spent in the labs, assisting students with their robots, which they were just starting to create with our kit. The students were working until late on their robots, and some were able to achieve first movement by the end of the day.

### Update Mechanism

During the kit setup, and students started to use it more and more, we discovered an issue in the underlying setup. The robot system didnt correctly detect when a board was disconnected, and attempted to connect to it, which obviously caused an error. The fix for this was to clear the list of boards every time the robot restarted, but this required changing to each Pi, and we had no update mechanism.

The way we handled updating was to take teams Pis and power boards, connect them to a display, and install the new software manually. This was simple as we distribute everything as a `.deb` file, but was still annoying! It was at this time we discussed potential solutions, including private Wi-Fi networks, and update files on USB drives, however we were never able to implement them.

