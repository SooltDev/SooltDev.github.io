import { createElement, getElement } from "./stools.js";
import { EventManager } from "./eventmanager.cls.js";
import { HTMLLine } from "./line.cls.js";

const vowels = 'a,á,e,é,i,í,o,ó,ö,ő,u,ú,ü,ű'.split(',');
const isVowle = (letter) => vowels.includes(letter.toLowerCase());

class Matchbox extends EventManager{
    static #types = ['letter', 'vioce', 'picture'];
    #type = 'letter';  // letter, voice, picture
    #letter = null;    // char 
    #vowel = false;    // true, ha magánhangzó
    #location;
    #partner;          // Ez a társpéldány
    element;           // outer DOM element
    parentElement;     // 
    typeElement;       // inner container DOM element
    #startX;           // mouse x
    #startY;           // mouse y
    #matchStarting = false; // true, ha elkezdődött a párosítás
    #linked = false;   // true, ha már össze vannak kapcsolva
    #playground;       // dom elements
    line;
    #xOffset = 0;
    #yOffset = 0;

    constructor(o){
        super();

        //console.log(o);
        
        this.type = o.type;
        this.letter = o.letter;
        this.location = o.location;

        this.#playground = o.playground || null;

        /* 
            //Kisérlet arra, hogy a vonalak ne a body-ba legyenek, hanem a játékmezőben
            //Az alábbi kód a koordináták ehhez való igazítását szolgálná
        
        if (this.#playground.playground){
            if (getComputedStyle(this.#playground.playground).position == "relative")
                this.#xOffset = this.#playground.playground.offsetLeft;
                this.#yOffset = this.#playground.playground.offsetTop;
        }
        //*/

        // Beigazí az egér pozicióját attól függően, hogy merre húzzuk a vonalat.
        if (this.#location == 'start'){
            this.#xOffset = 10;
            this.#yOffset = 5;
        } else if (this.#location == 'target'){
            this.#xOffset = -10;
            this.#yOffset = -5;
        }

        this.#build();

    }

    #build(){
        this.element = document.createElement('div');
        this.element.className = 'matchcard in-game';
        
        this[this.makeFuncName()]();

        this.element.addEventListener('mousedown', this.#mouseDown);
        //this.typeElement.addEventListener('mouseover', this.#mouseOver);
        this.typeElement.addEventListener('mouseup', this.#checkPartner);

    }
    /*
        Ha felengedjük az egér gombját (mouseup), akkor megnézzük, hogy a társától indult-e vonal

    */
    #checkPartner = (e) => {
        if (!this.matching){
            if (this.partner.matching){
                this.#linked = true;
                this.partner.makeLine();
            }
        }
    }

/*
    #mouseOver = (e) => {}
    #mouseOut = (e) => {}
*/

    #mouseDown = (e) => {
        // Get the current mouse position
        this.#startX = this.offsetMiddle.x;
        this.#startY = this.offsetMiddle.y;

        this.#matchStarting = true;

        // Attach the listeners to document

        //console.log(e);
        //console.log(this);

        this.line = new HTMLLine({
            color: '#37528e',
            height: 5,
            coords: [ this.#startX, this.#startY, e.pageX, e.pageY ],
            parentElement: this.parentElement.parentElement.parentElement
        });

        //console.log(this.line);

        document.addEventListener('mousemove', this.#mouseMove);
        document.addEventListener('mouseup', this.#mouseUp);
        this.trigger('mousemove');
    }

    #mouseUp = (e) => {
        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', this.#mouseMove);
        document.removeEventListener('mouseup',this.#mouseUp);
        
        this.line.destroy();
        this.line = null;

        this.#matchStarting = false;

        this.trigger('mouseup');
    }

    #mouseMove = (e) => {

        //this.line.setLine(this.#startX, this.#startY, e.clientX - this.#xOffset, e.clientY - this.#yOffset);
        this.line.setLine(
            e.clientX - this.#xOffset, e.clientY - this.#yOffset, 
            this.#startX, this.#startY
        );

        this.trigger('move');
    }

    calcXY2(x, y){

    }

    makeFuncName(){
        const type = this.#type;
        return `make${type[0].toUpperCase()}${type.slice(1)}`;
    }

    makeLetter(){
        this.typeElement = createElement({
            tagName: 'div',
            className: this.vowel ? 'letter vowel' : 'letter',
            parentElement: this.element,
            textContent: this.#letter
        });
    }

    makeVoice(){

    }

    makePicture(){

    }

    removeMouseEvents() {
        this.element.removeEventListener('mousedown', this.#mouseDown);
        this.typeElement.removeEventListener('mouseup', this.#checkPartner);
        document.removeEventListener('mousemove', this.#mouseMove);
        document.removeEventListener('mouseup',this.#mouseUp);
    }

    finishStyle(){
        this.element.classList.remove('in-game');
        this.element.classList.add('finish');
        if (this.line){
            this.line.color = 'green';
            this.line.element.style.opacity = '0.45';
        }
    }

    makeLine(){
        if (this.#partner.linked){
            this.removeMouseEvents();
            this.#partner.removeMouseEvents();
            this.finishStyle();
            this.#partner.finishStyle();
            this.#linked = true;
            this.trigger('link');
        }
    }

    appendTo(parentElement){
        this.parentElement = getElement(parentElement);
        if (this.parentElement)
            this.parentElement.appendChild(this.element);
    }

    set location(l){
        this.#location = l;
    }

    get location(){
        return this.#location;
    }

    get type(){
        return this.#type;
    }

    set type(t){
        t = t.toLowerCase();
        if ( Matchbox.#types.includes(t) )
            this.#type = t;
    }
    /**
     * Egy karaktert vár és igazat ad vissza, ha a példány, az adott betű képviselője
     * @param {string} char 
     * @param {boolean} caseSensitive
     * @returns {boolean}
     */
    is(char, caseSensitive = false){
        return caseSensitive ? 
            char === this.letter : 
            char.toUpperCase() === this.#letter.toUpperCase();
    }

    /**
     * Összehasonlítja egy ugyan ilyen példánnyal, és igazat ad vissza, ha azonos betű képviselői
     * @param {object} matchboxObject 
     * @returns {boolean}
     */
    compare(matchboxObject){
        if (matchboxObject instanceof Matchbox)
            return matchboxObject.is(this.#letter);
    }

    initial(){
        if (this.#letter.length > 1)
            this.#letter = this.#letter[0].toUpperCase() + this.#letter.slice(1);

        return this.#letter;
    }

    /**
     * Beállítja a betűt, akkor is, ha az karakterkód, és akkor is, ha string karakter
     * 
     */
    set letter(l){
        if (typeof l == 'number')
            return this.#letter = String.fromCharCode(l);
        
        this.#vowel = isVowle(l);

        return this.#letter = l;
    }

    get letter(){
        return this.#letter;
    }

    get vowel () {
        return this.#vowel;
    }

    get partner(){
        return this.#partner;
    }

    get matching(){
        return this.#matchStarting;
    }

    set partner(p){
        if (p instanceof Matchbox)
            this.#partner = p;
    }

    get middle(){
        return {
            x: this.element.clientWidth / 2,
            y: this.element.clientHeight / 2
        }
    }

    get offsetMiddle(){
        const m = this.middle;
        return {
            x: this.element.offsetLeft + m.x,
            y: this.element.offsetTop + m.y
        }
    }

    get linked() {
        return this.#linked;
    }
}

export { Matchbox }