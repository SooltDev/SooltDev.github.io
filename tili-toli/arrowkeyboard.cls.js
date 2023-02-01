class ArrowKeys{

    static #html = `
    <div class="arrow-keys">
        <div class="keyct">
            <div class="arrowkey key-up"></div>
        </div>
        <div class="keyct">
            <div class="arrowkey key-left"></div>
            <div class="arrowkey key-down"></div>
            <div class="arrowkey key-right"></div>
        </div>
    </div>
    `;

    constructor(o){
        this.ct = document.querySelector(o.renderTo) || document.createElement("div");
        this.keyevents = Object.assign({
            ArrowUp: function(){},
            ArrowDown: function(){},
            ArrowRight: function(){},
            ArrowLeft: function(){},
        }, o.keyevents);

        this.events = Object.assign({
            keydown: function(){},
            keyup: function(){}
        }, o.events)
        this.build();
    }

    #qs(sel){
        return this.ct.querySelector(sel);
    }

    on(buttonName, func){
        this[buttonName].addEventListener("click", func);
    }

    build(){
        let keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        let div = document.createElement("div");
        div.innerHTML = ArrowKeys.#html;

        this.ct.appendChild(div.firstElementChild);

        this.ArrowUp = this.#qs(".key-up");
        this.ArrowDown = this.#qs(".key-down");
        this.ArrowLeft = this.#qs(".key-left");
        this.ArrowRight = this.#qs(".key-right");

        let _this = this;

        for (let btn of keys){
            this[btn].addEventListener("click", this.keyevents[btn]);
        }

        document.body.addEventListener("keydown", function(event){

            /*
                Ha nyil billentyuk akkor a switch-ben kezeljuk a nyil billentyuket a DOM miatt
            */
            if (keys.includes(event.key)){

                switch (event.key){
                    case "ArrowUp":
                        _this.up();
                        _this.ArrowUp.classList.add("active");
                        break;
                    case "ArrowDown":
                        _this.down();
                        _this.ArrowDown.classList.add("active");
                        break;
                    case "ArrowLeft":
                        _this.left();
                        _this.ArrowLeft.classList.add("active");
                        break;
                    case "ArrowRight":
                        _this.right();
                        _this.ArrowRight.classList.add("active");
                        break;
                }
                _this.events.keydown();

            } 
            /*
                Ellentkezo esetben, ha van a nyil billentyuk melett mas billentyu, arra is legyen lehetoseg lekezelni
                pl az Entert.
            */
            else if (_this.keyevents[event.key] && typeof _this.keyevents[event.key] == "function"){
                _this.keyevents[event.key]();
            }
                

        });

        document.body.addEventListener("keyup", function(event){
            if (keys.includes(event.key)){
                _this[event.key].classList.remove("active");
                _this.events.keyup();
            }
        });
    }

    up(){
        this.ArrowUp.click();
    }

    down(){
        this.ArrowDown.click();
    }

    left(){
        this.ArrowLeft.click();
    }

    right(){
        this.ArrowRight.click();
    }
}