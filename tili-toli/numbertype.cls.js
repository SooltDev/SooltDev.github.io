/*
    Name: NumberType
    Version: 1.0
    Description: DOM number input

    <div class="level-box numbertype" data-min="1" data-max="6">
        <div class="level-text">Szint: <span>1</span></div>
        <div class="level-control">
            <div class="level-up">&#9206;</div>
            <div class="level-down">&#9207;</div>
        </div>
    </div>
*/

class NumberType{

    constructor(sel){
        this.DOM = document.querySelector(sel);
        this.min = Number(this.DOM.dataset.min) || 0;
        this.max = Number(this.DOM.dataset.max) || Infinity;
        this.init = Number(this.DOM.dataset.init) || 0;

        this.build();
    }

    build(){
        this.up = this.DOM.querySelector(".level-up");
        this.down = this.DOM.querySelector(".level-down");

        this.valueContainer = this.DOM.querySelector(".level-text > span");

        let _this = this;

        this.up.addEventListener("click", function(){
            if (_this.value < _this.max)
                _this.value = ++_this.value;
        });

        this.down.addEventListener("click", function(){
            if (_this.value > _this.min)
                _this.value = --_this.value;
        });
    }

    get initValue(){
        return this.value + this.init;
    }

    get value(){
        return Number(this.valueContainer.innerText);
    }

    set value(v){
        if (v >= this.min && v <= this.max)
            this.valueContainer.innerText = v;
    }
}