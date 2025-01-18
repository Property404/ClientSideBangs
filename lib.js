"use strict";

const DEFAULT_BANG_DICTIONARY = 
	{
        "d": "https://dagans.dev/search?q=",
		"g":"https://www.google.com/search?hl=en&q=",
		"gh":"https://github.com/search?q=",
		"r":"https://www.reddit.com/search?q=",
		"spotify":"https://open.spotify.com/search/",
		"w":"https://wikipedia.org/wiki/Special:Search?search=",
		"yt":"https://www.youtube.com/results?search_query=",
	};

const BANG_EXTRACTOR = /!([a-zA-Z_]+)/;
let bang_dictionary = DEFAULT_BANG_DICTIONARY;

function redirect(tabId, url)
{
	console.log("CSB: Redirect tab: "+tabId)
	console.log("CSB: Redirect url: "+url)
	browser.tabs.update(tabId, {url: url});
}

function extractBang(query) {
    const bangs = BANG_EXTRACTOR.exec(query);
    const bang = bangs?.[1];

    if (bang) {
        return bang;
    }

    return null;
}

function extractQuery(url) {
    if (typeof(url) == "string") {
        url = new URL(url)
    }
    console.log("URL: "+ url);
    return new URLSearchParams(url.search)?.get('q');
}

function parseUrl(url) {
    let query = extractQuery(url)

    // No query
    if (!query) {
        console.log("No query");
        return null;
    }

    console.log("CSB: search query: '" + query + "'");

    const bang = extractBang(query);
    if (!bang) {
        return null;
    }

	// Get search url
	const search_url = bang_dictionary[bang];
	if(!search_url)
	{
		console.log("CSB: no definition for '" + bang + "'");
		return null;
	}

    query = query.replace("!"+bang, "").trim()
    console.log("CSB: trimmed query: '" + query + "'");

    return search_url + query;
}

function listener(req)
{
    const new_url = parseUrl(req.url);
    if (new_url) {
        console.log("CSB: redirecting!");
        redirect(req.tabId, new_url);
    }
}

if (typeof(window) == "undefined") {
    const assert = require('assert');

    assert(extractBang("!g hello") == "g");
    assert(extractBang("!t hello") == "t");
    assert(extractBang("  !t") == "t");
    assert(extractBang("!t") == "t");
    assert.equal(extractQuery("https://duckduckgo.com/?t=ffab&q=hi&ia=web"), "hi");
    assert.equal(extractQuery("https://duckduckgo.com/?q=hi&ia=web"), "hi");

    bang_dictionary["l"] = "https://localhost/?q=";

    assert.equal(parseUrl("https://example?q=!l+hi"),"https://localhost/?q=hi");
    assert.equal(parseUrl("https://example?q=!l"),"https://localhost/?q=");
}
