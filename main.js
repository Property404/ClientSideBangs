"use strict";

const BANG_EXTRACTOR = /!([a-zA-Z_]+)/g;
let bang_dictionary = DEFAULT_BANG_DICTIONARY;

function redirect(tabId, url)
{
	console.log("CSB: Redirect tab: "+tabId)
	console.log("CSB: Redirect url: "+url)
	browser.tabs.update(tabId, {url: url});
}

function getURL(bang_value)
{
    console.log("CSB: get URL");
	return bang_dictionary[bang_value];
}

function listener(req)
{
    const url_params = new URLSearchParams(req.url);
    let query = url_params?.get('q');

    // No query
    if (!query) {
        return;
    }

    console.log("CSB: search query: '" + query + "'");
    const bangs = BANG_EXTRACTOR.exec(query);
    if (!bangs) {
        console.log("CSB: No bangs in '" + query + "'");
        return;
    }
    console.log("CSB: bangs found: ", bangs);

    const bang = bangs[1];
    console.log(bang);
    if (!bang) {
        return
    }
    console.log("CSB: found bang: '" + bang + "'");

	// Get search url
	const search_url = getURL(bang);
	if(!search_url)
	{
		console.log("CSB: no definition for '" + bang + "'");
		return;
	}

    query = query.replace("!"+bang, "").trim()
    console.log("CSB: trimmed query: '" + query + "'");

    console.log("CSB: redirecting!");
    redirect(req.tabId, search_url+query);
}
browser.webRequest.onBeforeRequest.addListener(
	listener,
	{
        urls: [
            "*://duckduckgo.com/*",
            "*://www.google.com/*"
        ]
    }
);

// Fetch settings after manual addon reloading.
browser.storage.sync.get('sets').then(function (result) {
    console.log("CSB: sets: " + result.sets);
	bang_dictionary = result.sets ?? DEFAULT_BANG_DICTIONARY;
});

browser.storage.onChanged.addListener(function (changes, where){
    console.log("CSB: addList");
	if (changes.sets && where == 'sync') {
		bang_dictionary = changes.sets.newValue ?? DEFAULT_BANG_DICTIONARY;
	}
});
