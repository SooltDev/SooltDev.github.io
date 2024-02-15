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
    
    #active = true;

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
        }, o.events);

        this.build();
    }
    set active(a){
        this.#active = Boolean(a);
        this.element.classList[this.#active ? 'remove' : 'add']('inactive');
    }
    get active(){
        return this.#active;
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
        
        this.element = div.firstElementChild;
        this.ct.appendChild(div.firstElementChild);

        this.ArrowUp = this.#qs(".key-up");
        this.ArrowDown = this.#qs(".key-down");
        this.ArrowLeft = this.#qs(".key-left");
        this.ArrowRight = this.#qs(".key-right");

        for (let btn of keys){
            /* Hogy kattintásra is működjön, ne csak billentyűlenyomásra */
            this[btn].addEventListener("click", () => { 
                if (this.#active) // Ha aktív a billentyűzet
                    this.keyevents[btn]();
            });
        }

        document.body.addEventListener("keydown", (event) => {

            /*
                Ha nyil billentyuk akkor a switch-ben kezeljuk a nyil billentyuket a DOM miatt
            */
            if (this.#active){ // Ha aktív a billentyűzet
                if (keys.includes(event.key)){

                    switch (event.key){
                        case "ArrowUp":
                            this.up();
                            this.ArrowUp.classList.add("active");
                            break;
                        case "ArrowDown":
                            this.down();
                            this.ArrowDown.classList.add("active");
                            break;
                        case "ArrowLeft":
                            this.left();
                            this.ArrowLeft.classList.add("active");
                            break;
                        case "ArrowRight":
                            this.right();
                            this.ArrowRight.classList.add("active");
                            break;
                    }

                    this.events.keydown();
                } 
                /*
                    Ellentkezo esetben, ha van a nyil billentyuk melett mas billentyu, arra is legyen lehetoseg lekezelni
                    pl az Entert.
                */
                else if (this.keyevents[event.key] && typeof this.keyevents[event.key] == "function"){
                    this.keyevents[event.key]();
                }
            }// end if this.#active

        }); // end keydown event

        document.body.addEventListener("keyup", (event) => {
            if (this.#active) // Ha aktív a billentyűzet
                if (keys.includes(event.key)){
                    this[event.key].classList.remove("active");
                    this.events.keyup();
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
};

export { ArrowKeys };
