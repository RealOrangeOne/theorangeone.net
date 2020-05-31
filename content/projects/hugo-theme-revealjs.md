---
title: Hugo Theme RevealJS
repo: RealOrangeOne/hugo-theme-revealjs
---

RevealJS is a versatile front-end framework for creating slide show presentations in your browser using HTML. It's designed to be easy to use, and create high-quality presentations.

To create a presentation with RevealJS, you'll still need a server to run the presentation from. It's certainly possible to access presentations by opening a single file in your web browser of choice, but this is 2018, that's no fun! When we use a file server, it's also likely easier to serve and share your presentations with others, without needing 3rd-party services like [slideshare](https://www.slideshare.net), [slides](https://slides.com/) and [speakerdeck](https://speakerdeck.com/).

## _"But, what about PowerPoint?"_
Microsoft's [PowerPoint](https://products.office.com/en-gb/powerpoint) is well regarded as the best and most popular presentation tool. The issue is, I'm primarily a Linux user, so PowerPoint isn't especially an option (besides doing odd things with [wine](https://www.winehq.org/)). There are alternative tools out there, such as [LibreOffice](https://www.libreoffice.org/), [OnlyOffice](https://www.libreoffice.org/), and [WPS Office](https://www.wps.com/), but the fact I can't edit them in any editor I want, edit them with simple plain-text, and present them with nothing more than a web browser, is kind of annoying.

## Static site generators
Static site generators have been around for many years, and I'm a big fan of them. In simple, it converts a simple markup format, usually markdown, into HTML, using templates to reduce code duplication. This happens as a compilation step, and outputs exactly what needs to be served to the client.

### [Hugo](https://gohugo.io/)
Hugo is my static site generator of choice, it's powering [this website](https://github.com/realorangeone/theorangeone.net). It converts markdown into HTML just like any other static file server, only it does it incredibly quickly! Hugo also has some additional nifty features which make site development much simpler, like image resizing and live reloading!

## Static site generators + RevealJS
If we combine revealjs and a static site generator, we get many benefits. Besides the obvious fact we get to write our content as markdown rather than raw HTML (revealjs does natively support this, but conversion is done in the browser), we also get the ability to use the niceties they offer to make content development easier.

## `hugo-theme-revealjs`
`hugo-theme-revealjs` is a theme for Hugo which combines the two: a powerful static site generator, with a powerful presentation framework. The theme makes writing content east, especially for those who like content organized. Each slide is a separate markdown file, which can be grouped into sections to form the vertical slide groups Reveal is famous for. All settings and configuration options for Reveal are accessible through this theme, in an attempt to make it versatile and usable by all people.

The source for the theme is on [GitHub](https://github.com/RealOrangeOne/hugo-theme-revealjs), and can be [installed](https://gohugo.io/themes/installing-and-using-themes/) as if it were any other theme.

{{< iframe src="https://hugo-theme-revealjs.netlify.com/" >}}
Example presentation, which shows off some features of the theme.
{{< /iframe >}}

I plan on using this for any presentations I have to do in the future.
