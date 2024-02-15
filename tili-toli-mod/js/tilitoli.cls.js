/*
    Game: Tili-Toli
    Version: 2.0 
    Author: Fosztó Zsolt
    Description: ---

    Fejlesztések: 
        - 2.0 verziótól, nemcsak egy lapocskát lehet egyszerre mozgatni, hanem annyit, amennyi az üres szlott előtt van.
*/

class TiliToliMessage{
    constructor (sel, text){
        this.el = typeof sel == "string" ? document.querySelector(sel) : sel;

        this.textBox = this.el.querySelector(".tili-toli-layertext");
        this.textBox.innerText = text;
    }

    /**
     * @param {any} txt
     */

    set text(txt){
        this.textBox.innerText = txt;
    }

    get text(){
        return this.textBox.innerText;
    }

    show(text){
        
        if (text)
            this.text = text;

        this.el.style.display = "flex";
        this.el.classList.remove("hide");
        this.el.classList.add("show");
    }

    hide(){
        this.el.style.display = "none";
        this.el.classList.remove("show");
        this.el.classList.add("hide");
    }
}

class TiliToli{
    
    static version = "2.1"

    #paused = false;
    
    /**
     * 
     * @param {object} o
     */

    constructor(o){
        this.sizex = o.sizex || 4;
        this.sizey = o.sizey || 4;
        this.id = o.id || "tt";

        this.stepType = o.stepType || "single";

        this.complete = true;

        this.moveAction = o.moveAction || function(){};
        this.win = o.win || function(){};
        this.afterShuffle = o.afterShuffle || function(){};

        this.winnerText = o.winnerText || "NYERT!";
        this.pauseText = o.pauseText || "Pihi! :)";

        this.parentElement = document.querySelector(o.addTo) || document.createElement("div");
        this.messageLayer = new TiliToliMessage(this.parentElement.querySelector(".tili-toli-layer"), this.winnerText);
/*
        while (this.parentElement.firstElementChild)
            this.parentElement.firstElementChild.remove();
//*/
        this.renderGameTable();
    }

    setSize(x, y){
        this.sizex = x;
        this.sizey = y;
    }

