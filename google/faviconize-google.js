// ==UserScript==
// @name           FaviconizeGoogle
// @namespace      http://userscripts.org/users/89794   (joeytwiddle)
// @description    Adds favicons next to Google search results.  Also works for Ecosia.
// @homepage       https://greasyfork.org/en/scripts/7664-faviconizegoogle
// @downstreamURL  http://userscripts.org/scripts/source/48636.user.js
// @license        ISC
// @version        1.6.1
// @include        /https?:\/\/((www\.)?|encrypted\.)google\.[a-z]{2,3}(\.[a-z]{2})?\/(search|webhp|\?gws_rd|\?gfe_rd)?.*/
// @include        /https?:\/\/(www\.|[a-z0-9-]*\.)?startpage\.com\/.*/
// @include        /https?:\/\/(www\.)?ecosia\.org\/(search|news|videos)?.*/
// @grant          GM_xmlhttpRequest
// @connect        *
// ==/UserScript==

var placeFaviconByUrl = false;   // The little green link below the article title
var placeFaviconAfter = false;   // Display after the link instead of before it
var placeFaviconInsideLink = false;   // Makes the favicon clickable but may also get underlined
var placeFaviconOffTheLeft = true;    // Makes the favicon sit out to the left of the main column (not on startpage)
var iconSize = 1.3;
var centraliseIconVertically = iconSize < 2;   // For smaller icon sizes, we center-align with the text, for larger we top-align

// With thanks to:
// - NV
// - darkred
// - SirCumference

// Some alternatives/remixes:
// - https://github.com/NV/faviconize-google.js (Chrome extension)
// - https://greasyfork.org/en/scripts/12395-google-favicons (works with Endless Google)
// - https://gist.github.com/Sir-Cumference/223d36cbec6473b0e6927e5c50c11568 (very short code, @match works with Greasemonkey)

// 2020-04-21 Re-enabled for Ecosia and StartPage, bypass CSP by fetching the images using GM_xmlhttpRequest.
// 2020-02-02 Reenabled Google again, because Google has stopped showing favicons.
// 2020-01-22 Disabled Google, because Google is now displaying favicons itself.
// 2020-01-22 Disabled Ecosia, because their CSP is blocking images
// 2018-10-14 Added support for ecosia.org!
// 2018-10-14 Disabled startpage.com, because their CSP has blocked favicons from loading.
// 2018-07-31 Dropped support for news.google.com, because it is now linking to local URLs, instead of to external websites.

// TODO: The relative positioning of the icon appears a bit off for sub-links of the main result.

// DONE: Provided more options where to place favicon: by the link or by the
// url, before or after, inside or outside the link.  However in my opinion
// they all suck except the default. ;)

// Broken images would be messy, but Firefox seems to hide them after a while
// anyway.  We do still see the gap from the image's padding though!
// It might be desirable to check each image actually exists/loads, or remove it.
// Is that possible, without making an http request ourselves?

// Third-party host URL detection is implemented leniently, and accordingly
// hostname extraction implemented aggressively, which results in favicons
// being given to unexpected things like bookmarklets which contain a site url.

var isEcosia = document.location.hostname === 'www.ecosia.org' || document.location.hostname === 'ecosia.org';
var isStartpage = document.location.host.match(/\bstartpage\b/);

//var bypassCSP = isEcosia || isStartpage;
// Enable it for all sites.  I think it's more secure for us to fetch the icon by GM_xhr rather than injecting it into the page.
var bypassCSP = true && typeof GM_xmlhttpRequest !== 'undefined';

if (isEcosia) {
    iconSize = iconSize * 0.6;
}

if (isStartpage) {
    // This feature doesn't work on startpage!
    placeFaviconOffTheLeft = false;
}

if (document.location.search.match(/&tbm=nws/)) {
    // This feature doesn't work on Google News search
    placeFaviconOffTheLeft = false;
    // The layout is a bit too cramped for large favicons
    iconSize = 0.9;
}

if ((isEcosia || isStartpage) && (window.innerWidth < 1000)) {
    // At lower widths, these website collapse their layout so there is no margin on the left, in which case we don't want to float the favicon out of view.
    // We dare not do this for Google, as this isn't working right now!
    placeFaviconOffTheLeft = false;
}

function findClosest(elem, tagName) {
    // eslint-disable-next-line no-cond-assign
    while (elem = elem.parentNode) {
        if (elem.tagName && elem.tagName.toLowerCase() === tagName.toLowerCase()) {
            return elem;
        }
    }
    return null;
}

