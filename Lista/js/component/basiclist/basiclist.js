
const BasicList = (function(){

    const {
        evalTamplate, remainProps, templateEvalToDOMList, getElement,
        timeStringToMS
    } = STools;

    const template = `
        <div class="list" data-eval="element" draggable="false">
            <div class="list-head" data-eval="head-element">
                <span class="list-title" data-eval="title-element">teszt</span>
                <span class="list-menu list-btn" data-eval="menu-btn"><span>…</span></span>
                <span class="list-del list-btn" data-eval="del-list-btn"></span>
            </div>
            <div class="list-body" data-eval="body-element">
                <div class="list-panel">
                    <input type="text" data-eval="input-element"><button data-eval="add-listitem-btn">+</button>
                </div>
                <ul data-eval="list-element">
                    <li data-eval="list-land" class="list-land"></li>
                </ul>
            </div>
        </div>
    `;

    const listItemTemplate = `
        <li>
            <span class="list-item-text"></span>
            <span class="list-item-del-btn list-item-btn">&#10006;</span>
            <span class="list-item-edit-btn list-item-btn">&#9998;</span>
            <span class="list-item-up">▲</span>
            <span class="list-item-down">▼</span>
        </li>
    `;

    const listItemElement = evalTamplate(listItemTemplate);

    let idIndex = 1;

    return class BasicList extends EventManager{

        element;
        parentElement;

        inputElement;
        listElement;
        titleElement;
        bodyElement;
        headElement;
        listLand;

        menuBtn;
        delListBtn;
        addListitemBtn;

        menu;

        #group; //A csoport ahova tartozik

        //#items;

        constructor(options){
            super();

            this.parentElement = getElement(options.renderTo);

            Object.assign(this, templateEvalToDOMList(template));

            Object.assign(this, {
                title: undefined,
                timestamp: Date.now()
            }, remainProps(options, 
                "title", "renderTo", "items", "timestamp", "archive", "monthly", "dayly", "weekly", "id", "group", "renewabledate"
            ));

            if (!this.archive)
                this.parentElement.appendChild(this.element);

            this.build();
        }

        //#region Build
        build(){

            this.titleElement.title = `Létrehozva: ${this.dateString}`;

            this.element.addEventListener('dragstart', () => {

            });

            this.addListitemBtn.addEventListener('click', () => {
                const liText = this.inputElement.value.trim();

                const selectedItem = this.listElement.querySelector(".list-item-selected");

                if (liText != ''){
                    if (!selectedItem){
                        this.addItem({text: liText});
                    } else {
                        selectedItem.querySelector('.list-item-text').textContent = liText;
                        selectedItem.classList.remove('list-item-selected');
                        this.#extraOptions(selectedItem, liText);
                    }

                    this.inputElement.value = '';
                }
            });

            this.inputElement.addEventListener('click', (ev) => {
                ev.stopPropagation();
            });

            this.inputElement.addEventListener('keydown', (ev) => {
                ev.stopPropagation();
                if (ev.key == 'Enter')
                    this.addListitemBtn.click();
            });

            this.delListBtn.addEventListener('click', async (evt) => {
                evt.stopPropagation();
                if (await basicAlert.confirm("Biztos, hogy le akarod törölni ezt a listát?") ){
                    this.remove();
                }
            });

            //#region popUpMenu
            this.menu = new PopUpMenu({
                renderTo: this.menuBtn,
                items: [{
                    text: "Cím szerkesztése",
                    handler: () => {
                        this.editTitle();
                    }
                },{
                    text: "Megújúló",
                    //inactive: true,
                    type: 'radio',
                    items: [
                        {
                            text: "Havi megújóló",
                            type: "check",
                            checked: this.monthly ? true : false,
                            name: "monthly",
                            handler: async () => {
                                return this.monthlyFunc();
                            }
                        },{
                            type: "check",
                            checked: this.weekly ? true : false,
                            text: "Heti megújóló",
                            inactive: true,
                            handler: async () => {
                                return this.weeklyFunc();
                            }
                        },{
                            type: "check",
                            text: "Napi megújóló",
                            checked: this.dayly ? true : false,
                            inactive: true,
                            handler: async () => {
                                return this.daylyFunc();
                            }
                        }
                    ],
                    handler: async () => {
                        
                    }
                },{separator: true},{
                    text: "Összes aktív",
                    handler: async () => {
                        if (await basicAlert.confirm(
                            "Biztos, hogy ebben a listibán, az összes elemet újra aktívvá akarod tenni?"
                        ) )
                            this.allIncomplete();
                    }
                },{
                    text: "Összes inaktív",
                    handler: async () => {
                        if (await basicAlert.confirm(
                            "Biztos, hogy ebben a listibán, az összes elemet újra inaktívvá akarod tenni?"
                        ) )
                            this.allComplete();
                    }
                },{
                    separator: true
                },{
                    text: "Kihúzottak törlése",
                    handler: async () => {
                        if (await basicAlert.confirm("Biztos, hogy eltávolítod a \"kész\" elemeket?") )
                            this.clearAllComplete();
                    }
                },{
                    text: "Összes törlése",
                    handler: async () => {
                        if (await basicAlert.confirm("Biztos, hogy törölni szeretnéd az összes listaelemet?") )
                            this.clear();
                    }
                },{separator: true},{
                    text: "Archiv",
                    type: "check",
                    checked: this.archive,
                    handler: async (menuItem) => {
                        return await basicAlert.confirm(
                            menuItem.checked ? 
                                "Biztis, hogy vissza szeretnéd állítani?" : 
                                "Biztos, hogy archiválni szeretnéd?"
                        );
                    },
                    checkHandler: (checked, menuItem) => {
                        
                        if (checked){
                            this.setData('archive', checked);
                            this.removeDOM();
                        } else {
                            this.setData('archive', false);
                            if (this.element.parentElement)
                                this.removeDOM();
                        }
                    }
                }, {
                    text: "Másolat készítése",
                    /**
                     * A másolat készítése a basicListManager-ben van megírva, arendezettség miatt.
                     * Mert a listManager-ben kell létrejönnie a másolatnak, azaz az új példánynak.
                     */
                    handler: (menuItem) => {
                        this.trigger('clone');
                    }
                }]
            });

            //#endregion

            this.menuBtn.addEventListener('click', (evt) => {
                evt.stopPropagation();
                this.menu.show();
            });

            this.headElement.addEventListener('click', (event) => {
                if (event.ctrlKey){
                    this.expand();
                    this.trigger('singleexpand');
                } else
                    this.toggle();
            });
        }
        //#endregion

        //#region inputWindow
        async inputWindow(tpl, middleware, type){
            const basicConfirm = new basicAlert.BasicInputWindow(tpl);
            console.log(this);
            
            return new Promise((resolve, reject) => {
                basicConfirm.show();
                
                basicConfirm.resolve = resolve;
                basicConfirm.reject = reject;
    
                if (middleware && typeof middleware == 'function'){
                    middleware(basicConfirm, resolve, reject);
                } else {
                    const day = basicConfirm.contentElement.querySelector(`[name="${type}"]`);
                    
                    basicConfirm.on('ok', () => {
                        this[type] = day.value;
                        resolve(true);
                    });

                    basicConfirm.on('cancel', () => {
                        if (this[type])
                            resolve(true);
                        else resolve(false);
                    });

                    basicConfirm.on('reset', () => {
                        this.removeData(type);
                        resolve(false);
                    });
                }
                
            });
        }
        //#endregion

        //#region renewable
        async monthlyFunc(){

            return this.inputWindow(`
                <div>
                    <label>Frissítés napjának kiválkasztása:</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="31" 
                        value="${this.getData('monthly') || 1}" 
                        name="monthly"
                    >
                </div>`,
                false,
                'monthly'
            );//end inputWindow
        }

        set renewabledate(ts){
            this.setData("renewabledate", ts);
        }

        get renewabledate(){
            return Number(this.getData("renewabledate"));
        }

        set monthly(v){
            let menuItem;

            if (this.menu)
                menuItem = this.menu.getByName('monthly');

            console.log(menuItem);
            

            if (v){
                this.setData('monthly', v);
                this.removeData('weekly');
                this.removeData('dayly');
                if (menuItem)
                    menuItem.check(true);
            } else if (menuItem){
                menuItem.check(false);
                this.removeData('monthly');
            }
        }

        get monthly(){
            return this.getData('monthly');
        }

        async weeklyFunc(){
            const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
            let selectStr = `<select name="weekly">`;
            const w = Number(this.weekly);
            const selectedDay = !w ? 0 : w;

            days.forEach((day, i) => {
                const ind = i + 1;
                selectStr += `<option value="${ind}" ${selectedDay == ind ? 'selected' : ''}>${day}</option>`;
            });

            selectStr += "</select>";
            return this.inputWindow(`
                <div>
                    <label>Frissítés napjának kiválkasztása:</label>
                    ${selectStr}
                </div>`, 
                false,
                'weekly'
            );
        }

        set weekly(v){
            if (v){
                this.setData('weekly', v);
                this.removeData('monthly');
                this.removeData('dayly');
            }
        }

        get weekly(){
            return this.getData('weekly');
        }

        async daylyFunc(){
            return this.inputWindow(`
                <div>
                    <label>Frissítés ideje "hh:mm" :</label>
                    <input 
                        type="time" 
                        value="${this.getData('dayly') || '00:00'}" 
                        name="dayly"
                    >
                </div>`,
                false,
                'dayly'
            );//end inputWindow
        }

        set dayly(v){
            if (v){
                this.setData('dayly', v);
                this.removeData('weekly');
                this.removeData('monthly')
            };
        }

        get dayly(){
            return this.getData('dayly');
        }

        get isRenewable() {
            if (this.dayly || this.monthly || this.weekly)
                return true;

            return false;
        }

        get renewableType(){
            return this.monthly ? "monthly" : this.weekly ? "weekly" : "dayly";
        }

        clearRenewable(){
            this.removeData('dayly');
            this.removeData('weekly');
            this.removeData('monthly')
        }

        get renewabled(){
            const now = new Date();
            const created = new Date(Number(this.timestamp));
            const renewabledate = new Date(Number(this.renewabledate));

            const renewableType = this.renewableType;

            const lastCreated = renewabledate.getTime() ? renewabledate : created;
            lastCreated.setDate(Number(this.monthly));

            const diffDays = (now - lastCreated) / (1000 * 60 * 60 * 24);

            if (renewableType == "monthly" ){
                const difDate = new Date(lastCreated);
                difDate.setDate(diffDays);
                if (difDate.getMonth() != lastCreated.getMonth()){
                    return false;
                }
            }
            
            /*
            if (renewableType == "weekly" && diffDays >= 7)
                return false;

            if (renewableType == "dayly" && diffDays > )
            */

            return true;
        }

        //#endregion

        remove(){
            this.element.remove();
            this.trigger('delete');
        }

        clear(){
            this.listElement.querySelectorAll('li:not(.list-land)')
                .forEach(li => li.remove());
        }

        clearAllComplete(){
            this.listElement.querySelectorAll('li.list-item-done')
                .forEach(li => li.remove());
        }

        #createTimer(listItem, time){
            const now = timeStringToMS(new Date().toLocaleTimeString().slice(0, 5));
            const finishTime = timeStringToMS(time);

            if (finishTime > now)
                listItem.timerId = setTimeout(() => {
                    basicAlert.show(listItem.querySelector('.list-item-text').textContent);
                }, finishTime - now);
        }

        #extraOptions(listItem, text){
            listItem.className = '';
            switch (true){
                case /^\?/.test(text):
                    listItem.classList.add('list-item-optional');
                    break;
                case /^!/.test(text):
                    listItem.classList.add('list-item-serious');
                    break;     
                case /^->/.test(text):
                    listItem.classList.add('list-item-progress');
                    break;
                case /^\d\d:\d\d/.test(text):
                    this.#createTimer(listItem, text.slice(0, 5));
                    break;
            }
        }

        #isActiveListItem(listItem){
            return !listItem.classList.contains('list-item-done');
        }

        addItem(item){
            const listItem = listItemElement.cloneNode(true);
            const liTextElement = listItem.querySelector('.list-item-text');
            const editBtn = listItem.querySelector('.list-item-edit-btn');
            const deleteBtn = listItem.querySelector('.list-item-del-btn');
            const downBtn = listItem.querySelector('.list-item-down');
            const upBtn = listItem.querySelector('.list-item-up');

            let extraCss = "";

            liTextElement.textContent = item.text;

            if (item.done)
                listItem.classList.add('list-item-done');

            /**
             * Csak akkor adja hozzá az extra opciókat, ha még nem teljesült
             * Különben csak zavarná az összképet
             */
            if (this.#isActiveListItem(listItem))
                this.#extraOptions(listItem, item.text);

            listItem.addEventListener('click', () => {
                listItem.classList.toggle('list-item-done');
                this.#changeItemPos(listItem);
            }); 

            deleteBtn.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                if (await basicAlert.confirm("Biztos, hogy le akarod törölni ezt a listaelemet?") ){
                    listItem.remove();
                    this.trigger('deletelistitem');
                }
            });

            editBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();

                const selectedItem = this.listElement.querySelector(".list-item-selected");

                if (selectedItem)
                    selectedItem.classList.remove("list-item-selected");
                
                this.inputElement.value = '';

                if (listItem != selectedItem){
                    this.inputElement.value = liTextElement.textContent;
                    listItem.classList.add("list-item-selected");
                }
            });

            function fixTop(element){
                element.style.top = '0px';
                return element.offsetHeight;
            }

            function relaseTop(element){
                element.style.top = null;
            }

            function animationReplace(element, siblingElement, direction = 'up'){
                const elTop = fixTop(element);
                const sTop = fixTop(siblingElement);

                element.style.top = (direction == 'up' ? -1 : 1 ) * sTop + 'px';
                siblingElement.style.top = (direction == 'up' ? 1 : -1 ) * elTop + 'px';

            }

            upBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (listItem.previousElementSibling){
                    console.log(listItem);
                    
                    animationReplace(listItem, listItem.previousElementSibling);
                    //*
                    setTimeout(()=>{
                        
                        relaseTop(listItem);
                        relaseTop(listItem.previousElementSibling);

                        this.listElement.insertBefore(listItem, listItem.previousElementSibling);
                    }, 250);
                //*/
                }
            });

            downBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (listItem.nextElementSibling && listItem.nextElementSibling.nextElementSibling)
                    animationReplace(listItem, listItem.nextElementSibling, 'down');
                    setTimeout(()=>{
                            
                        relaseTop(listItem);
                        relaseTop(listItem.nextElementSibling);

                        this.listElement.insertBefore(listItem, listItem.nextElementSibling.nextElementSibling);
                    }, 250);
                    
            });

            //this.listElement.appendChild(listItem);
            
            this.#changeItemPos(listItem);

            this.trigger('additem');

        }

        #changeItemPos(listItem, done = false){
            done = done || listItem.classList.contains('list-item-done');
            this.listLand.insertAdjacentElement(
                done ? 'afterend' : 'beforebegin',
                listItem
            );
        }

        expand(){
            this.bodyElement.classList.remove('list-collapse');
        }

        collapse(){
            this.bodyElement.classList.add('list-collapse');
        }

        toggle(){
            this.bodyElement.classList.toggle('list-collapse');
        }

        get isExpand(){
            !this.bodyElement.classList.contains('list-collapse');
        }

        get isCollapsed(){
            this.bodyElement.classList.contains('list-collapse');
        }

        set title(text){
            this.titleElement.textContent = text;
        }

        get title(){
            return this.titleElement.textContent;
        }

        set timestamp(ts = Date.now()){
            this.setData('timestamp', ts);
        }

        get timestamp(){
            return this.getData('timestamp');
        }

        set archive(v){
            this.setData('archive', Boolean(v));
        }

        get dateString(){
            return new Date( Number(this.getData('timestamp')) ).toLocaleDateString();
        }

        get archive(){
            return this.getData('archive') == "true" ? true : false;
        }

        set id(id){
            this.element.id = id;
        }

        get id(){
            return this.element.id;
        }

        set group(g){
            if (g instanceof BasicListManager)
                this.#group = g;
        }

        get group(){
            return this.#group;
        }

        setData(key, val){
            this.element.dataset[key] = val;
        }

        getData(key){
            return this.element.dataset[key];
        }

        removeData(key){
            delete this.element.dataset[key];
        }

        editTitle(){
            const title = this.title;
            this.titleElement.innerHTML = `<input type="text" class="list-head-input" value="${title}">`;
            const titleInput = this.titleElement.firstElementChild;

            titleInput.focus();
            
            // Set the cursor to the end
            const length = title.length;
            titleInput.setSelectionRange(length, length);

            titleInput.addEventListener('click', (ev) => {
                ev.stopPropagation();
            })

            titleInput.addEventListener('keydown', (ev) => {
                ev.stopPropagation();
                if (ev.key == "Enter"){
                    this.title = titleInput.value;
                }
            });
        }

        /**
         * Beállítja egy data object alapján a listát (inicializálja)
         * @param {object} data - {text:string, done:boolean}
         * @param {string} data.text - a lista szövege
         * @param {boolean} [data.done] - opcionális, ha true, akkor a listaelem teljesült
         */
        set items(data){
            //this.#items = data;
            //data.sort((a, b) => a.done ? 1 : -1);
            
            for (const item of data){
                this.addItem(item);
            }
        }

        get items(){
            const listItems = [];
            this.listElement.querySelectorAll('li:not(.list-land)').forEach(li => {
                const item = {
                    text: li.querySelector('.list-item-text').textContent
                };
                if (li.classList.contains('list-item-done'))
                    item.done = true;

                listItems.push(item);
            });

            return listItems;
        }

        allComplete(){
            this.listElement.querySelectorAll('li:not(.list-land)')
                .forEach(li => li.classList.add('list-item-done'));
            this.listElement.insertAdjacentElement('afterbegin', this.listLand);
        }

        allIncomplete(){
            this.listElement.querySelectorAll('li:not(.list-land)')
                .forEach(li => li.classList.remove('list-item-done'));
            this.listElement.insertAdjacentElement('beforeend', this.listLand);
        }

        get data(){
            const dataObj = {
                title: this.title,
                items: this.items,
                timestamp: this.timestamp,
                archive: this.archive
            }

            if (this.id)
                dataObj.id = this.id;
            if (this.monthly)
                dataObj.monthly = this.monthly;
            if (this.weekly)
                dataObj.weekly = this.weekly;
            if (this.dayly)
                dataObj.dayly = this.dayly;
            if (this.renewabledate)
                dataObj.renewabledate = this.renewabledate;

            return dataObj;
        }

        set data(o){

        }

        removeDOM(){
            this.element.remove();
        }

        addDOM(parentElement = this.parentElement){
            this.parentElement = parentElement;
            this.parentElement.appendChild(this.element);
        }

    }

})();

