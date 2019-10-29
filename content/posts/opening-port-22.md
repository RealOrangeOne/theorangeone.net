---
title: Opening Port 22
date: 2018-01-23
subtitle: Using an SSH reverse tunnel to bypass a firewall
---

My university has a development sever, which it uses to host our coursework without the need to setup a development environment locally. It also enables lecturers to mark our work in a controlled environment, without needing to spin up an environment, and run untrusted code on their machines, a security hole I'm more than likely to take advantage of!

For reasons unknown, only HTTP ports (80, 443) are available from machines other than those permanently on-site (even eduroam doesn't work!). Their solution to this problem is _RemoteApp_, which, like most windows products, doesn't work very well under Linux!

With coursework requiring deployment onto this server now, access to SSH is essential (besides FTP, but who really wants to use that?). But, how to get SSH access to a server, without needing to use the terrible _RemoteApp_?

## SSH Reverse Tunnels
SSH has the ability to create a reverse tunnel between 2 machines, by using a 3rd as a gateway. Assuming the destination server has the ability to SSH out of its firewall, a separate SSH connection can use that connection as a tunnel to communicate.

{{<mermaid caption="Network layout">}}
graph LR

A[Client]
B[Intermediary]

subgraph Firewall
C[Server]
end

A-->B
C-->B
{{</mermaid>}}

The intermediary server has to allow SSH connections from both the server and your client. The magic here happens because unless the server is in a highly controlled environment (where you shouldn't be doing this anyway), traffic is likely unrestricted outbound through the firewall.

### Step 1: _Opening Port 22_
Technically not opening a port, but it does sound cooler!

Create the tunnel between the server and your intermediary server. Obviously, This must be done from the server, rather than from the intermediary:

```bash
ssh -R 12345:localhost:22 intermediary-user@intermediary
```

`intermediary-user@intermediary` should be replaced with your server credentials.

This will create a tunnel from the server to the intermediary, on port `12345`. This port is arbitrary, however does have to be unused.

### Step 2: The connection
And now, to actually connect. From your local machine, simply run:

```bash
ssh -A intermediary-user@intermediary -W server-user@localhost:12345
```

After giving your credentials twice (once for the intermediary, then again for the final server), you should be met with a standard shell, on the destination server.

#### Making connection easier
SSH has many configuration options available to ease this process, such as using keys for authentication over passwords, and transparently connecting to the intermediary server when trying to connect to the server.

My personal tool of choice for managing config like this is [`assh`](https://github.com/moul/advanced-ssh-config).