function createFaviconFor(url) {
    var host = url.replace(/^[^/]*:\/\//, '').replace(/\/.*$/, '');
    // if (host == document.location.host) {
    // return null;
    // }
    // Use protocol (http/https) of current page, to avoid mixed-content warnings/failures.
    //var protocol = document.location.protocol.replace(/:$/, '');
    //console.log("[FaviconizeGoogle.user.js] protocol:" ,protocol);
    // We may fail to access favicons, e.g. if the site only offers http, or due to CORS restrictions.
    // But it is still worth tryiing, because the fallback (google's s2) offers only low-res icons.
    var urlsToTry = [
        '//' + host + '/favicon.ico',
        '//' + host + '/favicon.png',
        '//www.google.com/s2/favicons?domain=' + host,
    ];
    // Google's cache will sometimes provide a favicon we would have missed, e.g. if the site uses .png instead of .ico.  Thanks to NV for suggesting this, and to Google.
    var img = document.createElement('IMG');
    //img.src = protocol + '://'+host+'/favicon.ico';
    //img.src = '//g.etfv.co/http://" + host; // As suggested by decembre
    //img.src = 'http://api.byi.pw/favicon?url=' + protocol + "://" + host; // Another service suggested by decembre
    //img.width = '16';
    //img.height = '16';
    img.className = 'favicon';
    img.border = 0;
    img.style.display = 'none';
    var showImage = function () {
        img.style.display = '';
        if (typeof removeListeners === 'function') {
            removeListeners();
        }
    };
    if (bypassCSP) {
        var blobToDataURL = (blob, callback) => {
            var a = new FileReader();
            a.onload = function (e) {
                callback(e.target.result);
            };
            a.readAsDataURL(blob);
        };
        var tryNextUrlNoCors = () => {
            if (urlsToTry.length === 0) {
                return;
            }
            var url = 'https:' + urlsToTry.shift();
            //console.log('url:', url);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (res) => {
                    //console.log('response:', res.response);
                    blobToDataURL(res.response, (dataUrl) => {
                        //console.log('dataUrl:', dataUrl);
                        const isImage = dataUrl.startsWith('data:application/octet-stream;') || dataUrl.startsWith('data:image/');
                        if (isImage) {
                            img.src = dataUrl;
                            showImage();
                        } else {
                            tryNextUrlNoCors();
                        }
                    });
                },
            });
        };
        tryNextUrlNoCors();
    } else {
        var tryNextUrl = function () {
            if (urlsToTry.length === 0) {
                removeListeners();
                return;
            }
            img.src = urlsToTry.shift();
        };
        var removeListeners = function () {
            img.removeEventListener('load', showImage);
            img.removeEventListener('error', tryNextUrl);
        };
        img.addEventListener('load', showImage, false);
        img.addEventListener('error', tryNextUrl, false);
        tryNextUrl();
    }
    return img;
}

function getGoogleResultsLinks() {
    // var links = document.evaluate("//a[@class='l']",document,null,6,null);
    // var links = filterListBy(document.links, function(x){ return x.className=='l'; } );
    // var links = document.links.filter( function(x){ return x.className=='l'; } );

	/*
	return filterListBy(document.getElementsByTagName('a'), function (x) {
		// Most pages show links with class 'l'
		// But on pages where the first result has an indented block of sub-pages,
		// the indented links have class 'l' but all the other links have no class but parent class 'r'
		return x.className === 'l' || x.parentNode.className === 'r';
	});
	*/

    // For Google search
    // a.l
    // a.fl are small one-line sub-results.  Search "squeak" and see the Wikipedia result.
    // a.B0IOdd are lists of images which appear underneath a section on the News tab (inside .card-section)
    var links = document.querySelectorAll('.g a:not(.fl):not(.B0IOdd)');

    // For news.google.com
    if (links.length === 0) {
        //links = document.querySelectorAll('a.article:not(.esc-thumbnail-link)');
        links = document.querySelectorAll('article > a');
    }

    // For startpage.com
    if (links.length === 0) {
        //links = document.querySelectorAll('.clk > a');
        links = document.querySelectorAll('.w-gl__result-title');
    }

    // For ecosia.org
    if (links.length === 0) {
        // We use .result-body to avoid getting deep links (which were producing an unwanted second large favicon)
        links = document.querySelectorAll('.result-body .result-title');
    }

    // Remove any links which contain only one image
    links = [...links].filter(link => {
        if (link.childNodes.length === 1 && link.childNodes[0].tagName === 'IMG') {
            return false;
        }
        return true;
    });

    return links;
}

