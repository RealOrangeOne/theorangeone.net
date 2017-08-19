---
title: Public web server
---

My public server one of the VMs on my dedicated server, running [Dokku](http://dokku.viewdocs.io/dokku/), allowing me to easily deploy applications no matter what they're written in! Many people have tried to convert me to other methods, such as just using nginx + systemd, or `docker-compose`, but dokku is just so simple and easy. Yes the domain routing has some issues, but it's still much nicer than doing it all manually!

The best feature of dokku is the easy integration with [LetsEncrypt](https://letsencrypt.org/), so I can easily add `HTTPS` connection to applications, even if they don't natively support it!
