---
title: Make QT look less ugly
date: 2017-12-27
image: resource:qt-gtk-after.png
hide_header_image: true
---

As anyone who's used an application written with the QT UI framework will know, they don't always look the best, and certainly don't fit in with the rest of your desktops theme in the way GTK does. Certain themes support styling both GTK and QT applications, however most don't.

{{< resource src="qt-gtk-before.png" >}}
KeePassXC, before it looked pretty
{{< /resource >}}

Fortunately, there's a solution, and it comes in the form of a _Theme engine_. Theme engines act as a small compatibility layer, allowing certain frameworks to render as if they were others. With this, we can tell QT applications to render as if they were GTK.

`qt5-styleplugins` is a package which allows QT applications it's components using the same underlying widget components as GTK+2. More detail on `qt5-styleplugins` can be found on the [Arch Wiki](https://wiki.archlinux.org/index.php/Uniform_look_for_Qt_and_GTK_applications#QGtkStyle).

Setting up `qt5-styleplugins` is incredibly simple:

1. Install the package from your OS's package manager. [`qt5-styleplugins`](https://www.archlinux.org/packages/?name=qt5-styleplugins) on Arch, [`qt5-style-plugins`](https://packages.ubuntu.com/search?keywords=qt5-style-plugins) on Ubuntu.
2. Set the environment variable: `QT_QPA_PLATFORMTHEME=gtk2`

Installing the environment variable can't be done in your `.bashrc`, as variables stored here aren't accessible to applications launched outside the terminal. I'd recommend setting it in `/etc/environment` instead.

After install, simply reboot, and your apps should fit in far, _far_ better with the rest of your desktop.

{{< resource src="qt-gtk-after.png" >}}
KeePassXC, with GTK looks much nicer!
{{< /resource >}}
