---
title: Morse code decoder
gist: 6dc94875c93b787e5834
subtitle: A JSON file to help decode morse-code
---

It's not often people need to decode text into morse code (and visa-versa), but if I had something like this when I needed to, it would have saved me hours of time!

I originally needed this for the [Student Robotics 2015](/robotics/2015/) entry, to convert a string message into morse code that would be transmitted using LEDs, for aesthetics and debugging. Unfortunately due to a fixed time frame, this idea was scraped before it could be fully implemented. However, the decoder worked perfectly!

## Usage

In order to make it accessible for as many people in as many different languages as possible, I converted our code from python to JSON. Just find a JSON library for your desired language, and it'll work perfectly!

The source of the library is on GitHub as a gist. I recommend downloading the file to use yourself, however for testing you can use GitHub's raw file as a hotlink.

{{% gist 6dc94875c93b787e5834 %}}
