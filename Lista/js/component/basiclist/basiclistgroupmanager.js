const BasicListGroupManager = (function(){

    const {templateEvalToDOMList, evalTamplate, getElement, remainProps} = STools;

    const tabPaneTpl = `
        <div class="tab-pane" data-eval="element">
            <div class="tabs-btn" data-eval="tabs-btn-element"></div>
            <div class="tabs-content" data-eval="tab-pages-element"></div>
        </div>
    `;

    return class BasicListGroupManager extends EventManager{

        element;
        parentElement;

        tabsBtnElement;
        tabPagesElement;

        groupos = [];

        constructor(options){
            Object.assign(this, templateEvalToDOMList(tabPaneTpl));

            this.parentElement = getElement(options.renderTo);
        }

        build(){
            
        }



    }
})();