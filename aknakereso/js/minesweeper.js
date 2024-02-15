import { randomize, createElement, getElement } from "./stools.js";
import { elementsFromTempalte, templateToObject } from "./evaltemplate.js";

const template  = `
        <div class="grenade-field" data-domname="element">
            <div class="grenade-display" data-domname="displayContainer">
                <div class="digit-display">
                    <span data-domname="mineNumberDisplay">123</span>
                </div>
                <div class="grenade-button" data-domname="gameButton"></div>
                <div class="digit-display">
                    <span data-domname="timerDisplay">45</span>
                </div>
            </div>
            <div class="grenade-field-inner" data-domname="fieldInnerContainer">

            </div>
        </div>
`;

class Minesweeper {

    #mineField;
    #bumm = false;
    #timerId = null;
    #sec = 0;
    #overlayed; //az összes még meg fel nem fedett mező
/*
    const fieldSize = {
        width: 12,
        height: 15,
        mineNumber: 25
    };
*/
    width;
    height;
    mineNumber;
    parentElement;
    flagNumber = 0;

    constructor(options) {

        this.setOptions(options);

        this.parentElement = getElement(options.parentElement);

        templateToObject(template, this);

        this.construct();
    }

    setOptions(opt){
        this.width = opt.width || 10;
        this.height = opt.height || 12;
        this.mineNumber = opt.mineNumber || 20;
    }

    construct(){
        this.gameButton.addEventListener('click', () => {
            this.newGame();
        });
    }

    newGame(){
        this.stopTimer();
        this.#generateMineField();

        while (this.fieldInnerContainer.firstElementChild)
            this.fieldInnerContainer.firstElementChild.remove();

        this.#bumm = false;
        this.gameButton.classList.remove('lose');
        this.gameButton.classList.remove('winner');
        this.mineNumberDisplay.textContent = this.mineNumber;
        this.timerDisplay.textContent = '0';
        this.#sec = 0;
        this.flagNumber = 0;
        this.#overlayed = this.width * this.height; // ennyi mező van

        this.fieldInnerContainer.addEventListener('click', this.firstClickHandler);

        this.renderMineField();

    }

    #generateMineField() {
        this.#mineField = Array(this.height).fill().map(() => Array(this.width).fill(0));

