// https://developer.chrome.com/apps/match_patterns
//
// If just one url pattern is not valid, then this addon will fail for all urls
//    to debug, from chrome://extensions/ click on 'background page' for the extension and view in Console
var blocked_urls = [
    'http://www.example.com/this_url_is_blocked',
    'http://www.example.com/this_url_is_also_blocked',
    '*://*.go-mpulse.net/*',
    '*://tags.tiqcdn.com/*',
    '*://*.gstatic.com/*',
    '*://collect.tealiumiq.com/*',
    '*://stepstone.d3.comtrdc.net/*',
    '*://www.googleadservices.com/*',
    '*://ib.adnxs.com/*',
    '*://cm.g.doubleclick.net/*',
    '*://c0.adalyser.com/*',
    '*://bat.bing.com/*',
    '*://datacloud.tealiumiq.com/*',
    '*://www.googleanalytics.com/*',
    '*://www.googletagmanager.com/*',
    '*://securepubads.g.doubleclick.net/*',
    '*://*.omtrdc.net/*',
    '*://fast.fonts.net/*',
    '*://*.adobedtm.com/*'
];

var cancel_request = function() {
    return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(cancel_request, { urls: blocked_urls }, ['blocking'] );