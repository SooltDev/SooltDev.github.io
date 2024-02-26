
import { EventManager } from "./eventmanager.cls.js";

class Drag extends EventManager{

    element;
    headElement; // Ha nincs külön fejléc, aminn keresztül mozgathatjuk, akkor az headElement, is az element.

    // The current position of mouse
    x = 0;
    y = 0;

    constructor(element, headElement = null){
        super();
        /* A mozgatandó HTML element beállítása*/
        if (typeof element == 'string')
            this.element = document.querySelector(element);
        else if (element instanceof HTMLElement)
            this.element = element;

        if (!element) //Ha nem találtunk HTML elementet, akkor kilép a konstruktor. Ezt try catch-el is lehetne csinálni.
            return console.error('element is null: ' + element);

        this.element.style.position = "absolute";

        /* 
            Ha azt szeretnénk, hogy a HTML elemen belül egy konkrét elemre kattintva lehessen mozgatni az elemet, 
            akkor azt beállítjuk
        */
        if (!headElement)
            this.headElement = this.element;
        else if (typeof headElement == 'string')
            this.headElement = document.querySelector(headElement);
        else if (headElement instanceof HTMLElement)
            this.headElement = headElement;

        this.headElement.addEventListener('mousedown', this.mouseDownHandler);
    }

    mouseDownHandler = (e) => {
        // Get the current mouse position
        this.x = e.clientX;
        this.y = e.clientY;

        // Attach the listeners to document
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        this.trigger('mousemove');
    };

    mouseMoveHandler = (e) => {
        // How far the mouse has been moved
        const dx = e.clientX - this.x;
        const dy = e.clientY - this.y;

        // Set the position of element
        this.element.style.top = (this.element.offsetTop + dy) + 'px';
        this.element.style.left = (this.element.offsetLeft + dx) + 'px';

        // Reassign the position of mouse
        this.x = e.clientX;
        this.y = e.clientY;

        this.trigger('move');
    };

    mouseUpHandler = () => {
        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.trigger('mouseup');
    };

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

}

export { Drag };