---
title: Nextcloud Sane Text Editor
date: 2020-04-19
---

As a part of Nextcloud 17, Nextcloud released [Text](https://apps.nextcloud.com/apps/text), a fancy new WYSIWYG editor for markdown with support for collaboration.

Personally, I quite liked the old interface: A simple plaintext editor with syntax highlighting, paired with a side-by-side preview. Nextcloud Text was a step in the wrong direction for me, but I completely understand why Nextcloud did it.

However, I do quite a lot through the nextcloud web UI, including write this post, so an interface I enjoy is quite important.

Another unfortunate side-effect of the new WYSIWYG text editor, is the lack of ability to edit plaintext files, such as code snippets, through the UI.

## Restoring the previous UI

Fortunately, it's possible to restore the old UI in all its glory, with the installation of 2 extra apps. Disable the Text extension, enable these, and you'll be good to go!

### [`files_texteditor`](https://github.com/nextcloud/files_texteditor/)

`files_texteditor` is an offical app which adds a simple but fammiliar plaintext editor to nextcloud, restoring the functionality of the original app from Nextcloud <16.

### [`files_markdown`](https://github.com/icewind1991/files_markdown)

`files_markdown` is the extension most people will be wanting. This is an extension which brings back the previous markdown editor, and makes it the default editor for markdown files, restoring Nextcloud's markdown editing experience to its former glory.

## Profit?

With these installed, Nextcloud finally works the way I need it to.

I didn't discover this myself, but I did spent far too long looking into it. The exact instructions were from a [GitHub issue](https://github.com/icewind1991/files_markdown/issues/136#issuecomment-560134316).
