import { getElement, evalTemplate } from "../stools.js";

const tpl = (t) => `
    <div class="ticket">
        <span>${t.num}</span>
    </div>
`

export default class Ticket {

    #num;
    #lot;
    #sale;
    parentElement;
    element;
    selected = false;

    constructor (num, t, parent){
        this.parentElement = getElement(parent);
        this.#num = num;
        this.#lot = t.lot;
        this.#sale = t.sale;

        this.render();
    }

    render(){
        this.element = evalTemplate(tpl(this));

        if (!this.sale)
            this.element.addEventListener('click', () => {
                this.toggleSelected();
            });
        else
            this.element.classList.add('sold');

        this.parentElement.appendChild(this.element);
    }

    toggleSelected(){
        this.selected = this.element.classList.toggle('selected');
    }

    get num() {
        return this.#num;
    }
    get lot() {
        return this.#lot;
    }
    get sale() {
        return this.#sale;
    }
    set sale(s){
        this.#sale = Boolean(s);
    }

    set lot(l){
        this.#lot = Boolean(l);
    }

}