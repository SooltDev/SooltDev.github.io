const BasicListGroupManager = (function () {

    const { 
        templateEvalToDOMList, evalTamplate, getElement, 
        remainProps, createElement, strToAttr, global
    } = STools;

    const tabPaneTpl = `
        <div class="tab-pane" data-eval="element">
            <div class="tabs-btn" data-eval="tabs-btn-element">
                <span class="add-group" data-eval="add-group-btn">+</span>
            </div>
            <div class="cpanel">
                <input type="text" name="" id="list-title" placeholder="Lista címe" data-eval="list-title-input">
                <button id="new-list" data-eval="new-list-btn">Új Lista</button>
                <div style="width: 10px"></div>
                <button id="save-list" data-eval="save-list-btn">Listák mentése</button>
                <span class="vlsep"></span>
                <button id="save-lists" data-eval="export-btn">Exportálás</button>
                <span class="vlsep"></span>
                <input type="file" id="load-lists" style="display: none;" data-eval="file-input">
                <button id="import-json" data-eval="import-btn">Importálás</button>
                <span class="vlsep"></span>
                <button id="clear-all-list" class="hard" data-eval="clear-all-btn">Csoport törlése</button>
            </div>
            <div class="tabs-content" data-eval="tab-pages-element">
                
            </div>
        </div>
    `;

    return class BasicListGroupManager extends EventManager {

        element;
        parentElement;

        tabsBtnElement;
        tabPagesElement;
        //tabPageElement;

        addGroupBtn;

        groupsName = 'lists';

        listTitleInput;
        newListBtn;
        saveListBtn;
        fileInput;
        exportBtn
        importBtn
        clearAllBtn

        groups = {}; //{Objects:ListManager}

        activeGroup = null; //ListManager object

        constructor(options) {
            super();

            Object.assign(this, templateEvalToDOMList(tabPaneTpl));

            this.parentElement = getElement(options.renderTo);

            this.parentElement.appendChild(this.element);

            Object.assign(this, remainProps(options, 'groupsName'));

            this.build();
        }

        //#region build
        build() {



            //#region newGroup
            this.addGroupBtn.addEventListener('click', () => {
                const tabBtn = createElement({
                    tagName: "span",
                    className: "new-tab",
                    innerHTML: `<input type="text", placeholder="A listacsoport neve">`
                });

                this.tabsBtnElement.insertBefore(tabBtn, this.addGroupBtn);

                setTimeout(() => {
                    tabBtn.classList.add('new-tab-display');
                }, 1);

                const inputElement = tabBtn.firstElementChild;

                inputElement.addEventListener('keydown', (ev) => {
                    if (ev.key == "Enter" && inputElement.value != ''){
                        tabBtn.remove();
                        this.addGroup({name: inputElement.value, lists: []});
                        this.addGroupBtn.previousElementSibling.click();
                    }

                });

                global('newTab', tabBtn);

            });

            //#endregion

            this.newListBtn.addEventListener('click', () => {
                const listTitle = this.listTitleInput.value.trim();
    
                if (listTitle == ''){
                    basicAlert.show("A név mezőt kötelező kitölteni");
                    return ;
                }
    
                if (listTitle.length < 3){
                    basicAlert.show("A lista címének 3 karakternél hosszabbnak kell lennie.");
                    return ;
                }
    
                const list = this.activeGroup.createItem(listTitle);
    
                list.on('delete', function(){
                    //this = null;
                });
    
                this.listTitleInput.value = '';
            });
    
            //#region cpanel events
            this.listTitleInput.addEventListener('keydown', (ev) => {
                if (ev.key == 'Enter')
                    this.newListBtn.click();
            });
            
            this.saveListBtn.addEventListener('click', () => {
                this.saveStorage();
                basicAlert.show(`
                    <p>A listát sikeresen mentettük.</p>
                    <p>Azt javasoljuk, hogy a biztonság érdekében exportáld ki a listákat.</p>
                `);
            });
    
            this.exportBtn.addEventListener('click', () => {
                this.listExport(/*?filename*/);
            });
    
            this.fileInput.addEventListener('change', () => {
                this.listImport();
            });
    
            this.importBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
    
            this.clearAllBtn.addEventListener('click', async () => {
                if (await basicAlert.confirm("Biztos hogy törölni szeretnéd ezt a csoportot?"))
                    this.removePage(this.activeGroup.group.as);
            });
            //#endregion
        }
        //#endregion

        get data(){
            const dataStruct = [];
            const groups = this.groups;

            for (const key in groups)
                dataStruct.push(groups[key].data);

            return dataStruct;
        }
        //#region storage
        saveStorage(){
            localStorage.setItem(this.groupsName, JSON.stringify(this.data));
        }

        loadStorage(){
            
            const listsData = localStorage[this.groupsName];

            if (listsData && listsData != "undefined"){
                JSON.parse(localStorage[this.groupsName]).forEach(item => {
                    this.addGroup(item);
                });//end JSON.parse
            }//end If

            const btns = this.tabsBtnElement.children;
            console.log(btns);
            
            if (btns.length > 1)
                btns[0].click();
        }
        //#endregion
        addTab(text) {

        }

        addGroup(group) {

            group.as = group.as || strToAttr(group.name);

            const tabBtn = document.createElement("span");
            tabBtn.textContent = group.name;
            tabBtn.dataset.as = group.as;

            const tabPage = createElement({
                parentElement: this.tabPagesElement,
                className: "tab-page",
                style: {display: 'none'},
                dataset: {as: group.as}
            });

            tabBtn.addEventListener('click', () => {
                
                const active = this.tabsBtnElement.querySelector(".active");
                
                if (active && active != tabBtn) {
                    active.classList.remove("active");
                    this.tabPagesElement
                        .querySelector(`[data-as="${active.dataset.as}"]`)
                        .style.display = 'none';
                }
                if (active != tabBtn){
                    tabBtn.classList.add("active");
                    this.activeGroup = listManager;
                    this.tabPagesElement
                        .querySelector(`[data-as="${tabBtn.dataset.as}"]`)
                        .style.display = 'flex';
                }
            });

            this.addGroupBtn.insertAdjacentElement('beforebegin', tabBtn);

            const listManager = new BasicListManager(group, tabPage);
            listManager.render();

            this.groups[group.as] = listManager;

        }

        showPage(as){

        }

        hidePage(as){

        }

        renderGroups() {

        }

        clear(){
            for (const key in this.groups){
                this.removePage(key)
            }
        }

        removePage(alias){
            if (this.groups[alias]){
                this.groups[alias].clear();

                delete this.groups[alias];
                
                const tabBtn = this.tabsBtnElement.querySelector(`[data-as="${alias}"]`);
                const tabPage = this.tabPagesElement.querySelector(`[data-as="${alias}"]`);

                tabBtn.remove();
                tabPage.remove();

            }
        }
        //#region export-import
        listExport(filename){
            const link = document.createElement("a");
            const file = new Blob([JSON.stringify(this.data, null, "\t")], { type: 'application/json;charset=utf8' });
            link.href = URL.createObjectURL(file);
            link.download = filename || `${this.groupsName}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        listImport(file = this.fileInput.files[0]){
            const fr = new FileReader();

            fr.addEventListener('load', (e) => {
                console.log(e);
                this.clear();
                let lines = e.target.result;
                localStorage.setItem(this.groupsName, lines);
                this.loadStorage();
            });
            
            fr.readAsText(file);
        }
        //#endregion


    }
})();