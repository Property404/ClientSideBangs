"use strict";

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