    #getDirection(){

    }

    #createRow(){
        let row = document.createElement("div");
        row.classList.add("tili-toli-row");

        return row;
    }

    #squareId(x, y){
        return `${this.id}-${x}-${y}`;
    }

    #squareOneStepOnClick(square, x, y){

        square.addEventListener("click", () => {
            if (!this.complete){
                let epmtySlot = this.gameBox.querySelector(".tili-toli-square-empty");
                let epmtiSlotX = Number(epmtySlot.dataset.x );
                let epmtiSlotY = Number(epmtySlot.dataset.y );
                
                x = Number(x);
                y = Number(y);

                if ( 
                    (epmtiSlotX == x && (epmtiSlotY+1 == y || epmtiSlotY-1 == y) ) || 
                    (epmtiSlotY == y && (epmtiSlotX+1 == x || epmtiSlotX-1 == x) )
                ){
                    epmtySlot.innerHTML = this.innerHTML;
                    this.innerHTML = "";
                    epmtySlot.classList.remove("tili-toli-square-empty");
                    this.classList.add("tili-toli-square-empty");
                    this.moveAction();

                    if (this.isWin()){
                        this.win();
                        this.classList.remove("tili-toli-square-empty");
                        this.innerHTML = this.sizex * this.sizey;
                    }
                }

            } // End If Not Complet
        });
    }

    #squareStep(square, emptySlot){
        emptySlot.innerHTML = square.innerHTML;
        square.innerHTML = "";
        emptySlot.classList.remove("tili-toli-square-empty");
        square.classList.add("tili-toli-square-empty");

        return square;
    }

    #squareAllStepOnClick(square, x, y){

        square.addEventListener("click", () => {

            if (!this.complete){
                let epmtySlot = this.gameBox.querySelector(".tili-toli-square-empty");
                let epmtiSlotX = Number(epmtySlot.dataset.x );
                let epmtiSlotY = Number(epmtySlot.dataset.y );
                
                x = Number(x);
                y = Number(y);

                switch (true){
                    //down
                    case epmtiSlotY == y && epmtiSlotX > x:
                        for (let i = epmtiSlotX-1; i >= x; i--)
                            epmtySlot = this.#squareStep(this.#getSquareByXY(i, y), epmtySlot);
                        this.moveAction();
                    break;
                    //up
                    case epmtiSlotY == y && epmtiSlotX < x:
                        for (let i = epmtiSlotX+1; i <= x; i++)
                            epmtySlot = this.#squareStep(this.#getSquareByXY(i, y), epmtySlot);
                        this.moveAction();
                    break;
                    //left
                    case epmtiSlotX == x && epmtiSlotY > y:
                        for (let i = epmtiSlotY-1; i >= y; i--)
                            epmtySlot = this.#squareStep(this.#getSquareByXY(x, i), epmtySlot);
                        this.moveAction();
                    break;
                    //right
                    case epmtiSlotX == x && epmtiSlotY < y:
                        for (let i = epmtiSlotY+1; i <= y; i++)
                            epmtySlot = this.#squareStep(this.#getSquareByXY(x, i), epmtySlot);
                        this.moveAction();
                    break;
                }

                this.winnerPrize(square);

            } // End If Not Complet
        });
    }

    winnerPrize(square){
        if (this.isWin()){
            this.win();

            let epmtySlot = square || this.gameBox.querySelector(".tili-toli-square-empty");
            
            if (epmtySlot){
                epmtySlot.classList.remove("tili-toli-square-empty");
                epmtySlot.innerHTML = this.sizex * this.sizey;

                if (this.messageLayer){
                    this.messageLayer.show(this.winnerText);
                }
            }
        }
    }

    pause(){
        this.messageLayer.show(this.pauseText);
        this.#paused = true;
    }

    resume(){
        this.messageLayer.hide();
        this.#paused = false;
    }

    get paused(){
        return this.#paused;
    }

    #createSquare(x, y, num){
        let square = document.createElement("div");
        square.classList.add("tili-toli-square");
        square.id = this.#squareId(x, y);
        square.innerHTML = `<span>${num}</span>`;
        square.dataset.x = x;
        square.dataset.y = y;

        if (this.stepType == "multi")
            this.#squareAllStepOnClick(square, x, y);
        else
            this.#squareOneStepOnClick(square, x, y);

        return square;
    }

    #getSquareByXY(x, y){
        return this.gameBox.querySelector("#"+this.#squareId(x, y));
    }

    #eraseSquare(x, y){
        let square = this.#getSquareByXY(x, y);
        square.classList.add("tili-toli-square-empty");
        square.innerHTML = "";
    }

    displayEmptySlot(){
        this.#eraseSquare(this.sizex, this.sizey);
    }

    renderGameTable(){
        let nextNum = 1, row, square;
/*
        while (this.parentElement.firstElementChild)
            this.parentElement.firstElementChild.remove();
//*/
        if (this.gameBox)
            this.gameBox.remove();
        
        if (this.messageLayer)
            this.messageLayer.hide();

        this.gameBox = document.createElement("div");
        this.gameBox.id = this.id;
        this.gameBox.classList.add("tili-toli");
        
        for (let x = 1; x <= this.sizex; x++){
            row = this.#createRow();
            for (let y = 1; y <= this.sizey; y++){
                row.appendChild(this.#createSquare(x, y, nextNum++))
            }
            this.gameBox.appendChild(row);
        }

        //this.#eraseSquare(this.sizex, this.sizey);

        this.parentElement.appendChild(this.gameBox);

        this.squares = this.gameBox.querySelectorAll(".tili-toli-square");

        this.complete = false;
    }

    isWin(){
        for (let i = 0; i < this.squares.length-2; i++)
            if ( Number(this.squares[i].innerText)+1 !== Number(this.squares[i+1].innerText) )
                return false;
        
        this.complete = true;

        return true;
    }

    #replace(square, emptySlot){
        emptySlot.innerHTML = square.innerHTML;
        square.innerHTML = "";
        emptySlot.classList.remove("tili-toli-square-empty");
        square.classList.add("tili-toli-square-empty");
    }

    move(dir){
        let epmtySlot = this.gameBox.querySelector(".tili-toli-square-empty");
        let epmtiSlotX, epmtiSlotY;

        if (epmtySlot){
            epmtiSlotX = Number(epmtySlot.dataset.x );
            epmtiSlotY = Number(epmtySlot.dataset.y );
        
            switch (dir){
                case "down":
                    if (epmtiSlotX > 1){
                        let square = this.#getSquareByXY(epmtiSlotX-1, epmtiSlotY);
                        this.#replace(square, epmtySlot);
                        this.moveAction();
                    }
                break;
                case "up":
                    if (epmtiSlotX < this.sizex){
                        let square = this.#getSquareByXY(epmtiSlotX+1, epmtiSlotY);
                        this.#replace(square, epmtySlot);
                        this.moveAction();
                    }
                break;
                case "right":
                    if (epmtiSlotY > 1){
                        let square = this.#getSquareByXY(epmtiSlotX, epmtiSlotY-1);
                        this.#replace(square, epmtySlot);
                        this.moveAction();
                    }
                break;
                case "left":
                    if (epmtiSlotY < this.sizey){
                        let square = this.#getSquareByXY(epmtiSlotX, epmtiSlotY+1);
                        this.#replace(square, epmtySlot);
                        this.moveAction();
                    }
                break;
            }
        }
    }

    isValidDirection(dir){
        let epmtySlot = this.gameBox.querySelector(".tili-toli-square-empty");
        let epmtiSlotX = Number(epmtySlot.dataset.x );
        let epmtiSlotY = Number(epmtySlot.dataset.y );

        switch (dir){
            case "down":
                if (epmtiSlotX > 1)
                    return true;
            case "up":
                if (epmtiSlotX < this.sizex)
                    return true;
            case "right":
                if (epmtiSlotY > 1)
                    return true;
            case "left":
                if (epmtiSlotY < this.sizey)
                    return true;
        }

        return false;
    }

    shuffle(step = 250, timer = 10){

        if (!this.gameBox.querySelector(".tili-toli-square-empty"))
            this.#eraseSquare(this.sizex, this.sizey);

        if (!this.complete){
        
            let directions = ["up", "down", "left", "right"];
            let stepCount = 0;
            let dir = directions[1];

            let timerId = setInterval(() => {
                dir = directions[Math.floor(Math.random()*5)];
                if (this.isValidDirection(dir)){
                    this.move(dir);
                    stepCount++;
                }
                if (stepCount == step){
                    clearInterval(timerId);
                    this.afterShuffle();
                }
            }, timer);
        }
    }

}

export {TiliToliMessage, TiliToli};