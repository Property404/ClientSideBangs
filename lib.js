"use strict";

const DEFAULT_BANG_DICTIONARY = {
    "ddg": "https://duckduckgo.com/?q=",
    "gh":"https://github.com/search?q=",
    "g":"https://www.google.com/search?hl=en&q=",
    "mw": "https://www.merriam-webster.com/dictionary/",
    "r":"https://www.reddit.com/search?q=",
    "spotify":"https://open.spotify.com/search/",
    "w":"https://wikipedia.org/wiki/Special:Search?search=",
    "yt":"https://www.youtube.com/results?search_query=",

    // Quick way to make sure this add on works
    "test": "https://dagans.dev/search?q=",
};

const BANG_EXTRACTOR = /!([a-zA-Z_]+)/;
let bang_dictionary = DEFAULT_BANG_DICTIONARY;

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
    return new URLSearchParams(url.search)?.get('q');
}

function parseUrl(url) {
    let query = extractQuery(url)

    // No query
    if (!query) {
        return null;
    }

    const bang = extractBang(query);
    if (!bang) {
        return null;
    }

    // Get search url
    const search_url = bang_dictionary[bang];
    if(!search_url)
    {
        return null;
    }

    query = query.replace("!"+bang, "").trim()
    if (query === "") {
        return new URL(search_url).origin;
    } else {
        return search_url + query;
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
    // Just go to home if no query
    assert.equal(parseUrl("https://example?q=!l"),"https://localhost");
}
