---
title: KeePassXC 2.3 Migration Guide
date: 2018-03-03
image: resource:db-settings.png
---

I've been using [KeePassXC](https://keepassxc.org/) since not long after it's initial split from [KeePassX](https://www.keepassx.org/) in late 2016. I've bounced around many password managers, but KeePassXC looked to fill all the boxes:

- It's actively maintained, unfortunately unlike [KeePassX](https://www.keepassx.org/)
- It's open source, and easy to contribute to, [as I have](https://github.com/keepassxreboot/keepassxc/pull/914)
- It's got all the features I need, like TOTP and Browser Integration
- Cross platform (not KeePassXC specific)

2.3 is the first major release since the split from KeePassX, and it brings with it a lot of new features:

- Support for the [KDBX4](https://keepass.info/help/kb/kdbx_4.html) database format
- Support for binary key files, over the legacy XML format
- Native messaging for browser integration (to replace [KeePassHTTP](https://github.com/pfn/keepasshttp))
- SSH Agent integration

These new features require some changes to the system, your database file, and browser. There's little canonical documentation on how to upgrade to use these features, so I've written my own!

## KDBX4
[KDBX4](https://keepass.info/help/kb/kdbx_4.html) is the latest version of the KeePass database format. There are many format improvements, including support for Argon2, custom data in groups and file attachments to entries. Full technical information, and the exact changes can be found on the [KeePass website](https://keepass.info/help/kb/kdbx_4.html), however it's not necessary to actually know how it works.

To migrate to KDBX4, you must change the _Encryption Algorithm_ to _"ChaCha20"_, and the _Key Derivation Function_ to _"Argon2"_. These can both be done in the _Encryption_ settings for your database (Database > Database Settings).

{{% resource src="db-settings.png" %}}
The settings I'm using for my database
{{% /resource %}}

### Mobile
If you're planning to use your database on less-powerful hardware, such as a phone, you'll want to set the transformation rounds low. Argon2 is far more computationally intensive compared to PBKDF2. Using the 1-second benchmark button suggests using just 23 rounds. Where before I used 20,000 rounds of PBKDF2, I now use just 5 rounds of Argon2, to ensure it opens in reasonable time on my phone.

## New Key Files
The new key file format enables using any file as a key file for your database, rather than the XML format. This means rather than using a 45-bit key in an XML file, you can use any file of any size.

### Generating a new key

The first step to change your key, is to generate a new key. Whilst KeePassXC can generate them itself, they're not long enough for my liking (They're perfectly secure, I just like to be overkill!). 

The method suggested in the [implementation PR](https://github.com/keepassxreboot/keepassxc/issues/1325#issuecomment-353982244) is:

    dd if=/dev/urandom of=keyfile.key bs=2048 count=1
 
This generates a 2048-bit key file using the system's random number generator. This is perfectly secure enough to generate random numbers, but, I like to use something even more secure:

    head -c 65535 /dev/zero | openssl enc -aes-256-ctr -pass pass:"$(dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64)" -nosalt  > keyfile.key
    
[This](https://serverfault.com/a/714412) uses a mixture of OpenSSL, and the system's random number generator. I don't exactly know what the command is doing, but it looks more complex, so that must mean it's more cryptographically secure, right?

### Install the new key
To use the new key, you need to change the key file in the master key settings (Database > Change master key). Select the new key, and enter your current password, and apply. As this re-encrypts the database with a new master key, you can enter a new password here to change it.

Once the key is installed, I backed up the old key offline (just in case), and deleted it.

## Native Messaging
Native messaging is a way of 2 processes communicating in a secure-ish manor. In this case, it means the browser can communicate with KeePassXC in a way that means other applications can't.

Before, the browser communicated with KeePassXC over HTTP, using the [KeePassHTTP](https://github.com/pfn/keepasshttp) protocol. This had the benefit of being very easy to implement a client for, as it's just standard web traffic. The down side is that it involved starting a web server on an internal port, meaning any process on your computer could connect to the web server and thus communicate with KeePassXC, this includes browser sessions. Although requests had to be signed, it still isn't very good for security.

As this change is such a large one, there's an [Official migration guide](https://keepassxc.org/docs/keepassxc-browser-migration/), which walks through how to do it correctly.

Once your browser is completely setup and migrated, you should uninstall the extension, disable KeePassHTTP, and remove the _"KeePassHTTP Settings"_ entry, as it's not necessary any more.

## SSH Agent
KeePassXC now also has support for manipulating the SSH Agent, making it possible to store SSH keys inside KeePassXC. When the database is opened, keys are added to the agent and accessible to other SSH-enabled applications like `git` and `rsync`.

### Enabling SSH Agent support
To enable SSH agent support, visit the _"SSH Agent"_ settings pane, and tick the box. This will require restarting KeePassXC. After this, it will start communicating with the SSH agent using the socket defined at `$SSH_AUTH_SOCK`.  

### Adding your SSH Keys
With the SSH now enabled, a new _"SSH Agent"_ tab appears in the entry edit view.

To pair the key with this entry, you should attach it from the _"Advanced"_ pane. You only need to attach the private key, as this often contains the related public key as part of the file. Then, from the _"SSH Agent"_ pane, select the attachment as the primary key. This should populate the _"Public key"_ section with the respective public key. 

{{% resource src="ssh-agent-settings.png" %}}
The _"SSH Agent"_ pane showing an attached key
{{% /resource %}}

I've also set the key to be automatically added and removed from the agent, rather than manually. It'd be nice if this could be changed / defaulted globally.

Now, the keys are accessibly to use for authentication.

{{% resource src="ssh-agent-terminal.png" %}}
You can validate they're accessible using `ssh-add -l`, which should show the fingerprint of the key.
{{% /resource %}}

These new features of KeePassXC are completely optional. However, KeePassHTTP and legacy key files are considered deprecated, and may be removed in upcoming releases. So, might as well update now!
