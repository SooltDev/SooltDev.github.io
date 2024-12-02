const BasicLabel = (function(){

    const {
        evalTamplate, 
        global, 
        createElement, 
        templateEvalToDOMList, 
        getElement,
        remainProps
    } = STools;

    const template = `
        <div class="basic-labels" data-eval="element">
            <div class="basic-labels-inner" data-eval="labels-element">

            </div>
            <div class="basic-labels-controll" data-eval="controls-element">
                <button data-eval="clear-btn">Összes címke törlése</button>
            </div>
        </div>
    `;

    const labelTemplate = `
        <div class="basic-label">
            <span class="basic-label-text"></span><span class="basic-label-delete">X</span>
        </div>
    `;


    return class BasicLabel extends EventManager{

        parentElement;
        element;
        labelsElement;
        controllsElement;
        clearBtn;
        data;

        constructor(options){

            super();

            Object.assign(this,
                {data: []},
                remainProps(options, 'renderTo', 'data')
            );

            this.parentElement = getElement(options.renderTo);

            this.render();
        }

        render(){
            /**
             * Létrehozza és beírja az osztályba azokat az elemeket, amelyeket a template-ből használunk.
             */
            Object.assign(this, templateEvalToDOMList(template));

            this.clearBtn.addEventListener('click', () => {
                this.clear();
            })

            this.parentElement.appendChild(this.element);

        }

        addItems(data){
            for (const itemData of data)
                this.addItem(itemData);
        }

        addItem(item){
            const label = evalTamplate(labelTemplate);
            label.dataset.value = item.value;

            //A címke szövege
            label.firstElementChild.textContent = item.text;

            //A címke törlés gombja
            label.lastElementChild.addEventListener('click', () => {
                this.removeItem(item.value, item);
            });

            this.labelsElement.appendChild(label);

            this.data.push(item);
        }

        removeItem(val, item){
            const delItem = this.getElementByValue(val);
            const delIndexInData = this.data.findIndex( d => d.value == val);

            item = item ||  this.data.find( d => d.value == val);

            if (delItem && delIndexInData > -1){
                delItem.remove();
                this.trigger('removeitem', item);
                return this.data.splice(delIndexInData, 1);
            }
        }

        getElementByValue(v){
            return this.labelsElement.querySelector(`[data-value="${v}"]`);
        }

        clear(){
            this.data.map( d => d.value).forEach( value => this.removeItem(value));
            this.trigger('clear');
        }

        get value(){
            return this.data.map(d => d.value);
        }

        set value(v){
            if (Array.isArray(v)){
                this.clear();
                this.addItems(v);
            }
        }
    }
})();