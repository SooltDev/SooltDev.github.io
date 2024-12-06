
var groupedlist = (function(){
    const {global} = STools;
    const LOCAL = {
        editedId: null
    };

    let modulName = "MyLists";

    let template = `
        <div class="cpanel">
            <input type="text" name="" id="list-title" placeholder="Lista címe">
            <button id="new-list">Új Lista</button>
            <div style="width: 10px"></div>
            <button id="save-list">Listák mentése</button>
            <span class="vlsep"></span>
            <button id="save-lists">Exportálás</button>
            <span class="vlsep"></span>
            <input type="file" id="load-lists" style="display: none;">
            <button id="import-json">Importálás</button>
            <span class="vlsep"></span>
            <button id="clear-all-list" class="hard">Listák törlése</button>
        </div>
        <div class="list-container">

        </div>
    `;

    let destructing = true;

    let listManager;

    const render = async (renderTo) => {

        destructing = false;

        //renderTo.innerHTML = template;

        const listGroupManager = new BasicListGroupManager({
            renderTo
        });

        listGroupManager.loadStorage();

        global('listGroupManager', listGroupManager);

    }

    const destruct = () => {
        console.log(`Destructing module ${modulName}`);
        
    }

    return {
        renderTo: function(options){
            console.log(`run module ${modulName} render`);
            Object.assign(LOCAL, options);
            render(options.renderTo);
        },
        destruct
    }
})();
