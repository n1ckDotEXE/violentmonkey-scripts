// ==UserScript==
// @name         Google Image Direct View
// @version      2.3
// @namespace    Google_Image_Direct_View
// @description  An different take of Google direct image viewer
// @author       navchandar
// @include      http*://www.google.*/*tbm=isch*
// @include      http*://google.*/*tbm=isch*
// @include      https://www.google.*/search?tbm=isch*
// @include      https://google.*/search?tbm=isch*
// @include      https://www.google.co.*/*tbm=isch*
// @include      https://google.co.*/*tbm=isch*
// @run-at       document-end
// @license      MIT
// @grant        none
// @homepage     https://github.com/navchandar
// @copyright    2019, navchandar (https://openuserjs.org/users/navchandar)
// @updateURL    https://openuserjs.org/meta/navchandar/Google_Image_Direct_View.meta.js
// @downloadURL  https://openuserjs.org/install/navchandar/Google_Image_Direct_View.user.js
// @icon         data:image/png;base64,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
// ==/UserScript==

function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results
};

function has(String, search) {
    try {
        if (String.indexOf(search) > -1) {
            return true;
        }
    }
    catch (err) { }
    return false;
}

function UpdateElements(imgXpath) {
    var int = 0;
    var Img_items = getElementsByXPath(imgXpath);
    console.log(Img_items.length.toString() + " Image items found");

    if (Img_items.length > 0) {
        var Link_items = getElementsByXPath(imgXpath + "//../../../a[@href] | " + imgXpath + "//../../a[@href]");
        console.log(Link_items.length.toString() + " Image items found");

        for (var i = 0; i < Img_items.length; i++) {
            try {
                var src = Img_items[i].src;
                var uri = Link_items[i].href;
                if (uri != src) {
                    int++;
                    Link_items[i].title = "Image Loading... Wait..."

                    if (has(src, "data:image")) {
                        //Link_items[i].href = src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
                        Link_items[i].href = src;
                        Link_items[i].download = "Base64_Image.jpg";

                    }
                    else if (has(src, "https://encrypted")) {
                        var uri_enc = encodeURIComponent(uri);
                        var uri_dec = decodeURIComponent(uri_enc);

                    }
                    else {
                        Link_items[i].href = src;
                    }

                }
                else {
                    Link_items[i].title = "Image URL updated!"
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        if (int > 0) {
            console.log("Updated " + int + " image links.");
        }
    }
}

function addCssToDocument(css) {
    var style = document.createElement('style')
    style.innerText = css
    document.head.appendChild(style)
}

(function () {
    'use strict';
    var img1 = "//a[(contains(@jsaction, 'focus'))]/div/img[contains(@alt, 'Image') or contains(@alt, 'image')]";
    var img2 = "//a[(contains(@jsaction, 'focus'))]//img[contains(@alt, 'Image') or contains(@alt, 'image')]";
    var img3 = "//a[(contains(@jsaction, 'focus'))]//img[@jsaction]";
    setInterval(function () {
        UpdateElements(img1);
        UpdateElements(img2);
        UpdateElements(img3);
    }, 1000);

})();
