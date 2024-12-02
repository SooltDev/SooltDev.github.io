
var exercices = (function(){

    const {global} = STools;
    const LOCAL = {};
    const OPTIONS = {};

    let modulName = "Exercices";
    let moduleURI = '/exercices';

    let template = `
        <h1>Feladatok</h1>
        <div class="page-inner">
            <div class="form lightgray">
                
                <div class="row">
                    <div class="cell w-50-p">
                        <label for="text">Új feladat:</label> 
                    </div>
                    <div class="cell w-50-p">
                        <div class="row f-end">
                            <div class="cell w-50-p">
                                <label for="name">Feladat elnevezése:</label>
                            </div>
                            <div class="cell w-50-p">
                                <input type="text" name="name" id="name" class="w-100-p"> 
                            </div>
                        </div>
                    </div>
                </div>
                <div style="height: 5px;"></div>
                <div class="row">
                    <div class="cell">
                        <textarea class="fit-cell exercices-textarea" name="text" id="text"></textarea>
                    </div>    
                </div>
                <div style="height: 15px;"></div>
                <div class="row">
                    <div class="cell" id="category-select-ct">
                        
                    </div>
                    <div class="cell">
                        <button id="save" class="btn-large right">Mentés</button>
                        <button id="filter" class="btn-large right mr-10">Szűrés</button>
                    </div>
                    
                </div>
            </div>
            <div class="gridbox" id="teams-grid">

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
                {
                    key: "id", 
                    text: "ID", 
                    width: "5%", 
                    sortable: true, 
                    id: true
                }, 
                {
                    key: "name", 
                    text: "Elnevezés", 
                    width: "20%", 
                    sortable: true
                }, 
                {
                    key: "text", 
                    text: "Feladat", 
                    sortable: true, 
                    editable: true,
                    type: 'textarea'
                },
                {
                    key: "category", 
                    text: "Kategória",
                    width: "20%",
                    sortable: true, 
                    render: function(item){
                        return item.displayValue = LOCAL.categoryData
                            .filter( c => item.category.includes(c.id))
                            .map( c => c.name)
                            .join(', ');
                    }
                }
            ], 
            idKey: 'id',
            renderTo: "#teams-grid",
            title: "Kategóriák",
            selectable: false,
            innerEdit: false,
            pagination: true,
            numberPerPage: 15,
            //multiselect: true,
            actions: [
                {type: 'edit'},
                {type: 'del'},
                //{type: 'save'}
            ]
        });

        return grid;
    }

    const render = async (renderTo) => {
        renderTo.innerHTML = template;

        const textInput = renderTo.querySelector('#text');
        const nameInput =  renderTo.querySelector('#name');
        const saveBtn = renderTo.querySelector('#save');
        const filterBtn = renderTo.querySelector('#filter');
        const categSelectCt = renderTo.querySelector('#category-select-ct');

        const categoryData = await global('category').load();

        const categorySelect = new BasicSelect({
            data: categoryData.map( c => {return {text: c.name, value: c.id}} ),
            renderTo: categSelectCt,
            defaultText: "Kategória"
        });

        global('categorySelect', categorySelect);

        Object.assign(LOCAL, {
            textInput, saveBtn, containerElement: renderTo, 
            categoryData, categSelectCt, categorySelect
        });

        const grid = await renderGrid();
        global('exercicesGrid', grid);

        grid.on('deleterow', async function(rowData, row){
            const res = await deleteRow(rowData.id);
            console.log(res);
        });

        grid.on('editrow', function(rowData, row){
            const selectedRow = this.selectedRow;
            
            if (selectedRow){
                this.unselectRow(selectedRow);
                textInput.value = '';
                nameInput.value = '';
                categorySelect.value = null;
            }

            if (selectedRow != row){
                this.selectRow(row);
                textInput.value = rowData.text;
                nameInput.value = rowData.name;
                categorySelect.value = rowData.category[0];
            }


        });

        grid.on('saverow', async function(rowData){
            const res = await saveRow(rowData);
            alert(res.message);
        });

        saveBtn.addEventListener('click', async () => {
            const text = textInput.value.trim();
            const name = nameInput.value.trim();
            const category = [Number(categorySelect.value)];
            const id = grid.selectedId;

            console.log(category);
            
            
            const res = await saveRow({text, category, id, name});
            if (res.data){
                grid.reloadWithData(res.data);
                textInput.value = '';
                nameInput.value = '';
                categorySelect.value = null;
            }
        });

        filterBtn.addEventListener('click', async () => {
            const categoryId = Number(categorySelect.value);
            
            if (categoryId){
                const res = await fetch(`${moduleURI}/category/${categoryId}`);
                const data = await res.json();
                
                grid.reloadWithData(data);
            }

        });
    }

    const saveRow = async (data) => {
        const {text, id, category, name} = data;

        if (text != ''){
            const res = await fetch(moduleURI, {
                method: id ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text, id, category, name})
            });
            const resData = await res.json();
            return resData;
        }

        return null;
    }

    const deleteRow = async(id) => {
        const res = await fetch(`${moduleURI}/${id}`, {
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
