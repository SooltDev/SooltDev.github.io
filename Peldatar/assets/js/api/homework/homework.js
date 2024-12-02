
var homework = (function(){

    const {global} = STools;
    const LOCAL = {};
    const OPTIONS = {};

    let modulName = "Homework";
    let moduleURI = '/homework';

    let template = `
        <p><h1>Házi feladatok kiosztása</h1></p>
        <div class="page-inner">
            <div class="form lightgray">
                
                <div class="row">
                    <div class="cell w-30-p">
                        <label>Csoport kiválasztása:</label> 
                    </div>
                    <div class="cell" id="teams-select-ct">
                        
                    </div>
                    <div class="cell  w-30-p">
                        <button id="filter-teams" class="btn-large right mr-10 w-85-p">A csoport feladati</button>
                    </div>
                </div>
                
                <div style="height: 15px;"></div>
                <div class="row">
                    <div class="cell w-30-p">
                        <label>Feladattípus kiválasztása:</label> 
                    </div>
                    <div class="cell" id="category-select-ct">
                        
                    </div>
                    <div class="cell w-30-p">
                        <button id="filter-category" class="btn-large right mr-10  w-85-p">Kategoria szerint</button>
                    </div>
                    
                </div>

                <div style="height: 15px;"></div>
                <div class="row">
                    <div class="cell w-30-p">
                        <label>Feladatok:</label> 
                    </div>
                    <div class="cell" id="labels-ct">
                        
                    </div>
                    <div class="cell w-30-p">
                        <button id="export" class="btn-large right mr-10  w-85-p">Exportálás</button>
                    </div>
                </div>

            </div>
            <div class="gridbox" id="exercices-grid">

            </div>
        </div>
    `;

    const renderGrid = async () => {
        const data = await global('exercices').load();

        LOCAL.data = data;

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
                    //sortable: true, 
                    render: function(item){
                        return item.displayValue = LOCAL.categoryData
                            .filter( c => item.category.includes(c.id))
                            .map( c => c.name)
                            .join(', ');
                    }
                }
            ], 
            idKey: 'id',
            renderTo: "#exercices-grid",
            title: "Feladatok",
            selectable: false,
            innerEdit: false,
            pagination: true,
            numberPerPage: 15,
            multiselect: true,
        });

        return grid;
    }

    const render = async (renderTo) => {
        renderTo.innerHTML = template;

        const filterBtn = renderTo.querySelector('#filter-teams');
        const filterExBtn = renderTo.querySelector('#filter-category');
        const exportBtn = renderTo.querySelector('#export');
        const teamsSelectCt = renderTo.querySelector('#teams-select-ct');
        const categorySelectCt = renderTo.querySelector('#category-select-ct');
        const labelsCt = renderTo.querySelector('#labels-ct');

        let teamsData = await global('teams').load();
        let categoryData = await global('category').load();

        let teamsExamples = [];

        /**
         * Csoportok select létrehozása
         */
        const teamsSelect = new BasicSelect({
            data: teamsData.map( t => {return {text: t.name, value: t.id}} ),
            renderTo: teamsSelectCt,
            defaultText: "Válassz csoportot"
        });

        global('teamsSelect', teamsSelect);

        /**
         * Csoportok select létrehozása
         */
        const categorySelect = new BasicSelect({
            data: [{text: "Összes", value: 0}, ...categoryData.map( t => {return {text: t.name, value: t.id}} )],
            renderTo: categorySelectCt,
            defaultText: "Válassz Kategóriát"
        });

        global('categorySelect', categorySelect);

        /**
         * A címkék komponens létrehozása
         */

        const labels = new BasicLabel({
            renderTo: labelsCt
        });

        labels.on('removeitem', function(item){
            grid.uncheck(item.value);
        })
        global('labels', labels);

        Object.assign(LOCAL, {
            containerElement: renderTo, teamsData, teamsSelectCt, teamsSelect, categoryData
        });

        const grid = await renderGrid();
        global('exercicesGrid', grid);

        LOCAL.grid = grid;

        //#region renderrow
        grid.on('renderrow', function(row, rowItem){

            /**
             * A már kiadott feladatok soraiból törli a kiválasztás lehetőséget
             */
            if (teamsExamples.includes(rowItem.id)){
                row.classList.add('selected-example');
                const cb = row.querySelector('input[type="checkbox"]');
                if (cb){
                    cb.remove();
                }
            }

            /**
             * Visszaállítja a kijelölést, ha a feladat már benne van a labels-be, tehát hozzá van adva az exporthoz.
             * Abban az esetben, szükséges, amikor újrrenderelődnek a táblázat sorai, például lapozáskor,
             * vagy újabb adat betöltésekor, ha például szűrünk egy feladatkategóriára.
             */
            if (labels.value.includes(rowItem.id)){
                const cb = row.querySelector('input[type="checkbox"]');
                if (cb){
                    cb.checked = true;
                }
            }
        });
        //#endregion

        grid.on('check', function(checkbox, rowItem){
            if (checkbox.checked)
                labels.addItem({text: `Feladat ${rowItem.id}`, value: rowItem.id});
            else 
                labels.removeItem(rowItem.id);
        });

        /**
         * Csoport feladatinak szűrése
         * az "onrenderrow" grid esemény teszi lehetővé, hogy a kiválasztott csoport már kiadott
         * feladatait inaktívvá tegye. 
         */
        const filterExamplesByTeam = (teamsId) => {
            const team = teamsData.find(t => t.id == teamsId);
            teamsExamples = team.examples || [];
        }

        filterBtn.addEventListener('click', async () => {
            const teamsId = Number(teamsSelect.value);

            if (teamsId == undefined){
                basicAlert.show("Kérlek válassz egy csoportot, hogy listázhatóak legyenek a már kiosztott feldatok.")
                return;
            }
            
            filterExamplesByTeam(teamsId);

            labels.clear();
            
            grid.render();
        });

        /**
         * Szűrés kategóriára. Itt a meglévő adathalmazból szűrünk, tehát frontenden, mert az export is frontend.
         * Tehát a már exportra szánt feladatokank léteznie kell a böngésző memóriájában, 
         * ahhoz, hogy exportálni tudjuk a kijelült feladatokat.
         */
        filterExBtn.addEventListener('click', () => {
            const categoryId = Number(categorySelect.value);
            const {data} = LOCAL;
            let filteredData = [];

            if (categoryId == undefined){
                basicAlert.show("Előbb ki kell választanod a feldat témáját (kategóriáját)");
                return;
            }
            
            if (categoryId == 0)
                filteredData = data;
            else 
                filteredData = data.filter( d => d.category.includes(categoryId));

            grid.reloadWithData(filteredData);
        });

        exportBtn.addEventListener('click', async () => {
            const teamsId = Number(teamsSelect.value);
            const examples = labels.value;

            if (examples.length == 0){
                basicAlert.show(
                    `Előbb válaszd ki azon feladatokat, amelyeket ki szeretnél exportálni.
                    <p>A már kiadott házifeladatokat, nem lehet mégegyszer kiadni.</p>
                    <p>Ahhoz úgy kell exportálnod, hogy nem választassz ki csoportot.</p>
                    Ebben az esetben, frissítsd a menüpontot.`);
                return;
            }

            await exportExamples(examples);

            if (teamsId){
                const res = await fetch(`teams/homework`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: teamsId, examples})
                });

                const resData = await res.json();

                alert(resData.message);

                teamsData = await global('teams').load();
                
                filterExamplesByTeam(Number(teamsSelect.value));

                console.log("Before labels clear in export");
                
                labels.clear();

                console.log("After labels clear in export");
                grid.render();
            }
            
        });

        const exportExamples = async (ids) => {
            const link = document.createElement("a");
            let content = "";
            let exercicesIndex = 1;
            const {data} = LOCAL;

            for (const label of ids){
                //const example = grid.getRowDataById(label);
                const example = data.find(item => item.id == label);
                content += `/*\n\t${exercicesIndex++}.\n\t${example.text}\n*/\n\n`;
            }

            const file = new Blob([content], { type: 'text/javascript;charset=utf8' });
            link.href = URL.createObjectURL(file);
            link.download = "homework.js";
            link.click();
            URL.revokeObjectURL(link.href);
        }
        
    }

    return {
        renderTo: function(options){
            console.log(`run module ${modulName} render`);
            Object.assign(OPTIONS, options);
            render(options.renderTo)
        }
    }
})();
