---
title: Student Server
subtitle: The college needed a server, but didn't have any server admins
---

When I was in college, we needed a server for computing students to learn how to use FTP, and script on a server using python CGI and [PHP](http://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/#an-analogy), as well as possibly for some students coursework.
Fortunately, the college already had one, running the IT students microsite for extra course information. The problem was that it was rather out of date, and no one really new how to use it. It was up to me and my friend Alex to bring the server up to date, and get it ready for the students who needed it.

The original plan was to update the server's OS (at that stage running Ubuntu 12.04 LTS), install python and [PHP](http://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/#an-analogy) backends, add student users, and then make sure they couldn't edit each others documents. In the end, because we had no idea how the server worked, because it was setup a long time ago, we decided it was just easier to backup what we needed, then do a complete fresh install. Meaning we could set things up exactly how we wanted them, and install the tools we needed.

## User Creation
I knew we would need user accounts for all the computing teachers and the students doing A2 computing. I wasn't expecting that to amount to over 50 user accounts. Fortunately Alex had started writing a basic script for this, which I quickly modified to permission their home directories and setup passwords.

The basis of the script was to load information about the users from a database I had created (by hand) with all the required students in, create users based on this information, and configure the permissions for the user and their home directory. The script also allowed for manual entering of users with the same permission template, in case single users needed to be created. An additional feature that I added which has proved useful now that I've left is the ability to delete users manually, and from that original database, to make sure that no student will have access to the server once they have left, well, other than me that is!

### The script
Because a lot of the accounts are still active, and that new user accounts are being created in the same way the exact script cannot be shown, for security reasons.

## What next?
Now that I've left college, I've passed on the server to other people, although I do still have an account. From what I hear, fewer students are using the server. However, they have made the microsite look infinitely better!
