"use strict";

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
