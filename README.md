<p align="center">
<a href="https://violentmonkey.github.io/"><img src="https://github.com/n1ckDotEXE/violentmonkey-scripts/blob/master/img/violentmonkey.png"></a>
<br>
A Collection of ViolentMonkey Scripts
<br>
n1ckDotEXE
<br>
<br>
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/n1ckDotEXE/violentmonkey-scripts?style=flat-square">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/n1ckDotEXE/violentmonkey-scripts?style=flat-square">
<img alt="GitHub" src="https://img.shields.io/github/license/n1ckDotEXE/violentmonkey-scripts?style=flat-square">
</p>

---
| Browser         | Extension                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| Google Chrome   | https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag |
| Mozilla Firefox | https://addons.mozilla.org/firefox/addon/violentmonkey/                                   |
| Microsoft Edge  | https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao        |

## Script Sources:
* <a href="https://greasyfork.org/en">Greasy Fork</a>
* <a href="https://openuserjs.org/">OpenUserJS</a>
* <a href="https://github.com/search?q=%22%3D%3DUserScript%3D%3D%22">Github</a>
* <a href="https://gist.github.com/search?l=JavaScript&o=desc&q=%22%3D%3DUserScript%3D%3D%22&s=updated">Github Gists</a>
* <a href="https://userscripts-mirror.org/">Userscripts-mirror</a>

## What is a Userscript?
* <a href="https://en.wikipedia.org/wiki/Userscript">Wikipedia:</a>
> A userscript (or user script) is a program, usually written in JavaScript, for modifying web pages to augment browsing. On desktop browsers such as Firefox, they are enabled by use of a userscript manager browser extension such as Greasemonkey. The Presto-based Opera-browser-supported userscripts (referred to as User JavaScript) are placed in a designated directory. Userscripts are often referred to as Greasemonkey scripts, named after the original userscript manager for Firefox.

## What is a Userscript Manager? (ViolentMonkey)
* <a href="https://en.wikipedia.org/wiki/Userscript">Wikipedia:</a>
>A userscript manager is a type of browser extension and augmented browsing technology that provides a user interface to manage scripts. The main purpose of a userscript manager is to execute scripts on webpages as they are loaded. The most common operations performed by a userscript manager include downloading, creating, installing, organizing, deleting and editing scripts, as well as modifying script permissions (e.g. website exceptions).

## Metablock (Userscript part 1 of 2)
* Metablock starts with `// ==UserScript==`
* All lines in between start with `//` + <a href="https://violentmonkey.github.io/api/metadata-block/">@KeyValue</a>
* Metablock ends with a `// ==/UserScript==`

## Code (Userscript part 2 of 2)
A userscript runs in a browser, so it can only contain syntax that is supported by the browser.
* <a href="https://violentmonkey.github.io/guide/creating-a-userscript/">How to create a userscript</a>
* <a href="https://violentmonkey.github.io/guide/using-modern-syntax/">How to use modern syntax in a userscript</a>

## Userscript Managers Compared
|Extension|Code|Chrome|Firefox|
|-|-|-|-|
|<a href="https://violentmonkey.github.io/">ViolentMonkey</a>|Open-Source|Yes|Yes|
|<a href="https://github.com/greasemonkey/greasemonkey/">GreaseMonkey</a>|Open-Source|No|Yes|
|<a href="https://www.tampermonkey.net/">TamperMonkey</a>|Closed-Source|Yes|Yes|

## Styling Websites (CSS)
 * Add a local style sheet to a web page by adding the style sheet content to an HTML `<style>` tag and adding the tag to the page.
 * Visit <a href="https://www.userstyles.org/">UserStyles</a> and select `Install style as userscript` under the website theme to install as a script.
 * <a href="https://freestyler.ws/">FreeStyler</a> is another resource for templates but lacks the installationa as a script.
