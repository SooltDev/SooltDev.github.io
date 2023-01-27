class Timer{

    constructor(o){
        this.container = document.querySelector(o.container);
        this.startTime = o.startTime || 0;
        this.timerId = null;
        this.format = o.format || "mm:ss";
        this.timer = this.startTime;
        this.resetContent = this.container.innerHTML;
    }

    /**
     * @param {string} f
     */
    #add0(t){
        return t < 10 ? "0" + t : t;
    }
    #createTemplate(){
        switch (this.format){
            case "mm:ss":
                this.timerTemplate = function(d){
                    return `${this.#add0(d.getMinutes())}:${this.#add0(d.getSeconds())}`;
                }
            break;
            case "hh:mm:ss":
                this.timerTemplate = function(d){
                    return `${this.#add0(d.getHours())}:${this.#add0(d.getMinutes())}:${this.#add0(d.getSeconds())}`;
                }
            break;
        }
    }

    set format(f){
        this.formatVal = f;
        this.#createTemplate();
    }

    get format(){
        return this.formatVal;
    }

    start(){
        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        let milisec = 1000;

        let _this = this;

        this.timerId = setInterval(function(){
            now.setTime(now.getTime() + milisec);
            _this.container.innerHTML = _this.timerTemplate(now);
        }, milisec);
    }

    stop(){
        clearInterval(this.timerId);
        this.timerId = null;
    }
    reset(){
        this.stop();
        this.timerId = null;
        this.timer = this.startTime;
        this.container.innerHTML = this.resetContent;
    }
    restart(){
        this.reset();
        this.start();
    }
}