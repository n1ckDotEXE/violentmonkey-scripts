// ==UserScript==
// @name         Amazon Search Box Set Focus
// @version      1
// @grant        none
// @description	 This userscript sets the focus to the Search textbox so you can start typing right away when you go to Amazon.com
// @author       Tim Berneman
// @include      http*://*.amazon.com/*
// @namespace    https://greasyfork.org/users/14590
// ==/UserScript==

document.getElementById("twotabsearchtextbox").focus();