        for (let i = 0; i < this.mineNumber; i++) {

            let x, y;

            do {
                x = randomize(0, this.height);
                y = randomize(0, this.width);

            } while (this.#mineField[x][y] == "*");

            this.#mineField[x][y] = "*";
        }

        for (let i = 0; i < this.#mineField.length; i++) {
            for (let j = 0; j < this.#mineField[i].length; j++) {

                if (this.#mineField[i][j] == "*") {

                    for (let x = i - 1; x <= i + 1; x++)
                        for (let y = j - 1; y <= j + 1; y++)
                            if (x >= 0 && x <= i + 1 && y <= j + 1 && y >= 0 && x < this.height && y < this.width)

                                if (this.#mineField[x][y] != "*")
                                    this.#mineField[x][y]++;
                }
            }
        }
    }

    firstClickHandler = () => {
        if (!this.#timerId){
            this.startTimer();
            this.fieldInnerContainer.removeEventListener('click', this.firstClickHandler);
        }
    }

    startTimer(){
        if (!this.#timerId && !this.#bumm){
            this.#timerId = setInterval(() => {
                this.timerDisplay.textContent = ++this.#sec;
            }, 1000);

        }
    }

    stopTimer(){
        clearInterval(this.#timerId);
        this.#timerId = null;
    }

    pause(){

    }

    renderMineField(){

        this.element.appendChild(this.fieldInnerContainer);
    
        for (const i in this.#mineField){
            const row = createElement({className: 'row'})
            for (const j in this.#mineField[i]){
                const field = createElement({
                    className: 'field overlay',
                    id: `f${i}-${j}`,
                    dataset: {
                        row: i, col: j
                    }
                });
    
                field.addEventListener('contextmenu', (e) => {
                    e.preventDefault();

                    if (!this.#bumm && field.classList.contains('overlay') && !this.isWinner() ){
                        const flagged = field.classList.toggle('flag');
                        this.flagNumber += flagged ? 1 : -1;
                        this.mineNumberDisplay.textContent = this.mineNumber - this.flagNumber;
                    }
                });

                field.addEventListener('mousedown', (e) => {
                    if (e.button == 0)
                        this.gameButton.classList.add('whoom');
                });

                field.addEventListener('mouseup', (e) => {
                    if (e.button == 0)
                        this.gameButton.classList.remove('whoom');
                });
    
                field.addEventListener('click', () => {
    
                    if (!this.#bumm){
    
                        const row = +field.dataset.row;
                        const col = +field.dataset.col;
    
                        if (field.classList.contains('overlay') && !field.classList.contains('flag')){
                            if (this.#mineField[row][col] == '*'){
                                this.#bumm = true;
                                this.gameButton.classList.add('lose');
                                
                                this.detectBombs(this.#mineField);
                                
                                field.classList.remove('bomb');
                                field.classList.add('bumm');

                                this.stopTimer();
                            }else{
                                this.detect(row, col);
                            }
                        }
                    }   
                });
    
                row.appendChild(field);
            }
            this.fieldInnerContainer.appendChild(row);
        }
        this.parentElement.appendChild(this.element);
    }
/**
 *  Megkeresi az összes aknát
 */
    detectBombs(){
    
        for (const i in this.#mineField){
    
            for (const j in this.#mineField[i]){
                
                const el = this.element.querySelector(`#f${i}-${j}`);
    
                if (this.#mineField[i][j] == '*'){
                    if (!el.classList.contains('flag')){
                        el.classList.remove('overlay');
                        el.classList.add('bomb');
                    }
                } else if (el.classList.contains('flag')){
                    el.classList.add('bad');
                }
            }
        }
    }

    get overlayed(){
        return this.#overlayed;
    }

    isWinner(){
        return this.#overlayed == this.mineNumber && !this.#bumm;
    }

    checkWinner(){
        
        if ( this.isWinner() ) {
            this.gameButton.classList.add('winner');
            this.stopTimer();

            // check all unflegged field, and flagged
            for (let i = 0; i < this.width; i++)
                for (let j = 0; j < this.height; j++)
                    if (this.#mineField[i][j] == '*'){
                        const field = this.element.querySelector(`#f${i}-${j}`);
                        if (field && !field.classList.contains('flag')){
                            field.classList.add('flag');
                            this.flagNumber++;
                            this.mineNumberDisplay.textContent = this.mineNumber - this.flagNumber;
                        }
                    }

            return true;
        }
        return false;
    }
    
    detect(row, col){

        const el = this.element.querySelector(`#f${row}-${col}`);
        const grenadeField = this.#mineField;
    
        if (!el)
            return;
    
        if (!el.classList.contains('overlay'))
            return;
    
        if (typeof grenadeField[row][col] == 'number' && grenadeField[row][col] > 0){
            //*

            el.classList.remove('overlay');
            el.classList.add('s' + grenadeField[row][col]);
            this.#overlayed--;
            this.checkWinner();

            //*

            /*
            setTimeout(() => {
                el.classList.remove('overlay');
                el.classList.add('s' + grenadeField[row][col]);
                this.#overlayed--;
                this.checkWinner();
            }, 30);
            //*/

        } else if (grenadeField[row][col] == 0){
    
            el.classList.remove('overlay');
            this.#overlayed--;
            //*
            if (col - 1 >= 0 )
                this.detect(row, col-1); //bal
    
            if (col + 1 < grenadeField.length)
                this.detect(row, col+1); //jobb
    
            if (row - 1 >= 0 && col - 1 >= 0)
                this.detect(row-1, col-1); //balfent
    
            if (row - 1 >= 0)
                this.detect(row-1, col); //fent
    
            if (row - 1 >= 0 && col + 1 < grenadeField[0].length)
                this.detect(row-1, col+1); //jobbfent
    
            if (row + 1 < grenadeField.length  && col - 1 >= 0)
                this.detect(row+1, col-1); //ballent
    
            if (row + 1 < grenadeField.length)
                this.detect(row+1, col); //lent
    
            if (row + 1 < grenadeField.length  && col + 1 < grenadeField[0].length)
                this.detect(row+1, col+1); //jobblent
            //*/
        }
    
    }
}

export {Minesweeper};