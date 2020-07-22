// ==UserScript==
// @name         [Amazon] Highlight Resellers
// @version      1.0
// @description  Enlarges the seller information to make it more visible
// @author       https://github.com/n1ckDotEXE/
// @namespace    Modified from Graphen
// @include      /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|ae|fr|de|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @grant        none
// @noframes
// @icon         https://www.amazon.com/favicon.ico
// ==/UserScript==

/* jshint esversion: 6 */
(function (doc) {
    'use strict';

    const detectionValidList = [
        //British English
        "Dispatched from and sold by Amazon.",
        "Dispatched from and sold by Amazon EU Sarl.",
        //Canadian English
        "Ships from and sold by Amazon.ca.",
        //American English
        "Ships from and sold by Amazon.com Services LLC.",
        //Australian English
        "Ships from and sold by Amazon US.",
        //United Arab Emirates English
        "Ships from and sold by Amazon.ae.",
        //German
        "Verkauf und Versand durch Amazon.",
        "Verkauf und Versand durch Amazon EU Sarl.",
        //Spanish
        "Vendido y enviado por Amazon.",
        "Vendido y enviado por Amazon EU Sarl.",
        //French
        "Expédié et vendu par Amazon.",
        "Expédié et vendu par Amazon EU Sarl.",
        //Italian
        "Venduto e spedito da Amazon.",
        "Venduto e spedito da Amazon EU Sarl.",
        //Dutch
        "Verzonden en verkocht door Amazon.",
        "Verzonden en verkocht door Amazon EU Sarl.",
        //Mexican / Spanish
        "Vendido y enviado por Amazon México.",
        //Brazilian / Portuguese
        "Enviado e vendido por Amazon.com.br.",
        //Japanese
        "この商品は、Amazon.co.jp が販売、発送します。"
    ];

    function highlight() {
        var merchInfo = doc.getElementById("merchant-info");
        if (merchInfo) {
            console.log("Merchant Info: " + merchInfo.innerText.trim());
            if (detectionValidList.includes(merchInfo.innerText.trim())) {
                merchInfo.style.color = "green";
            }
            else {
                merchInfo.style.font = "bold 40px arial";
                merchInfo.style.color = "red";
                // Style reseller name and link
                let body = doc.querySelector('body');
                let fontColor = window.getComputedStyle(body).getPropertyValue('color');
                merchInfo.firstChild.nextSibling.style.cssText = "color: " + fontColor + " !important;";
            }
        }
    }

    highlight();

    // Execute again when item variation is selected
    var buyboxParent = doc.getElementById('desktop_buybox');
    if (buyboxParent) {
        var MO = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (nodeElement) {
                    if (nodeElement.id === "buybox") {
                        highlight();
                    }
                });
            });
        });
        MO.observe(buyboxParent, { childList: true, subtree: true });
    }

})(document);