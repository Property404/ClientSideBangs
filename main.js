const BASE = "https://duckduckgo.com/?q=";
const BANG = "%21"
let bang_dictionary = DEFAULT_BANG_DICTIONARY;

function redirect(tabId, url)
{
	console.log("Redirect tab: "+tabId)
	console.log("Redirect url: "+url)
	browser.tabs.update(tabId, {url: url});
}

function getURL(bang_value)
{
	return bang_dictionary[bang_value];
}

function listener(req)
{
	let bang_loc=BASE.length;//bang location
	for (;bang_loc<req.url.length;bang_loc++)
	{
		if(req.url.substr(bang_loc, 3) == BANG)
			break;
	}

	// No bangs
	if(bang_loc == req.url.length)
	{
		return;
	}

	// Identify bang 
	let bang_value = "";
	let bang_length = BANG.length;

	for(;bang_length+bang_loc<req.url.length;bang_length++)
	{
		const c = req.url[bang_length+bang_loc];
		if( c=='&' || c=='+')
		{
			if(c=='+')
				bang_length+=1;
			break;
		}
		bang_value += c;
	}

	// Get search url
	let search_url = getURL(bang_value);
	if(!search_url)
	{
		console.log("No client side bang");
		return;
	}

	// Strip away bang
	let query = req.url.split('&')[0];
	query = query.substr(BASE.length, bang_loc-BASE.length)
			+ query.substr(bang_loc+bang_length, query.length-bang_loc-bang_length);


	if(query)
	{
		console.log("Redirect");
		redirect(req.tabId, search_url+query);
	}
	else
	{
		// Redirect to main page if no query
		console.log("To main page");
		redirect(req.tabId, search_url.split("/").slice(0,3).join("/"));
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
