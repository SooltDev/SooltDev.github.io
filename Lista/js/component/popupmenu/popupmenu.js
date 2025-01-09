const PopUpMenu = (function(){

    const {
        evalTamplate, remainProps, templateEvalToDOMList, getElement,
        timeStringToMS
    } = STools;

    const template = `
        <ul class="popup-menu" data-eval="element"></ul>
    `;

    let activeMenu = null;

    document.body.addEventListener('keydown', (ev) => {
        if (ev.key == "Escape")
            document.body.click();
    });

    document.body.addEventListener('click', (ev) => {
        if (activeMenu){
            activeMenu.hide();
        }
    });

    return class PopUpMenu extends EventManager {

        element;
        parentElement;

        constructor(options){
            super();

            this.parentElement = getElement(options.renderTo);

            Object.assign(this, templateEvalToDOMList(template));

            Object.assign(this, {
                
            }, remainProps(options, "items"));

            this.hide();

            this.parentElement.appendChild(this.element);

            this.build();
        }

        build(){

        }

        addItem(item){
            const menuItem = document.createElement('li');
            this.element.appendChild(menuItem);

            if (item.separator){
                menuItem.classList.add('menu-separator');    
                return;
            }

            menuItem.textContent = item.text;
            menuItem.classList.add('menu-item');

            //#region check type
            const checkType = item.type && item.type == "check";

            if (checkType){
                menuItem.classList.add('type-check');
                if (item.checked)
                    menuItem.classList.add('checked');

                //menuItem.checked = 

                Object.defineProperty(
                    menuItem, 
                    'checked', 
                    {
                        get() { 
                            return this.classList.contains('checked');
                        }
                    }
                );
            }
            //#endregion



            if (item.type){
                menuItem.dataset.type = item.type;
            }

            if (item.inactive){
                menuItem.classList.add('menu-item-inactive');
            } else {
                menuItem.addEventListener('click', async (ev) => {
                
                    const res = await item.handler.call(this, menuItem, ev);

                    if (this.parentType == "radio"){
                        const checkedEl = this.element.querySelector('.checked');
                        if (checkedEl)
                            checkedEl.classList.remove('checked');
                    }
                    
                    if (checkType && res){
                        menuItem.classList.toggle('checked');
                    }
                    if (res && item.checkHandler && typeof item.checkHandler == 'function')
                        item.checkHandler(menuItem.classList.contains('checked'), menuItem);
                });
    
                menuItem.addEventListener('click', (ev) => {
                    ev.stopPropagation();                
                    this.hide();
                });
            }

            if (item.items){
                const popUpmenu = new PopUpMenu({
                    renderTo: menuItem,
                    items: item.items
                });
                menuItem.addEventListener('mouseover', () => {
                    popUpmenu.element.style.display = null;
                    
                });
                menuItem.addEventListener('mouseout', () => {
                    popUpmenu.element.style.display = 'none';
                });
            }
        }

        set items(items){
            for (const item of items)
                this.addItem(item);
        }

        get type(){
            return this.element.dataset.type || 'normal';
        }

        get parentType(){
            return this.parentElement.dataset.type || 'normal';
        }

        show(){
            //css class adja hogy hogy :)
            this.element.style.display = null;
            if (activeMenu && activeMenu != this){
                activeMenu.hide();
            }
            activeMenu = this;
        }

        hide(){           
            this.element.style.display = 'none';
            if (activeMenu == this)
                activeMenu = null;
        }
    }

})();