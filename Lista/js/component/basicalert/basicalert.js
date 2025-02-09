const basicAlert = function(){

    const {createElement, getElement, evalTamplate, isObject, templateEvalToDOMList} = STools;

    const template = `
        <div class="basic-alert-window" data-eval="element">
            <div class="basic-alert-content" data-eval="content-element"></div>
            <div class="basic-alert-controll" data-eval="controlls-element">
                <button class="basic-alert-btn" data-eval="ok-btn">Rendben</button>
            </div>
        </div>
    `;

    const docBody = document.body;
    const coverUpLayer = createElement({
        style: {
            "position": "fixed",
            "top": 0,
            "left": 0,
            "right": 0,
            "bottom": 0,
            "background-color": "#000",
            "opacity": "0.5",
            "display": "none",
            "z-index": "999"
        }
    });
    docBody.appendChild(coverUpLayer);

    class BasicAlert extends EventManager{
        element;
        contentElement;
        controllsElement;
        okBtn;

        constructor(){
            super();
            this.render();
            this.afterRender();
            this.trigger('afterrender');
        }

        render(){
            Object.assign(this, templateEvalToDOMList(template));

            Object.assign(this.element.style, {
                "z-index": "9999"
            });

            this.okBtn.addEventListener('click', () => {
                this.hide();
                this.trigger('ok');
            });

            //docBody.appendChild(this.element);
        }

        afterRender(){

        }

        set okBtnText(text){
            this.okBtn.textContent = text;
        }
        get okBtnText(){
            return this.okBtn.textContent;
        }

        show(text){
            this.contentElement.innerHTML = text;
            this.element.style.display = "block";
            coverUpLayer.style.display = "block";
            docBody.appendChild(this.element);
            this.trigger('show');
            
        }

        hide(){
            this.element.style.display = "none";
            coverUpLayer.style.display = "none";
            this.element.remove();
            this.trigger('hide');
        }
    }

    class BasicConfirm extends BasicAlert{

        cancelBtn;
        resolve = function(){return true}
        reject = function(){return false}

        afterRender(){
            this.okBtn.textContent = "Igen";
            this.cancelBtn = createElement({
                tagName: "Button",
                className: "basic-alert-btn", 
                textContent: "Mégse"
            });

            this.controllsElement.insertAdjacentElement("afterbegin", this.cancelBtn);
            this.cancelBtn.addEventListener('click', () => {
                this.hide();
                this.trigger('cancel');
            });

            this.on('cancel', () => {
                this.resolve(false);
            });

            this.on('ok', () => {
                this.resolve(true);
            });
        }
    }

    class BasicInputWindow extends BasicConfirm {

        resetBtn;

        constructor(tpl){
            super();

            this.clearEvent('ok');
            this.clearEvent('cancel');

            this.contentElement.innerHTML = tpl;

            this.okBtn.textContent = "Mentés";
            this.resetBtn = createElement({
                tagName: "Button",
                className: "basic-alert-btn", 
                textContent: "Visszaállítás"
            });
            this.resetBtn.addEventListener('click', () => {
                this.hide();
                this.trigger('reset');
            });

            this.controllsElement.insertAdjacentElement("afterbegin", this.resetBtn);
        }

        show(){
            this.element.style.display = "block";
            coverUpLayer.style.display = "block";
            docBody.appendChild(this.element);
            this.trigger('show');
        }
    }

    const basicConfirm = new BasicConfirm();
    const basicAlert = new BasicAlert();

    const confirm = async (text, options) => {
        return new Promise((resolve, reject) => {
            basicConfirm.show(text);
            basicConfirm.resolve = resolve;
            basicConfirm.reject = reject;
        });
    }

    return {
        BasicConfirm,
        BasicAlert,
        BasicInputWindow,
        confirm,
        show: (text) => basicAlert.show(text),
        hide: () => basicAlert.hide(),
        confirmTest: async() => {
            if (await confirm("Biztos, hogy törölni szeretnéd?"))
                console.log("Sikeres törlés");
            else console.log("Mégse");
        }
    }
}();