var style = document.createElement('STYLE');
var marginSide = (placeFaviconAfter ? 'left' : 'right');
var leftPadding = 1.2 * iconSize + 0.6 - 0.3 * isEcosia;
// We can try to centralise the icon with the text
// Or we can top-align the icon with the text (better for larger icon sizes)
var topPadding = centraliseIconVertically ? 0.87 - iconSize / 2 : 0.35;
var extra = placeFaviconOffTheLeft ? 'position: absolute; left: -' + leftPadding + 'em; top: ' + topPadding + 'em;' : '';
if (isEcosia) {
    var topMargin = 0.3 + centraliseIconVertically * iconSize / 13;
    // Use margin for vertical positioning
    extra += ' margin-top: ' + (-topMargin) + 'em;';
}
// If we are using placeFaviconOffTheLeft, then we don't need the paddings or alignment here
style.innerHTML = ".favicon { box-sizing: content-box; margin-" + marginSide + ": 0.3em; vertical-align: middle; width: " + iconSize + "em; height: " + iconSize + "em; padding-bottom: 0.2em; " + extra + "}";
document.getElementsByTagName('head')[0].appendChild(style);

function updateFavicons() {
    var links = getGoogleResultsLinks();

    // Allows it to work on any sites:
    if (links.length === 0) {
        links = document.getElementsByTagName("A");
    }
    //console.log("Got links:", links);

    // for (var i=0;i<links.snapshotLength;i++) {
    // var link = links.snapshotItem(i);
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        // if (link.href.match('^javascript:') || link.href.match('^#')) {
        // continue;
        // }

        var targetUrl = link.getAttribute('data-href') || link.href;

        //// Skip relative and same-host links:
        if (targetUrl.match(/^[/]/) || targetUrl.match("://" + document.location.host)) {
            continue;
        }

        //console.log("[faviconizegoogle.user.js] link.getAttribute(data-faviconized):" ,link.getAttribute("data-faviconized"));
        if (link.getAttribute("data-faviconized")) {
            // Already faviconized
            //console.log("[faviconizegoogle.user.js] Skipping");
            continue;
        }

        // Sometimes Google shows multiple results from one side, side-by-side in a table
        // In this case, adding a favicon to the later links is redundant, and tends to overlap the earlier link
        // So let's not do that
        var tableCell = findClosest(link, 'td');
        if (tableCell && tableCell.parentNode.firstChild !== tableCell) {
            // We are in a table and we are not the first cell; don't add favicon
            continue;
        }

        link.setAttribute("data-faviconized", "yes");
        var img = createFaviconFor(targetUrl);
        // <cite> is for google, .url is for startpage
        var targetNode = (placeFaviconByUrl && link.parentNode.parentNode.querySelector('cite, .url') || link);

        if (isEcosia && !placeFaviconOffTheLeft) {
            // With the default `display: block` the link will break onto a separate line from the favicon, so we do this
            link.style.display = 'inline-block';
            link.parentNode.style.whiteSpace = 'nowrap';
        }

        if (placeFaviconInsideLink) {
            if (placeFaviconAfter) {
                targetNode.appendChild(img);
            } else {
                targetNode.insertBefore(img, targetNode.firstChild);
            }
        } else {
            if (placeFaviconAfter) {
                targetNode.parentNode.insertBefore(img, targetNode.nextSibling);
            } else {
                targetNode.parentNode.insertBefore(img, targetNode);
            }
        }
    }
}

// TODO: Use MutationObserver instead?

var last_srg = null;
var results_count = -1;

function checkForUpdate() {
    // #ires was needed for the News tab, which doesn't have a .srg.  Perhaps we could use ires for all tabs.
    var new_srg = document.querySelector('.srg') || document.querySelector('#ires');
    // startpage
    new_srg = new_srg || document.querySelector('.w-gl--default');
    // ecosia
    new_srg = new_srg || document.querySelector('.mainline');
    //console.log("[FaviconizeGoogle.user.js] last_srg:" ,last_srg);
    //console.log("[faviconizegoogle.user.js] new_srg:" ,new_srg);
    var new_results_count = getGoogleResultsLinks().length;
    if (new_srg !== last_srg || new_results_count !== results_count) {
        //console.log("Page change detected!");
        updateFavicons();
        last_srg = new_srg;
        results_count = new_results_count;
    } else {
        //console.log("Pages are the same:", last_srg, new_srg);
    }
    setTimeout(checkForUpdate, 1000);
}

setTimeout(checkForUpdate, 100);