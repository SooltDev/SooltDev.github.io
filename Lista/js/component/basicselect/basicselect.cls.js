const BasicSelect = (function(){

    const {
        evalTamplate, 
        global, 
        createElement, 
        templateEvalToDOMList, 
        getElement,
        remainProps
    } = STools;

    const REFS = [];

    const template = `
        <div class="select" data-eval="element">
            <div class="select-display">
                <span class="select-text" data-eval="text-element"></span>
                <span class="select-button" data-eval="button-element">▼</span>
            </div>
            <ul class="select-options" data-eval="list-element">
                
            </ul>
        </div>
    `;

    return class BasicSelect extends EventManager{

        element;
        parentElement;

        textElement;
        buttonElement;
        listElement;
        defaultTextText = 'Kérlek válassz';

        renderTo; //selector|element
        data;
        
        #items;

        constructor(options){

            super();

            Object.assign(this,
                {},
                remainProps(options, 'renderTo', 'data')
            );

            this.parentElement = getElement(options.renderTo);

            this.render();

            this.defaultTextText = options.defaultText || "Kérlek válassz";
            this.defaultText = this.defaultTextText;

            if (options.value)
                this.value = options.value;
        }

        render(){
            /**
             * Létrehozza és beírja az osztáályba azokat az elemeket, amelyeket a template-ből használunk.
             */
            Object.assign(this, templateEvalToDOMList(template));

            this.parentElement.appendChild(this.element);

            this.buttonElement.addEventListener('click', () => {
                this.toggle();
            });

            this.textElement.addEventListener('click', () => {
                this.toggle();
            });

            this.addItems(this.data);
        }

        addItems(data = this.data){
            for (const itemData of data)
                this.addItem(itemData);
        }

        addItem(item){
            
            const li = createElement({
                tagName: 'li',
                className: '',
                textContent: item.text,
                dataset: {value: item.value},
                parentElement: this.listElement
            });

            li.addEventListener('click', () => {
                this.value = li.dataset.value;
            });

            if (item.selected)
                this.value = item.value;
        }

        removeItem(val){
            const delItem = this.getElementByValue(val);
            const delIndexInData = this.data.findIndex( d => d.value == val);

            if (delItem)
                delItem.remove();

            if (delIndexInData > -1)
                return this.data.splice(delIndexInData, 1);
        }

        expand(){
            this.collapseDOM();
            this.element.classList.add("open");
            this.buttonElement.textContent = "▲";
        }

        collapse(){
            this.element.classList.remove("open");
            this.buttonElement.textContent = "▼";
        }

        collapseDOM(){
            document.querySelectorAll('.select.open').forEach(el => {
                el.classList.remove("open");
                el.querySelector('.select-button').textContent = "▼";
            });
        }

        get collapsed(){
            return this.element.classList.contains('open');
        }

        toggle(){
            this[this.collapsed ? 'collapse' : 'expand']();
        }


        toString(){
            return [...this.listElement.children]
                .map( l => l.textContent)
                .join(', ');
        }

        /**
         * Az a szöveg, ami akkor jelenik meg, amikor nincs kiválasztva semmi
         */
        set defaultText(text){
            this.textElement.textContent = text;
        }

        get defaultText(){
            return this.textElement.textContent
        }

        get selectedElement(){
            return this.listElement.querySelector('.selected');
        }

        getElementByValue(v){
            return this.listElement.querySelector(`[data-value="${v}"]`);
        }

        /**
         * Beállítja/kiválasztja a kívánt elemet
         */
        set value(v){
            const oldSelected = this.selectedElement;

            if (v){
                
                const newSelected = this.getElementByValue(v);
                
                if (newSelected && newSelected != oldSelected){
                    if (oldSelected)
                        oldSelected.classList.remove('selected');

                    newSelected.classList.add('selected');

                    this.defaultText = newSelected.textContent;

                    this.trigger('select', v);
                }
            } else{
                if (oldSelected)
                    oldSelected.classList.remove('selected');

                this.defaultText = this.defaultTextText;
            }

            this.collapse();
        }

        /**
         * Visszaadja a kiválasztott értéket, ha van kiválasztott elem
         */
        get value(){
            const selectedEl = this.selectedElement;

            if (selectedEl)
                return selectedEl.dataset.value || undefined;

            return undefined;
        }

        get values(){
            return [...this.listElement.children].map( l => l.dataset.value);
        }
    }

})();