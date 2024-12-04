
import { global, evalTamplate, getElement } from "../js/stools.js";

const holeTemplate = `
    <div class="box" style="">
        <!--div class="bottom-contur"></div-->
    </div>
`;

export default class Hole{

    parentElement;
    element;
    #options;

    constructor(options, parent){
        this.parentElement = getElement(parent);

        this.options = options;

        this.render();
    }

    render(){
        this.element = evalTamplate(holeTemplate);

        this.element.dataset.holeIndex = this.options.index;

        this.x = this.options.left;
        this.y = this.options.top;

        this.parentElement.appendChild(this.element);
    }

    squirrelInHole(squirell){
        this.element.insertAdjacentElement('afterbegin', squirell.element);
    }

    isSquirreled(){
        return this.element.querySelector('.squirel') ? true : false;
    }

    get x(){
        return this.options.left;
    }

    get y(){
        return this.options.top;
    }

    set x(left){
        this.element.style.left = left + 'px';
    }

    set y(top){
        this.element.style.top = top + 'px';
    }

    set options(opt){
        this.#options = opt;
    }

    get options(){
        return this.#options;
    }

}