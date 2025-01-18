"use strict";

const DEFAULT_BANG_DICTIONARY = 
	{
		"a":"https://www.amazon.com/s/?field-keywords=",
		"b":"https://www.bing.com/search?q=",
		"bing":"https://www.bing.com/search?q=",
		"bv":"https://www.bing.com/videos?q=",
        "d": "https://dagans.dev/search?q=",
		"g":"https://www.google.com/search?hl=en&q=",
		"gh":"https://github.com/search?q=",
		"mdn":"https://developer.mozilla.org/en-US/search?q=",
		"r":"https://www.reddit.com/search?q=",
		"spotify":"https://open.spotify.com/search/",
		"w":"https://wikipedia.org/wiki/Search?search=",
		"yt":"https://www.youtube.com/results?search_query=",
	};

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
