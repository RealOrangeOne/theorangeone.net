---
title: Astrill Extractor
gist: 050da86871fb952ba7bfe97eece8555c
---

Astrill, my VPN of choice, allows you to export OpenVPN config files for all it's VPNs, allowing you to connect on platforms it doesn't provide clients for, which albeit isn't many. The AUR package `astrill` has started becoming really unstable on my machine recently, so I decided to switch it out for `ovpn` files, as gnome has excellent support for OpenVPN.

The export step is really simple, you just login to the web portal, create an entry for your machine, and export the config files. Their tutorial for this can be found [here](http://wiki.astrill.com/index.php/Astrill_Setup_Manual:How_to_configure_OpenVPN_with_Network_Manager_on_Linux). The only problem is that some applications won't accept the certificates embedded into the file like astrill provide. (Gnome does, but I only realised that whilst writing this).

{{% gist %}}

The above script will split out the files and save them into separate directories for each config file. These files can then be imported and used in an OpenVPN-compatable application.

### Is it even needed?
Certain network managers do support importing `.ovpn` files directly, and sets everything up for you, including the files for the keys etc, without needing to extract them before. Gnome's `network-manager` does this. This does make my script useless to me, but hopefully someone will find it useful!
