import { getElement } from "./stools.js";

const template = `
    <div class="chessboard">
        <div class="chess-inner">    
            <div class="chess-row">
                <div class="number-indexes"></div>
                <div class="fields"></div>
            </div>
            <div class="letter-indexes">
                <div class="letter-space-field"></div>
            </div>
        </div>
    </div>
`;

class ChessTable{

    #size; // - a tábla mérete
    #parentElement;
    #element;

    #letterFieldsElement;
    #numberFieldsELement;
    #fieldsElement;

    /**
     * 
     * @param {object} o 
     * @param {number} [o.size=8] - A tábla mérete, default értéke a 8
     * @param {string|HTMLElement} o.parent - A szülő elem, vagy annak selectora
     */
    constructor(o){
        const options = Object.assign({
            size: 8
        }, o);

        this.#parentElement = getElement(o.parent);
        this.size = options.size;

        this.render();
    }

    render(){
        const div = document.createElement('div');
        div.innerHTML = template;

        this.#element = div.firstElementChild;

        this.#letterFieldsElement = this.#getEl('.letter-indexes');
        this.#numberFieldsELement = this.#getEl('.number-indexes');
        this.#fieldsElement = this.#getEl('.fields');

        /* Create letters and numbers indexes */

        const aCode = 'a'.charCodeAt(0);

        for (let i = 0; i < this.size; i++){
            this.#numberFieldsELement.insertAdjacentHTML('afterbegin', `
                <div class="number-field">${ i + 1 }</div>    
            `);

            this.#letterFieldsElement.insertAdjacentHTML('beforeend', `
                <div class="letter-field">${ String.fromCharCode(aCode + i) }</div>   
            `);
        }

        /* Create Fields */

/*
    [      0  1  2  3  4  5
        0-[0, 1, 0, 1, 0, 1],
        1-[1, 0, 1, 0, 1, 0],
        2-[0, 1, 0, 1, 0, 1]
    ]
*/

        for (let i = 0; i < this.size; i++){

            const row = document.createElement('div');
            row.classList.add('chess-row');

            for (let j = 0; j < this.size; j++){
                const cell = document.createElement('div');
                cell.classList.add('chess-cell');
                cell.classList.add( (i + j) % 2 == 0 ? "white" : "black" );

                row.appendChild(cell);
            }

            this.#fieldsElement.appendChild(row);
        }

        this.#parentElement.appendChild(this.#element);
    }

    #getEl(sel){
        return this.#element.querySelector(sel);
    }

    set size(v){
        if (v > 2 && v < 40)
            this.#size = v;
    }

    get size(){
        return this.#size
    }
}

export default ChessTable;