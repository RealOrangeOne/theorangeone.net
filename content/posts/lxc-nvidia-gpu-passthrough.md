---
title: Nvidia GPU passthrough in LXC
subtitle: Passing a single GPU to multiple LXC containers
date: 2020-12-23
tags: [self-hosting, linux, server-2020, containers]
image: unsplash:A1blvxJxGU0
---

[GPU Passthrough]([16dbAUrtMX4](https://www.youtube.com/watch?v=16dbAUrtMX4)) has become a great way to run a Linux host, but still run games under Windows. By having 2 GPUs, 1 for the Linux host and the other for a Windows VM, you give Windows its own full GPU for games, but without having to run Windows as your primary OS.

But, what about on the server? What if you only have a single GPU, but want it to be used by multiple guest OSs?  Unfortunately for now you're out of luck. SR-IOV is a technology from the datacentre to share a single GPU to multiple guest VMs, however it's poorly supported for consumers. For now, we can instead pass the GPU into multiple LXC containers rather than VMs. This means it can be shared and used by multiple applications in isolated environments, without the need for SR-IOV compatibility.

{{< youtube 11Fs0NHgzIY >}}

When talking about GPU passthrough, it's generally about PCIe passthrough: Passing a PCIe device from the host into the guest VM, such that the guest takes full control of the device. This however limits us to passing the device through only to a single VM. The host loses all access to the GPU ones passed through. This not only means that the host can't take use the device, but also that it can't be passed to other VMs. When passing through to LXC containers, the host OS is what handles the device communication, so several LXC containers can have access to the GPU.

If you're trying to pass through an Intel iGPU you can already take advantage of SR-IOV, just under a different name: [GVT-g](https://wiki.archlinux.org/index.php/Intel_GVT-g). This can be split up as needed and [passed to multiple VMs](https://blog.ktz.me/passthrough-intel-igpu-with-gvt-g-to-a-vm-and-use-it-with-plex/) without issue.

## Steps

LXC passthrough is a slightly more involved process than VM PCIe passthrough, but it's not too complex. And of course, I'm here to guide you through it:

### 1. Install host drivers

When doing PCIe passthrough, the first step is to blacklist the driver to ensure the host kernel doesn't try to load the device. Here we need to do the opposite: Install and configure the correct drivers.

You need to install the kernel headers, which for me on Proxmox is the `pve-headers` package.

Next, you'll need to install the actual nvidia drivers. The easiest way to find out which package on Debian is to install the [`nvidia-detect`](https://wiki.debian.org/NvidiaGraphicsDrivers#nvidia-detect) package, and run it to tell you the package to install:

```
Detected NVIDIA GPUs:
03:00.0 VGA compatible controller [0300]: NVIDIA Corporation GK104 [GeForce GTX 760] [10de:1187] (rev a1)

Checking card:  NVIDIA Corporation GK104 [GeForce GTX 760] (rev a1)
Your card is supported by all driver versions.
It is recommended to install the
    nvidia-driver
package.
```

It's also worth installing the [`nvidia-smi`](https://packages.debian.org/buster/nvidia-smi) package to check the GPU is being picked up correctly.

Next you'll need to make sure the drivers are loaded correctly. To do this, edit the file `/etc/modules-load.d/modules.conf` and add the following to it:

```bash
# Nvidia modules
nvidia
nvidia_uvm
```

Once that's done, you'll need to update the initramfs with `update-initramfs -u -k all`.

The final step is to add a `udev` rule to create the required device files for the nvidia driver, which for _reasons_ aren't created automatically. This is done in the `/etc/udev/rules.d/70-nvidia.rules` file:

```bash
KERNEL=="nvidia", RUN+="/bin/bash -c '/usr/bin/nvidia-smi -L && /bin/chmod 666 /dev/nvidia*'"
KERNEL=="nvidia_uvm", RUN+="/bin/bash -c '/usr/bin/nvidia-modprobe -c0 -u && /bin/chmod 0666 /dev/nvidia-uvm*'"
```

Now you can reboot, and run `nvidia-smi` to check the GPU is being detected correctly:

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.152.00   Driver Version: 418.152.00   CUDA Version: N/A      |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 760     On   | 00000000:03:00.0 N/A |                  N/A |
| 34%   31C    P5    N/A /  N/A |      1MiB /  1996MiB |     N/A      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0                    Not Supported                                       |
+-----------------------------------------------------------------------------+
```

There's my GPU being detected correctly, using driver version `418.152.00` - we'll be needing this later.

(This is just a temporary GPU until I purchase something more suited for transcoding. Don't judge me.)

As an alternative to installing through your system package manager, you may prefer to install direct from [nvidia.com](https://www.nvidia.com/Download/index.aspx). This has the downside of requiring manual updates for newer versions, but means it's much easier to match versions between the host and guest OS (more on that later).

### 2. Configure container

Next, create your container. There's nothing special about this process, just choose the OS and resource requirements for you.

Before starting your container, we need to make some changes to the config file directly to pass through the GPU. This config file will probably live in `/etc/pve/lxc/<id>.conf`, where `id` is the id of your container. You need to add the following lines:

```bash
# Allow cgroup access
lxc.cgroup.devices.allow: c 195:* rwm
lxc.cgroup.devices.allow: c 243:* rwm

# Pass through device files
lxc.mount.entry: /dev/nvidia0 dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm dev/nvidia-uvm none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-modeset dev/nvidia-modeset none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm-tools dev/nvidia-uvm-tools none bind,optional,create=file
```

These lines allow the container to communicate with the nvidia driver, and pass through the control files needed for the guest to actually communicate with the GPU. These lines probably won't work out the box, so we need to compare them to our actual control files:

```
$ ls -l /dev/nvidia*
crw-rw-rw- 1 root root 195, 254 Dec 22 20:51 /dev/nvidia-modeset
crw-rw-rw- 1 root root 243,   0 Dec 22 20:51 /dev/nvidia-uvm
crw-rw-rw- 1 root root 243,   1 Dec 22 20:51 /dev/nvidia-uvm-tools
crw-rw-rw- 1 root root 195,   0 Dec 22 20:51 /dev/nvidia0
crw-rw-rw- 1 root root 195, 255 Dec 22 20:51 /dev/nvidiactl
```

Note: If you don't see all 5 files, it probably means the drivers haven't loaded correctly. Best check the logs.

These files are character devices (as shown by the `c` at the start of the line), which the kernel module uses to communicate with the hardware. `lxc.mount.entry` binds these into the container.

The `lxc.cgroup.devices.allow` lines denote the cgroups which own the nvidia drivers. For the some files we have, `195:*` will match the groups owning those, and the `uvm` files will match `243:*`. If the config doesn't match, you'll need to change it. Note that the order doesn't matter, so long as the `cgroup` lines are before the `mount`s.

### 3. Install guest drivers

Now that the host is configured, and the control files passed through, the guest needs configuring.

The gist of the configuration is to also install the nvidia drivers, but without the kernel modules. Exactly how this is done varies between OS. For this I'm going to use Ubuntu 20.04.

To install on Ubuntu, you'll need to install the `nvidia-headless-no-dkms-418-server` package for the actual drive and `nvidia-utils-418-server` for some of the extra utils (and `nvidia-smi`). Note that the "418" in these packages matches the major version number of the driver installed on the host. If you install the wrong ones, it'll install correctly, but attempting to use the GPU will fail due to the mismatch (it's nice enough to tell you this is the issue, though).

As with the host, it's also possible to install these drivers through [nvidia.com](https://www.nvidia.com/Download/index.aspx), although be sure to run the install with `--no-kernel-module`.

### 4. Test it

Now, from your container, you should be able to run `nvidia-smi`, and it'll show the right version GPU and driver.

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.152.00   Driver Version: 418.152.00   CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 760     Off  | 00000000:03:00.0 N/A |                  N/A |
| 34%   27C    P8    N/A /  N/A |      1MiB /  1996MiB |     N/A      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0                    Not Supported                                       |
+-----------------------------------------------------------------------------+
```

This shows the GPU is detected correctly, but doesn't prove it's working correctly. The best way to do this is to actually try and use it. For me this involved installing [Jellyfin](https://jellyfin.org/downloads/), loading in some content and checking the GPU was doing the transcoding, not the CPU - Which it was!

Because it's simply passing through the device files rather than the actual PCIe device, you can repeat this process multiple times for multiple containers.

## Limitations

And now the sad part: Unfortunately this can't be scaled indefinitely. Nvidia limits their consumer GPUs to 3 concurrent sessions. This means either 3 transcode jobs from 1 container, or 1 job from each of 3 containers - doesn't matter. This only applies to _active_ sessions, so in theory you could pass the GPU through to 10 containers, just so long as only 3 were using it at once.

You can find out what your GPU supports on the [NVENC support matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new) under "Max # of concurrent sessions" - but chances are it's just 3.

Nvidia's professional line "Quadro" have no such restrictions, however you will pay a premium for this, especially for the tier of cards you'd need to play games rather than simply transcode.

Now you've got a GPU in your LXC container, go forth and do something useful with it! Like [Folding@Home](https://www.youtube.com/watch?v=KU4qOebhkfs), **Not** crypto mining!
