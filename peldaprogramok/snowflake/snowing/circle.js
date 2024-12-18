import { getElement, random } from "./tools.js";

let idInc = 1;

export class Circle{

    parentElement;
    element;
    timerId = null;
    speed;
    #snowing = false;

    constructor(x, y, r, fillColor, renderTo = document.body){
        this.parentElement = getElement(renderTo);

        this.element = document.createElement('div');
        this.element.id = `c${idInc++}`;

        Object.assign(this.element.style, {
            "position": "fixed",
            "border-radius": "50%"
        });

        this.radius = r;
        this.x = x,
        this.y = y,
        this.color = fillColor;

        this.parentElement.appendChild(this.element);
    }

    snowing(speed = this.speed){
        this.speed = speed;
        if (!this.timerId){
            this.#snowing = true;
            this.timerId = setInterval(() => {
                
                this.y++;

                if (this.y >= window.innerHeight - this.radius)
                    this.melt();

            }, this.speed);
        }
    }

    melt(){
        clearInterval(this.timerId);
        this.timerId = null;
        setTimeout(() => {
            this.y = -this.radius * 2;
            this.x = random(0, window.innerWidth - this.radius * 2);
            if (this.#snowing)
                this.snowing();
        }, 6500);
    }

    stopSnowing(){
        this.#snowing = false;
        //clearInterval(this.timerId);
    }

    set radius(r){
        Object.assign(this.element.style, {
            "width": `${r * 2}px`,
            "height": `${r * 2}px`,
        });
    }

    get radius(){
        return this.element.offsetWidth / 2;
    }

    set color(c){
        this.element.style.backgroundColor = c;
    }

    get color(){
        return this.element.style.backgroundColor;
    }

    set x(x){
        this.element.style.left = x + 'px';
    }

    get x(){
        return this.element.offsetLeft;
    }

    set y(y){
        this.element.style.top = y + 'px';
    }

    get y(){
        return this.element.offsetTop;
    }

    moveToXY(x, y){
        this.x = x;
        this.y = y;
    }
}
