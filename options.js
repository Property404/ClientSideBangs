let current_id = 0;

function saveOptions(e) {
	e.preventDefault();

	let new_sets = {};
	for(let child of document.getElementById("sets").children)
	{
		if(child.id == "table_header" || child.id == "")
		{
			console.log("header");
			continue;
		}

		const bang_id = child.id + "_bang";
		const query_id = child.id + "_query"
		new_sets[document.getElementById(bang_id).value]=
						document.getElementById(query_id).value;
	}
	console.log(new_sets);


	browser.storage.sync.set({
		sets: new_sets?new_sets:DEFAULT_BANG_DICTIONARY
	});
}

function restoreOptions() {

	function setCurrentChoice(result) {
		let sets = result.sets;
		console.log(sets);
		if(sets==null || Object.keys(sets).length==0)sets = DEFAULT_BANG_DICTIONARY;
		for(let key in sets)
		{
			let value = sets[key];
			addSet(key, value);
		}
	}

	function onError(error) {
		console.log(`RestoreOptions:Error: ${error}`);
	}

	let getting = browser.storage.sync.get("sets");
	getting.then(setCurrentChoice, onError);
}

function removeSet(id)
{
	let child = document.getElementById(""+id);
	console.log(child);
	child.parentElement.removeChild(child);
}

function addSet(bang, query)
{
	const id = ""+(++current_id);
	let tr = document.createElement("tr");

	tr.id = id;
	tr.setAttribute("id", id);
	tr.innerHTML =`
<td><input type="text" id="${id}_bang" value="${bang}"></input></td>
<td><input type="text" id="${id}_query" value="${query}"></input></td>
<td><button id="${id}_remove">❌</button></td>`;

	document.getElementById("sets").appendChild(tr);
	document.getElementById(`${id}_remove`).addEventListener("click", function(){removeSet(id);});

}

function newSet()
{
	addSet("", "");
}

document.addEventListener("DOMContentLoaded",
	function(){
		restoreOptions();
		document.getElementById("add").addEventListener("click",newSet);
		document.getElementById("save").addEventListener("click", saveOptions);
	}
);


