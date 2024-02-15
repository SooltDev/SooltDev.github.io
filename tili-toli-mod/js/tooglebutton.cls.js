import { EventManager } from "./eventmanager.cls.js";

const ToggleButton = (function (params) {

/*
    <div class="game-button" id="pause-game">
        <i class="si si-pause"></i> <span>Szünet</span>
    </div>

    new ToggleButton({
        id: 'btn',
        cssClass: 'cssname',
        status: 'on' //optional
        icon: {
            cssClass: 'icon',
            onClass: 'onIcon'
            offClass: 'offIcon'
        }
    })
*/

    class ToggleButton extends EventManager{

        element; // DOM element (button)
        #status; // "on"/"off"
        #icon;
        
        constructor(o){
            super(o.events || {});

            this.#status = o.status || 'off';
            this.text = o.text;
            this.onText = o.onText || this.text;
            this.offText = o.offText || this.text;

            this.#icon = o.icon ? Object.assign({
                cssClass: '',
                onClass: '',
                offClass: ''
            }, o.icon) : undefined;

            if (o.parentElement){
                if (typeof o.parentElement == 'string')
                    this.parentElement = document.querySelector(o.parentElement);
                else if (o.parentElement instanceof HTMLElement)
                    this.parentElement = o.parentElement;
            } else this.parentElement = document.createElement('div');

            this.element = document.createElement('div');

            if (o.id)
                this.element.id = o.id

            this.#createIcon();
            
            this.textElement = document.createElement('span');
            this.element.appendChild(this.textElement);

            this.element.classList.add(o.cssClass || 'button');

            this.element.addEventListener('click', () => {
                this.toggle();
            });

            this.textElement.textContent = this.status == 'on' ? this.onText : this.offText;

            this.parentElement.appendChild(this.element);

            if (o.events){
                this.events = o.events;

            }
        }

        #createIcon(){

            if (this.#icon){
                this.iconElement = document.createElement('i');
                this.element.appendChild(this.iconElement);
                this.iconElement.classList.add(this.#icon.cssClass);
                this.iconElement.classList.add(
                    this.status == 'on' ? this.#icon.onClass : this.#icon.offClass
                );

            }

        }

        toggle(){
            this.status = this.status == 'on' ? 'off' : 'on';
        }

        poweron(){
            this.element.classList.remove('off');
            this.element.classList.add('on');
            this.textElement.textContent = this.onText;

            if (this.#icon) {
                if (this.#icon.offClass)
                    this.iconElement.classList.remove(this.#icon.offClass);
                if (this.#icon.onClass)
                    this.iconElement.classList.add(this.#icon.onClass);
            }
            this.trigger('on');
        }

        poweroff(){
            this.element.classList.remove('on');
            this.element.classList.add('off');
            this.textElement.textContent = this.offText;

            if (this.#icon) {
                if (this.#icon.offClass)
                    this.iconElement.classList.add(this.#icon.offClass);
                if (this.#icon.onClass)
                    this.iconElement.classList.remove(this.#icon.onClass);
            }
            this.trigger('off');
        }

        #getStatusFnName(){
            return 'power'+this.#status;
        }

        set status(s){
            if ( (s === 'on' || s === 'off') && s !== this.#status ){
                this.#status = s;
                this[this.#getStatusFnName()]();
            }
        }

        get status(){
            return this.#status;
        }
    
    }

    return ToggleButton;

})();

export {ToggleButton}
