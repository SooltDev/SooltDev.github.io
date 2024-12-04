
const BasicList = (function(){

    const {
        evalTamplate, remainProps, templateEvalToDOMList, getElement,
        timeStringToMS
    } = STools;

    const template = `
        <div class="list" data-eval="element">
            <div class="list-head" data-eval="head-element">
                <span class="list-title" data-eval="title-element">teszt</span>
                <span class="list-menu list-btn" data-eval="menu-btn">…</span>
                <span class="list-del list-btn" data-eval="del-list-btn">&#128465;</span>
            </div>
            <div class="list-body" data-eval="body-element">
                <div class="list-panel">
                    <input type="text" data-eval="input-element"><button data-eval="add-listitem-btn">+</button>
                </div>
                <ul data-eval="list-element"></ul>
            </div>
        </div>
    `;

    const listItemTemplate = `
        <li>
            <span class="list-item-text"></span>
            <span class="list-item-del-btn list-item-btn">&#10006;</span>
            <span class="list-item-edit-btn list-item-btn">&#9998;</span>
        </li>
    `;

    const listItemElement = evalTamplate(listItemTemplate);

    return class BasicList extends EventManager{

        element;
        parentElement;

        inputElement;
        listElement;
        titleElement;
        bodyElement;
        headElement;

        menuBtn;
        delListBtn;
        addListitemBtn;

        //#items;

        constructor(options){
            super();

            this.parentElement = getElement(options.renderTo);

            Object.assign(this, templateEvalToDOMList(template));

            Object.assign(this, {
                title: undefined
            }, remainProps(options, "title", "renderTo", "items"));

            this.parentElement.appendChild(this.element);

            this.build();
        }

        build(){
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

            this.inputElement.addEventListener('keydown', (ev) => {
                if (ev.key == 'Enter')
                    this.addListitemBtn.click();
            });

            this.delListBtn.addEventListener('click', async (evt) => {
                evt.stopPropagation();
                if (await basicAlert.confirm("Biztos, hogy le akarod törölni ezt a listát?") ){
                    this.remove();
                }
            });

            this.menuBtn.addEventListener('click', (evt) => {
                evt.stopPropagation();
            });

            this.headElement.addEventListener('click', (event) => {
                if (event.ctrlKey){
                    this.collapse();
                    this.trigger('singleexpand');
                } else
                    this.toggle();
            });
        }

        remove(){
            this.element.remove();
            this.trigger('delete');
        }

        #createTimer(listItem, time){
            const now = timeStringToMS(new Date().toLocaleTimeString().slice(0, 5));
            const finishTime = timeStringToMS(time);

            if (finishTime > now)
                setTimeout(() => {
                    basicAlert.show(listItem.querySelector('.list-item-text').textContent);
                }, finishTime - now);
        }

        #extraOptions(listItem, text){
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

            let extraCss = "";

            liTextElement.textContent = item.text;

            /**
             * Csak akkor adja hozzá az extra opciókat, ha még nem teljesült
             * Különben csak zavarná az összképet
             */
            if (this.#isActiveListItem(listItem))
                this.#extraOptions(listItem, item.text);

            if (item.done)
                listItem.classList.add('list-item-done');

            listItem.addEventListener('click', () => {
                listItem.classList.toggle('list-item-done');
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

            this.listElement.appendChild(listItem);

            this.trigger('additem');

        }

        expand(){
            this.bodyElement.classList.add('list-expand');
        }

        collapse(){
            this.bodyElement.classList.remove('list-expand');
        }

        toggle(){
            this.bodyElement.classList.toggle('list-expand');
        }

        set title(text){
            this.titleElement.textContent = text;
        }

        get title(){
            return this.titleElement.textContent;
        }

        /**
         * Beállítja egy data object alapján a listát (inicializálja)
         * @param {object} data - {text:string, done:boolean}
         * @param {string} data.text - a lista szövege
         * @param {boolean} [data.done] - opcionális, ha true, akkor a listaelem teljesült
         */
        set items(data){
            //this.#items = data;
            for (const item of data){
                this.addItem(item);
            }
        }

        get items(){
            const listItems = [];
            this.listElement.querySelectorAll('li').forEach(li => {
                const item = {
                    text: li.querySelector('.list-item-text').textContent
                };
                if (li.classList.contains('list-item-done'))
                    item.done = true;

                listItems.push(item);
            });

            return listItems;
        }

        get data(){
            return {
                title: this.title,
                items: this.items
            }
        }

        set data(o){

        }

    }

})();
