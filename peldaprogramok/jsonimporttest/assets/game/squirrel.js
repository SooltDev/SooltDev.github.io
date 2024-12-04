import EventManager from "../js/eventmanager.js";
import { global, evalTamplate, getElement } from "../js/stools.js";
import Hole from "./hole.js";

const template = `
    <div class="squirrel"></div>
`;

class Squirrel extends EventManager{

    parentElement;
    element;
    
    constructor(){
        super(['bang']);
        this.create();
    }

    create(){
        this.element = evalTamplate(template);
        this.element.addEventListener('click', () => {
            this.trigger('bang');
        });
    }

    fromTheHole(hole){
        this.outOfHole();
        hole.element.insertAdjacentElement('afterbegin', this.element);
    }

    isInHole(hole = null){

        if (hole instanceof Hole)
            return this.element.parentElement == hole.element

        if (this.element.parentElement instanceof HTMLElement)
            return this.element.parentElement.dataset.holeIndex ? true : false;

        return false;
    }

    outOfHole(){
        if (this.element.parentElement)
            this.element.remove();
    }

}

export default Squirrel;