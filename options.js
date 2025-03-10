let current_id = 0;

function saveOptionsListener(e)
{
    e.preventDefault();
    saveOptions();
}
function saveOptions() {

    let new_sets = {};
    for(let child of document.getElementById("sets").children)
    {
        if(child.id == "table_header" || child.id == "")
        {
            continue;
        }

        const bang_id = child.id + "_bang";
        const query_id = child.id + "_query"
        new_sets[document.getElementById(bang_id).value]=
            document.getElementById(query_id).value;
    }

    browser.storage.sync.set({
        sets: new_sets?new_sets:DEFAULT_BANG_DICTIONARY
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        let sets = result.sets;
        if(sets==null || Object.keys(sets).length==0)sets = DEFAULT_BANG_DICTIONARY;
        for(let key in sets)
        {
            let value = sets[key];
            addSet(key, value);
        }
    }

    let getting = browser.storage.sync.get("sets");
    getting.then(setCurrentChoice, console.error);
}

function removeSet(id)
{
    let child = document.getElementById(""+id);
    child.parentElement.removeChild(child);
    saveOptions();
}

function addSet(bang, query)
{
    const id = ""+(++current_id);
    const tr = document.createElement("tr");

    tr.id = id;
    tr.setAttribute("id", id);
    {
        const input = tr
            .appendChild(document.createElement("td"))
            .appendChild(document.createElement("input"));
        input.type = "text";
        input.id = `${id}_bang`;
        input.value = bang;
    }
    {
        const input = tr
            .appendChild(document.createElement("td"))
            .appendChild(document.createElement("input"));
        input.type = "text";
        input.id = `${id}_query`;
        input.value = query;
    }
    {
        const input = tr
            .appendChild(document.createElement("td"))
            .appendChild(document.createElement("button"));
        input.id = `${id}_remove`;
        input.innerText = "❌";
    }

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
        document.getElementById("save").addEventListener("click", saveOptionsListener);
    }
);
