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

    class ToggleButton{

        element; // DOM element (button)
        #status; // "on"/"off"
        #icon;

        constructor(o){

            this.#status = o.status || 'off';

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
            
            this.textElement = document.createElement('span');

            this.element.appendChild(this.textElement);

            this.element.classList.add(o.cssClass || 'button');

            this.element.addEventListener('click', () => {
                this.toggle();
            });

            this.textElement.textContent = o.text;

            this.parentElement.appendChild(this.element);
        }

        #createIcon(){

            if (this.#icon){
                this.iconElement = document.createElement('i');
                this.element.appendChild(this.iconElement);
                this.iconElement.classList.add(this.#icon.cssClass);
            }

        }

        toggle(){
            this.status = this.status == 'on' ? 'off' : 'on';
        }

        on(){
            this.element.classList.remove('off');
            this.element.classList.add('on');

            if (this.#icon) {
                if (this.#icon.offClass)
                    this.iconElement.classList.remove(this.#icon.offClass);
                if (this.#icon.onClass)
                    this.iconElement.classList.add(this.#icon.onClass);
            }
        }

        off(){
            this.element.classList.remove('on');
            this.element.classList.add('off');

            if (this.#icon) {
                if (this.#icon.offClass)
                    this.iconElement.classList.add(this.#icon.offClass);
                if (this.#icon.onClass)
                    this.iconElement.classList.remove(this.#icon.onClass);
            }
        }

        set status(s){
            if ( (s === 'on' || s === 'off') && s !== this.#status ){
                this.#status = s;
                this[this.#status]();
            }
        }

        get status(){
            return this.#status;
        }
    
    }

    return ToggleButton;

})();

