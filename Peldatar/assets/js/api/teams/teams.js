
var teams = (function(){
    const {global} = STools;
    const LOCAL = {};
    const OPTIONS = {};

    let modulName = "Teams";

    let template = `
        <h1>Csoportok</h1>
        <div class="page-inner">
            <div class="row form lightgray">
                <div class="cell">
                    <div class="row">
                        <div class="cell">
                            <label for="name">Új Csoport neve:</label> 
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
            <div class="gridbox" id="teams-grid">

            </div>
        </div>
    `;

    const load = async () => {
        const res = await fetch('/teams');
        return res.json();
    }

    const renderGrid = async () => {
        
        const data = await load();

        const grid =  new BasicGrid({
            data, 
            headers: [
                {key: "id", text: "ID", width: "20%", sortable: true, id: true}, 
                {key: "name", text: "Elnevezés", sortable: true, editable: true, type: 'text'}
            ], 
            idKey: 'id',
            renderTo: "#teams-grid",
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
        global('teamsGrid', grid);

        grid.on('deleterow', async function(rowData){
            const res = await deleteRow(rowData.id);
            basicAlert.show(res.message);
            
        });

        grid.on('editrow', function(rowData){
            
        });

        grid.on('saverow', async function(rowData){
            const res = await saveRow(rowData);
            basicAlert.show(res.message);
        });

        saveBtn.addEventListener('click', async () => {
            const name = nameInput.value.trim();

            const res = await saveRow({name});
            basicAlert.show(res.message);
            if (res.data){
                grid.reloadWithData(res.data);
                nameInput.value = '';
            }
        });
    }

    const saveRow = async (data) => {
        const {name, id} = data;

        if (name != ''){
            const res = await fetch('/teams', {
                method: id ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name, id})
            });
            const resData = await res.json();
            return resData;
        }

        return null;
    }

    const deleteRow = async(id) => {
        const res = await fetch(`/teams/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    }

    return {
        renderTo: function(options){
            console.log(`run module ${modulName} render`);
            Object.assign(OPTIONS, options);
            render(options.renderTo)
        }, load
    }
})();
