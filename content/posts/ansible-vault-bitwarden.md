---
title: Storing Ansible Vault password in Bitwarden
date: 2021-12-20
image: unsplash:rTC5SF27jIc
tags: [linux, self-hosting, security]
---

I've used [Ansible](https://docs.ansible.com/ansible/latest/index.html) for a number of years for the provisioning of both my [servers](https://github.com/RealOrangeOne/infrastructure) and [desktops](https://github.com/realorangeone/dotfiles). It's versatile, it's simple, it's powerful, and has a number of great features. Personally, I make all of my "playbooks" public for all for all to see, but provisioning still requires some secrets. This is where [Ansible vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html) comes in, which allows storing encrypted variables in the repository, which is decrypted at runtime using a password. Getting started with ansible vault is out of scope for this post, but there are [guides out there](https://blog.ktz.me/secret-management-with-docker-compose-and-ansible/).

Ansible vault exists to enable storing secrets safely in a public repository, encrypted using [a password](https://docs.ansible.com/ansible/latest/user_guide/vault.html#storing-and-accessing-vault-passwords). But where does _that_ password live. At some point, the secret needs to be stored somewhere in plaintext. The simplest place to put the file is just in a text file, make sure it's `.gitignore`-d, and have Ansible read from that. But that's boring, not to mention the maintenance annoyance from rotating passwords and reinstalling my devices.

There are tools like [Hashicorp Vault](https://www.hashicorp.com/products/vault) (no relation to Ansible vault), which are designed to store credentials, and provide them to tools as they need them, but that's quite a large hammer for the problem. I'm already a [Bitwarden](https://bitwarden.com/) user, and it already has my vault password in - can I use that?

Yes!

## Setting up Ansible

Whilst Ansible supports reading the vault password from a file, if said file is executable, Ansible will automatically run it, and use its output as the vault password. For example, if we change our vault password file to be:

```bash
#!/bin/sh

echo "hunter2"
```
Point our `ansible.cfg` to it:

```ini
[defaults]
vault_password_file = ./vault-pass.sh
```

Make it executable (`chmod +x`), and our vault password will be used exactly as it did before (assuming our password was "hunter2", which yours [shouldn't be](https://knowyourmeme.com/memes/hunter2)). But, that's really no better. We've gone from Ansible reading a text file with the secret baked in, to Ansible running a bash file with the secret baked in. Where's the bitwarden integration?

## Setting up Bitwarden

Because Bitwarden does all its [encryption](https://bitwarden.com/images/resources/security-white-paper-download.pdf) client side (which is good), it doesn't have an API for getting the details of specific items. Instead, Bitwarden has a [command-line tool](https://bitwarden.com/help/article/cli/) for interfacing with your vault. We can then plug this into our Ansible script to retrieve our password when we need it.

Setting up the CLI is very simple, and has nothing to do with Ansible:

1. [Install it](https://bitwarden.com/help/article/cli/#download-and-install)
2. (optional) Set a custom server: `bw config server https://vaultwarden.example.com` ([vaultwarden](https://github.com/dani-garcia/vaultwarden) is great)
3. Authenticate `bw login`, and follow the prompts. You can ignore the `$BW_SESSION` bit.

With the CLI now authenticated, you can interface with your vault all from the terminal. The command we need for this is `bw get password "whatever"` will prompt for your master password, and then print out the password for the relevant entry (in this case "whatever").

## Reading the password

Now, we know how to make Ansible execute a file to get the password, and we know how to get the password out of Bitwarden. Now to stitch them together in the best way possible: a tiny bash script!

```bash
#!/bin/bash

set -e

bw get password "Ansible vault key"
```

The keen-eyed among you may have noticed something. `bw` will prompt for your master password when trying to retrieve credentials (unless you set the session key), but how does Ansible know how to enter it? Well it's simple: It doesn't. The Ansible developers have thought ahead yet again, and pass through the relevant file handlers such the bitwarden prompt shows when running Ansible, and correctly takes the prompt - excellent!

```
$ ansible-playbook main.yml
? Master password: [hidden]

PLAY [all] **************************************************
...
```

So now, when deploying with Ansible, rather than reading the vault password from a static file, it will prompt for my bitwarden password, pull the vault password from my vault, decrypt the vault, and continue the deployment.

[My diff](https://github.com/RealOrangeOne/infrastructure/commit/9e473265a530807a5123c3f7f3d99736aca2e35a)

### Password caching

In this setup, Bitwarden will prompt you for your master password every time you run Ansible. For most, that's not a massive issue, but for some that could get quite annoying.

That thing I mentioned before, the ["session key"](https://bitwarden.com/help/article/cli/#using-a-session-key), this is where that comes in. The session key allows Bitwarden to access its credentials without prompting you for your password each time. It works by setting a `$BW_SESSION` environment variable, which future command line invocations can read and unlock the database with.

To configure this, run `bw unlock`. This will prompt you for your master password, and then display a session key environment variable to set. If you set this in the same terminal you run Ansible from, it won't prompt you for your master password any more, as ansible helpfully passes through all environment variables into the relevant password file script.

## What about the become password?

You probably shouldn't run Ansible as root, for the same reasons you shouldn't run many things as root. Given Ansible uses SSH, that would require SSH to be open to `root` anyway, which is also a bad idea. Instead, Ansible has [`become`](https://docs.ansible.com/ansible/latest/user_guide/become.html), which can use `sudo` to change user as part of individual tasks and roles.

By default, `sudo` requires your password before running things as root. It's possible to [bypass](https://linuxhandbook.com/sudo-without-password/) this, but I don't want to do that. Instead, I have Ansible prompt for my sudo password during deployment (using `-K`), which it then passes through to `sudo`.

Does the same trick we just used for the vault password work for the "become" password: absolutely!

1. Create an additional password file (`become-pass.sh`), copied from `vault-pass.sh`
2. Update the name of the Bitwarden item which contains the required password
3. Reference the new file in `ansible.cfg` under `become_password_file`

And now, Ansible will prompt for your become password file too. Unfortunately, it won't share session, so will require prompting you again.

{{<block note>}}
At the time of writing, this doesn't actually work... There's [a bug](https://github.com/ansible/ansible/issues/76530) which prevents this working for the become file. But hopefully that'll be fixed soon!
{{</block>}}

## Is this better?

Yes, absolutely!

Because Bitwarden stores its vault encrypted until it's needed, and cached locally, the vault password is never stored in plaintext anywhere. It also means that because the secret is no longer in a (`gitignore`-d) file in the repository, there's less chance of accidentally committing it and publishing all your secrets to the world (which I totally have [never done](https://github.com/RealOrangeOne/infrastructure/commit/7eaf608e3cfa363e426d101385c18be1c583eab5)). Additionally, there's no longer a separate file to sync outside the repository. Just clone the repository, and so long as I have the Bitwarden CLI configured, the credentials will flow.

Shout out to [AdventurousWay](https://www.adventurousway.com/) for giving me the idea for this, and showing that the `vault_password_file` doesn't have to contain the secret, but can also be [an executable](https://github.com/adventurousway/infrastructure/blob/main/vault_password_file.sh).

Unfortunately, I haven't fully solved my problem. Ansible is made easier, but I still have some `gitignore`-d secrets for my Terraform configuration. Terraform doesn't appear to have any easy integrations quite as nice as this for resolving secrets. Depending on how annoying that gets, Hashicorp Vault may be in my future... If you know of a better solution, please, [let me know]({{<relref "contact">}})!
