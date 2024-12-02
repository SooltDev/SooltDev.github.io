
var mylists = (function(){
    const {global} = STools;
    const LOCAL = {
        editedId: null
    };

    let modulName = "MyLists";

    let template = `
        <div class="cpanel">
            <input type="text" name="" id="list-title" placeholder="Új lista elnevezése">
            <button id="new-list">Új Lista</button>
            <div style="width: 10px"></div>
            <button id="save-list">Listák mentése</button>
            <span class="vlsep"></span>
            <button id="save-lists">Listák exportálása JSON-ba</button>
            <span class="vlsep"></span>
            <input type="file" id="load-lists" style="display: none;">
            <button id="import-json" onclick="document.getElementById('load-lists').click();">Betöltés fájlból</button>
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

        renderTo.innerHTML = template;

        const listTitleInput = renderTo.querySelector("#list-title");
        const newListBtn = renderTo.querySelector("#new-list");
        const saveListBtn = renderTo.querySelector("#save-list");
        const exportBtn = renderTo.querySelector("#save-lists");
        const importBtn = renderTo.querySelector("#impost-json"); 
        const fileInput = renderTo.querySelector("#load-lists"); 
        const clearAllBtn = renderTo.querySelector("#clear-all-list"); 
        const listContainer = renderTo.querySelector(".list-container"); 

        listManager = new BasicListManager('listak', listContainer);

        listManager.loadStorage(listContainer);

        global('listManager', listManager);
/*
        const list = new BasicList({
            title: 'Teszt lista',
            renderTo: listContainer,
            items: [
                {text: "Lorem ipsum dolor"},
                {text: "sit amet consectetur", done: true},
                {text: "Adipisicing elit", done: true},
                {text: "Atque"},
                {text: "Necessitatibus", done: true}
            ]
        });

        listManager.addItem(list);
*/
        newListBtn.addEventListener('click', () => {
            const listTitle = listTitleInput.value.trim();

            if (listTitle == ''){
                basicAlert.show("A név mezőt kötelező kitölteni");
                return ;
            }

            if (listTitle.length < 3){
                basicAlert.show("A lista címének 3 karakternél hosszabbnak kell lennie.");
                return ;
            }

            const list = new BasicList({
                title: listTitle,
                renderTo: listContainer
            });

            list.on('delete', function(){
                //this = null;
            });

            listManager.addItem(list);

            listTitleInput.value = '';
        });

        listTitleInput.addEventListener('keydown', (ev) => {
            if (ev.key == 'Enter')
                newListBtn.click();
        });

        saveListBtn.addEventListener('click', () => {
            listManager.saveToStorage();
            basicAlert.show(`
                <p>A listát sikeresen mentettük.</p>
                <p>Azt javasoljuk, hogy a biztonság érdekében exportáld ki a listákat.</p>
            `);
        });
    }

    const destruct = () => {
        console.log(`Destructing module ${modulName}`);
        if (!destructing){
            if (listManager instanceof BasicListManager){
                listManager.saveToStorage();
            }
            destructing = true;
        }
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
