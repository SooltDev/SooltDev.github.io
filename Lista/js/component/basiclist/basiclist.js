
const BasicList = (function(){

    const {evalTamplate, remainProps, templateEvalToDOMList, getElement} = STools;

    const template = `
        <div class="list" data-eval="element">
            <div class="list-head">
                <span class="list-title" data-eval="title-element">teszt</span>
                <span class="list-menu list-btn" data-eval="menu-btn">…</span>
                <span class="list-del list-btn" data-eval="del-list-btn">&#128465;</span>
            </div>
            <div class="list-body">
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
                if (liText != ''){
                    this.addItem({text: liText});
                    this.inputElement.value = '';
                }
            });

            this.inputElement.addEventListener('keydown', (ev) => {
                if (ev.key == 'Enter')
                    this.addListitemBtn.click();
            });

            this.delListBtn.addEventListener('click', async () => {
                
                if (await basicAlert.confirm("Biztos, hogy le akarod törölni ezt a listát?") ){
                    this.element.remove();
                    this.trigger('delete');
                }
                
            });
        }

        addItem(item){
            const listItem = listItemElement.cloneNode(true);
            const liTextElement = listItem.querySelector('.list-item-text');
            const editBtn = listItem.querySelector('.list-item-edit-btn');
            const deleteBtn = listItem.querySelector('.list-item-del-btn');

            let extraCss = "";

            liTextElement.textContent = item.text;

            switch (true){
                case /^\?/.test(item.text):
                    listItem.classList.add('list-item-optional');
                    break;
                case /^!/.test(item.text):
                    listItem.classList.add('list-item-serious');
                    break;     
            }

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
            });

            this.listElement.appendChild(listItem);

            this.trigger('additem');

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
