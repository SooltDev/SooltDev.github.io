import { evalTamplate, getElement } from "./stools.js";

const template = `
   <div class="p-calculator">
        <div class="p-display">
            <div class="d-operator"></div>
            <div class="d-number">1234567890</div>
        </div>
        <div class="p-ac">AC</div>
        <div class="p-panel">
            <div class="p-button" data-number="7">7</div>
            <div class="p-button" data-number="8">8</div>
            <div class="p-button" data-number="9">9</div>
            <div class="p-button p-proc" data-proc="mult" data-sign="*">x</div>
            <div class="p-button" data-number="4">4</div>
            <div class="p-button" data-number="5">5</div>
            <div class="p-button" data-number="6">6</div>
            <div class="p-button p-proc" data-proc="div" data-sign="/">/</div>
            <div class="p-button" data-number="1">1</div>
            <div class="p-button" data-number="2">2</div>
            <div class="p-button" data-number="3">3</div>
            <div class="p-button p-proc" data-proc="sub" data-sign="-">-</div>
            <div class="p-button" data-number="0">0</div>
            <div class="p-button point">.</div>
            <div class="p-button p-proc p-proc1" data-proc="res" data-sign="=">=</div>
            <div class="p-button p-proc" data-proc="add" data-sign="+">+</div>
        </div>
    </div>
`;

export default class Calc{

    parentElement;
    element;
    displayElement;
    operatorDisplayElement;
    resultBtn;

    operand1 = 0;
    operand2 = 0;
    #operator = '';

    #newNumber = true;

    constructor(options){
        this.parentElement = getElement(options.parent);

        this.build();
    }

    build(){
        this.element = evalTamplate(template);

        this.displayElement = this.element.querySelector('.p-display .d-number');
        this.operatorDisplayElement = this.element.querySelector('.p-display .d-operator');
        this.resultBtn = this.element.querySelector('.p-button[data-sign="="]');

        this.displayElement.textContent = '0';

        
        this.element.querySelector('.p-ac').addEventListener('click', () => {
            this.ac();
        });
        
        /* Számok gépelése */

        this.element.querySelectorAll('.p-button[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                if (this.displayLength < 10){
                    if (this.#newNumber){
                        this.display = '';
                        this.#newNumber = false;
                    }
                    this.display += button.dataset.number;
                }
            });
        });

        /* tizedes pont hozzáadása */

        this.element.querySelector('.point').addEventListener('click', () => {
            if (!this.isFloat)
                this.display += '.'
        });

        /* arithmetic operator */

        this.element.querySelectorAll('.p-proc:not([data-proc="res"])').forEach( button => {
            button.addEventListener('click', () => {
                
                //this[`operand${this.operand1 == 0 ? '1' : '2'}`] = this.displayNumber;
                if (this.operand1 === 0){
                    this.operand1 = this.displayNumber;
                } else if (!this.#newNumber){
                    this.operand2 = this.displayNumber;
                    this.display = eval(`${this.operand1} ${this.operator} ${this.operand2}`);
                    this.operand1 = this.displayNumber
                }

                this.operator = button.dataset.sign;
                this.#newNumber = true;
            })
        });

        /* = operator */

        this.element.querySelector('.p-proc[data-proc="res"]').addEventListener('click', () => {

            if (this.operand1 != 0){
                this.operand2 = this.displayNumber;
                this.display = eval(`${this.operand1} ${this.operator} ${this.operand2}`);
                this.operand1 = this.displayNumber

                this.operator = '=';
                this.#newNumber = true;
            }
        });

        this.parentElement.appendChild(this.element);
    }

    get displayLength(){
        let numStr = this.displayElement.textContent;
        return numStr.includes('.') ? numStr.length - 1 : numStr.length;
    }

    get displayNumber(){
        return parseFloat(this.displayElement.textContent);
    }

    get display(){
        return this.displayElement.textContent;
    }

    set display(v){
        this.displayElement.textContent = v;
    }

    get isFloat(){
        return this.displayElement.textContent.includes('.');
    }

    set operator(op){
        this.#operator = op;
        this.operatorDisplayElement.textContent = op;
    }

    get operator(){
        return this.#operator;
    }

    ac(){
        this.operand1 = 0;
        this.operand2 = 0;
        this.operator = '';
        this.display = 0;
        this.#newNumber = true;
    }

    reset(){
        this.ac();
    }

}