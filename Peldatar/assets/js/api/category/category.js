
var category = (function(){
    const {global} = STools;
    const LOCAL = {editedId: null};
    const OPTIONS = {};

    let modulName = "Catgory";
    const moduleURI = '/category'

    let template = `
        <h1>Feladat kategóriák</h1>
        <div class="page-inner">
            <div class="row form lightgray">
                <div class="cell">
                    <div class="row">
                        <div class="cell">
                            <label for="name">Új kategória neve:</label> 
                        </div>
                        <div class="cell">
                            <input class="fit-cell" type="text" name="name" id="name">
                        </div>    
                    </div>
                </div>
                <div class="cell" style="width: 10%"></div>
                <div class="cell">
                    <button id="save" class="btn-large right">Mentés</button>
                </div>
            </div>
            <div class="gridbox" id="categ-grid">

            </div>
        </div>
    `;

    const load = async ()=>{
        const res = await fetch(moduleURI);
        return await res.json();
    }

    const renderGrid = async () => {
        const data = await load();

        const grid =  new BasicGrid({
            data, 
            headers: [
                {key: "id", text: "ID", width: "10%", sortable: true, id: true}, 
                {key: "name", text: "Elnevezés", sortable: true, editable: true, type: 'text'}
            ], 
            idKey: 'id',
            renderTo: "#categ-grid",
            title: "Kategóriák",
            selectable: false,
            innerEdit: true,
            actions: [
                {type: 'edit'},
                {type: 'del'},
                {type: 'save'}
            ]
        });

        return grid;
    }

    const render = async (renderTo) => {
        renderTo.innerHTML = template;

        const nameInput = renderTo.querySelector('#name');
        const saveBtn = renderTo.querySelector('#save');

        Object.assign(LOCAL, {nameInput, saveBtn, containerElement: renderTo});

        const grid = await renderGrid();
        global('categoryGrid', grid);

        grid.on('deleterow', async function(rowData){
            const res = await deleteRow(rowData.id);
        });

        grid.on('editrow', function(rowData){
            console.log(rowData);
        });

        grid.on('saverow', async function(rowData){
            const res = await saveRow(rowData);
            
        });
        saveBtn.addEventListener('click', async () => {
            const name = nameInput.value.trim();

            const res = await saveRow({name});
            if (res.data){
                grid.reloadWithData(res.data);
                nameInput.value = '';
            }
        });
    }

    const saveRow = async (data) => {
        const {name, id} = data;

        if (name != ''){
            const res = await fetch(moduleURI, {
                method: id ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name, id})
            });
            const resData = await res.json();
            basicAlert.show(resData.message);
            return resData;
        }

        return null;
    }

    const deleteRow = async(id) => {
        const res = await fetch(`${moduleURI}/${id}`, {
            method: "DELETE"
        });
        const resData = await res.json();
        basicAlert.show(resData.message);
    }

    return {
        renderTo: function(options){
            console.log(`run module ${modulName} render`);
            Object.assign(OPTIONS, options);
            render(options.renderTo);
        }, load
    }
})();
