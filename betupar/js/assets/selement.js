
import * as sTools from "./stools.js";
import { EventManager } from "./eventmanager.cls.js";

class SElement extends EventManager{

    element;
    parentElement;
    children = [];

    constructor(params){
        super();

        const el = sTools.getElement(params);

        if (el)
            this.element = el;
        else {
            const parentElement = sTools.getElement(params.parentElement);
            this.element = document.createElement(params.tagName || 'div');

            if (parentElement){
                this.parentElement = new SElement(parentElement);
                this.parentElement.add(this);
            }
        }
        
    }

    add(selement){
        if (selement instanceof SElement){
            if (!this.children.includes(selement))
                this.children.push(selement);
                this.element.appendChild(selement.element);
        } else {
            const el = sTools.getElement(selement);
            if (el)
                this.add(new SElement(selement));
        }
    }

    remove(sChildren){
        if (this.children.includes(sChildren)){
            sChildren.element.remove();
            const ind = this.children.indexOf(sChildren);
            this.children.splice(ind, 1);
        }

    }

    addCsss(css){
        this.element.classList.add(css);
    }

    removeCss(css){
        this.element.classList.remove(css);
    }

    toggleCss(css){
        this.element.classList.toggle(css);
    }

    addStyle(s){
        Object.assign(this.element.style, s);
    }

}

const createSElement = (p) => {
    return new SElement(p);
}

export { 
    SElement, createSElement
}