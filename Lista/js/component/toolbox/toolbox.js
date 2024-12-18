const Toolbox = (function(){

    const {
        evalTamplate, remainProps, templateEvalToDOMList, getElement
    } = STools;

    const template = `
        <ul class="toolbox" data-eval="element"></ul>
    `;

    let activeTool = null;

    return class Toolbox extends EventManager{

        element;
        parentElement;

        constructor(options){

            super();

            this.parentElement = getElement(options.renderTo);

            Object.assign(this, templateEvalToDOMList(template));

            Object.assign(this, {
                
            }, remainProps(options, "items"));

            this.parentElement.appendChild(this.element);

            this.build();
        }

        build(){

        }

        addItem(item){
            const menuItem = document.createElement('li');
            this.element.appendChild(menuItem);

            if (item.separator){
                menuItem.classList.add('tool-separator');    
                return;
            }
            menuItem.title = item.title || item.icon;
            menuItem.textContent = item.text;
            menuItem.classList.add('tool-btn');
            menuItem.classList.add(item.icon);
            menuItem.addEventListener('click', (ev) => {
                ev.stopPropagation();
                activeTool = menuItem;
                item.handler.call(this);
            });

        }

        set items(items){
            for (const item of items)
                this.addItem(item);
        }
    }
})();