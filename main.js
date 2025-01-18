"use strict";

function redirect(tabId, url)
{
	console.log("CSB: Redirect tab: "+tabId)
	console.log("CSB: Redirect url: "+url)
	browser.tabs.update(tabId, {url: url});
}

function listener(req)
{
    const new_url = parseUrl(req.url);
    if (new_url) {
        console.log("CSB: redirecting!");
        redirect(req.tabId, new_url);
    }
}

browser.webRequest.onBeforeRequest.addListener(
	listener,
	{
        urls: [
            "*://duckduckgo.com/*",
            "*://www.google.com/search*"
        ]
    }
);

// Fetch settings after manual addon reloading.
browser.storage.sync.get('sets').then(function (result) {
	bang_dictionary = result.sets ?? DEFAULT_BANG_DICTIONARY;
});

browser.storage.onChanged.addListener(function (changes, where){
	if (changes.sets && where == 'sync') {
		bang_dictionary = changes.sets.newValue ?? DEFAULT_BANG_DICTIONARY;
	}
});
