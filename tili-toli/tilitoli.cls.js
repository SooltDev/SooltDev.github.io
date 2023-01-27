/*
    Game: Tili-Toli
    Version: 1.8
    Author: Fosztó Zsolt
*/

class TiliToli{
    
    static version = "1.8"
    /**
     * 
     * @param {object} o
     */
    constructor(o){
        this.sizex = o.sizex || 4;
        this.sizey = o.sizey || 4;
        this.id = o.id || "tt";

        this.complete = true;

        this.moveAction = o.moveAction || function(){};
        this.win = o.win || function(){};
        this.afterShuffle = o.afterShuffle || function(){};

        this.parentElement = document.querySelector(o.addTo) || document.createElement("div");

        while (this.parentElement.firstElementChild)
            this.parentElement.firstElementChild.remove();

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

    #createSquare(x, y, num){
        let square = document.createElement("div");
        square.classList.add("tili-toli-square");
        square.id = this.#squareId(x, y);
        square.innerHTML = `<span>${num}</span>`;
        square.dataset.x = x;
        square.dataset.y = y;

        let _this = this;

        square.addEventListener("click", function(){
            if (!_this.complete){
                let epmtySlot = _this.gameBox.querySelector(".tili-toli-square-empty");
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
                    _this.moveAction();

                    if (_this.isWin()){
                        _this.win();
                        this.classList.remove("tili-toli-square-empty");
                        this.innerHTML = _this.sizex * _this.sizey;
                    }
                }

            } // End If Not Complet
        });

        return square;
    }

    #eraseSquare(x, y){
        let square = this.gameBox.querySelector("#"+this.#squareId(x, y));
        square.classList.add("tili-toli-square-empty");
        square.innerHTML = "";
    }

    renderGameTable(){
        let nextNum = 1, row, square;

        while (this.parentElement.firstElementChild)
            this.parentElement.firstElementChild.remove();

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

        this.#eraseSquare(this.sizex, this.sizey);

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
        let epmtiSlotX = Number(epmtySlot.dataset.x );
        let epmtiSlotY = Number(epmtySlot.dataset.y );

        switch (dir){
            case "down":
                if (epmtiSlotX > 1){
                    let square = this.gameBox.querySelector("#"+this.#squareId(epmtiSlotX-1, epmtiSlotY));
                    this.#replace(square, epmtySlot);
                }
            break;
            case "up":
                if (epmtiSlotX < this.sizex){
                    let square = this.gameBox.querySelector("#"+this.#squareId(epmtiSlotX+1, epmtiSlotY));
                    this.#replace(square, epmtySlot);
                }
            break;
            case "right":
                if (epmtiSlotY > 1){
                    let square = this.gameBox.querySelector("#"+this.#squareId(epmtiSlotX, epmtiSlotY-1));
                    this.#replace(square, epmtySlot);
                }
            break;
            case "left":
                if (epmtiSlotY < this.sizey){
                    let square = this.gameBox.querySelector("#"+this.#squareId(epmtiSlotX, epmtiSlotY+1));
                    this.#replace(square, epmtySlot);
                }
            break;
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

    shuffle(step = 200, timer = 10){

        if (!this.complete){
        
            let directions = ["up", "down", "left", "right"];
            let stepCount = 0, _this = this;
            let dir = directions[1];

            let timerId = setInterval(function(){
                dir = directions[Math.floor(Math.random()*5)];
                if (_this.isValidDirection(dir)){
                    _this.move(dir);
                    stepCount++;
                }
                if (stepCount == step){
                    clearInterval(timerId);
                    _this.afterShuffle();
                }
            }, timer);
        }
    }

}
