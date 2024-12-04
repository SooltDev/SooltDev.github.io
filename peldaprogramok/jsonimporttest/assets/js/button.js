import EventManager from "./eventmanager.js";

export default class Button extends EventManager{

    element;
    textElement = null;
    iconElement = null;

    constructor(buttnElement){

        super(['click', 'disable', 'enable']);
        
        this.element = buttnElement;

        this.textElement = this.element.querySelector('[data-element="text"]') || this.element;
        delete this.textElement.dataset.element;

        this.iconElement = this.element.querySelector('[data-element="icon"]');
        if (this.iconElement instanceof HTMLElement)
            delete this.iconElement.dataset.element;


        this.element.addEventListener('click', () => {
            if (this.enabled)
                this.trigger('click');
        });
    }

    get disabled(){
        return this.element.classList.contains('disabled');
    }

    get enabled(){
        return !this.disabled;
    }

    disable(){
        this.element.classList.add('disabled');
        console.log(this.text, 'disabled');
        this.trigger('disable');
    }

    enable(){
        this.element.classList.remove('disabled');
        console.log(this.text, 'enabled');
        this.trigger('enable');
    }

    set text(txt){
        this.textElement.textContent = txt;
    }

    get text(){
        return this.textElement.textContent;
    }

}