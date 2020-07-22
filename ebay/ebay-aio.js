// ==UserScript==
// @run-at document-start
// @name        [eBay] Buy It Now, Sort Price, Gallery View, Remove Auction
// @version     1.0
// @description Auto set Buy It Now, sort by price and Gallery view parameters on Ebay search
// @include     http://www.ebay.tld/sch/*
// @include     https://www.ebay.tld/sch/*
// @grant       none
// ==/UserScript==

try {
    var url = document.location.toString();
    var updateUrl = url

    //    console.log(url);   // original URI
    updateUrl = updateQueryStringParameter(updateUrl, 'LH_Auction', ''); // remove Auction
    updateUrl = updateQueryStringParameter(updateUrl, 'LH_BIN', '1');   // Buy it NOW parameter
    updateUrl = updateQueryStringParameter(updateUrl, '_sop', '15');   // Sort by price parameter
    updateUrl = updateQueryStringParameter(updateUrl, '_dmd', '2');   // Gallery view parameter
    //    console.log(updateUrl);   // changed URI
    //    console.log(url != updateUrl);   // true = URI has changed

    if (url != updateUrl) {
        document.location = updateUrl;
    }
} catch (e) { }

// set, change or remove parameter
function updateQueryStringParameter(uri, key, value) {
    // remove parameter if empty value
    var parameterSet = (key.length && value.length > 0 ? key + "=" + value : "");
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        parameterSet = (parameterSet.length > 0 ? parameterSet + '$2' : "");
        return uri.replace(re, '$1' + parameterSet);
    } else {
        parameterSet = (parameterSet.length > 0 ? separator + parameterSet : "");
        return uri + parameterSet;
    }
}
