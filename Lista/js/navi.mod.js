
var Navi = (function(){

    const {getElement, createElement} = STools;

    const createLink = (name, text) => `<a href="/${name}">${text}</a>`;
    const createSep = text => `<h4 class="hr-title">${text}</h4>`;

    return class Navi{
    
        parentElement;
        element;
        contentElement; // ide rendereli a menü tartalmát
        data; //navi.json
        activeElement;
        activePage;

        homepage = () => {};
    
        constructor (opt){
            this.parentElement = getElement(opt.renderTo);
            this.contentElement = getElement(opt.contentRenderTo);
            this.data = opt.data;
    
            this.build();
        }

        /**
         * Menü építése, renderelése
         */
        build(){
            /**
             * MEnü lista létrehozása
             */
            this.element = createElement({
                tagName: 'ul',
                className: 'main-menu',
                parentElement: this.parentElement,
            });
            
            /**
             * Menü elemek létrehozása
             */
            this.data.forEach(item => {
                
                /**
                 * Menü elem
                 */
                const navItem = createElement({
                    tagName: 'li',
                    //textContent: item.text,
                    innerHTML: item.name ? createLink(item.name, item.text) : createSep(item.text),
                    parentElement: this.element,
                    className: item.cssName || undefined,
                    dataset: {name: item.name}
                });
    
                /**
                 * Menüre kattintva lefut a menühöz tartozó modul, ha az menüelem, és nem csak, például cím
                 */
                if (item.name)
                    navItem.firstElementChild.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        if (this.activeElement){
                            this.activeElement.classList.remove('active');

                            /**
                             * Ha az előző nyitott oldalnak, van leépülője, akkor meghívjuk.
                             * Ez valójában az adott menüpont onunload eseményének kiváltása
                             * Egy sima függvény, amibe olyan dolgokat írunk, ami akkor kell
                             * lefusson, ha elhagyunk egy menüpontot
                            */
                            if (window[this.activePage].destruct)
                                window[this.activePage].destruct();
                        }

                        /**
                         * A modulok globálisként való meghívása
                         */
                        window[item.name].renderTo({
                            renderTo: this.contentElement
                        });
                        
                        navItem.classList.add('active');
                        this.activeElement = navItem;
                        this.activePage = item.name;
                    });
    
                item.element = navItem;
                
                if (item.homepage)
                    this.homepage = () => navItem.firstElementChild.click();
            });
        }

        open(menuname){
            const menuItem = this.data.find( item => item.name == menuname );
            console.log(menuItem);
            
            if (menuItem){
                menuItem.element.firstElementChild.click();
                return true;
            }
            return false;
        }
    }
    
})();