const BASE = "https://duckduckgo.com/?q=";
const BANG = "%21"


const BANG_DICT = 
	{
		"w":"https://wikipedia.org/wiki/Search?search=",
		"g":"https://www.google.com/search?hl=en&q=",
		"bing":"http://www.bing.com/search?q=",
		"b":"http://www.bing.com/search?q=",
		"bv":"https://www.bing.com/videos?q=",
		"yt":"https://www.youtube.com/results?search_query=",
		"r":"https://www.reddit.com/search?q="
	}

function redirect(url)
{
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		browser.tabs.update(tabs[0].id, {url: url});
	});
}

function getURL(bang_value)
{
	return BANG_DICT[bang_value];
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
	if(search_url == null)
	{
		console.log("No client side bang");
		return;
	}

	// Strip away bang
	let query = req.url.split('&')[0];
	query = query.substr(BASE.length, bang_loc-BASE.length)
			+ query.substr(bang_loc+bang_length, query.length-bang_loc-bang_length);

	redirect(search_url+query);


}
browser.webRequest.onBeforeRequest.addListener(
	listener,
	{urls: ["*://duckduckgo.com/?q=*"]}
);
