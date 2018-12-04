let bang_dictionary = DEFAULT_BANG_DICTIONARY;

function parseURL (url)
{
	// Extract the 'q' URI parameter.
	let query = /q=(:?[^&]*\![^&]*)/.exec(url);

	if (!query) {
		return;
	}

	query = query[1];

	// Extract bang value. No need for null check because '!' is here anyway,
	// and the rest is optional.
	const bang = /!(:?[^+]*)/.exec(query)[1];

	// Sanitize the query by removing bang value and replacing plus characters
	// with spaces.
	query = query.replace(/![^\+]+/, '').replace(/\++/g, ' ');

	return [query, bang];
}

function listener(req)
{
	let res;

	if ((res = parseURL(req.url))) {
		const [query, bang] = res;

		if (bang_dictionary[bang]) {
			const url = bang_dictionary[bang] + query;
			browser.tabs.update(req.tabId, { url });
		}
	}
}

browser.webRequest.onBeforeRequest.addListener(
	listener,
	{urls: ["*://duckduckgo.com/?q=*"]}
);

// Fetch settings after manual addon reloading.
browser.storage.sync.get('sets').then(function (result) {
	bang_dictionary = result.sets;
});

browser.storage.onChanged.addListener(function (changes, where){
	if (changes.sets && where == 'sync') {
		bang_dictionary = changes.sets.newValue;
	}
});
