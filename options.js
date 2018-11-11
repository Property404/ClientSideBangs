let current_id = 0;
function saveOptions(e) {
	console.log("save");
  e.preventDefault();
	/*
  browser.storage.sync.set({
    color: document.querySelector("#color").value
  });
  */
}

function restoreOptions() {

  function setCurrentChoice(result) {
	for(let key in result.sets)
	 {
		 addSet(key, results.sets[key]);
	 }

    document.querySelector("#color").value = result.color || "blue";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("sets");
  getting.then(setCurrentChoice, onError);
}

function addSet(bang, query)
{
	current_id++;
	id = ""+current_id;
	html =`<tr id="{id}">
<td><input type="text" id="{id}_bang">{bang}</input></td>
<td><input type="text" id="{id}_query">{query}</input></td>
<td><button>-</button></td>
</tr>`
	document.querySelector("#sets").innerHTML+=html;

}

function newSet()
{
	console.log("new set");
	addSet("", "");
}

console.log("!");
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("#submit", saveOptions);
document.querySelector("form").addEventListener("#add", newSet);
