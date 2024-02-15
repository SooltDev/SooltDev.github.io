class Timer{
    #firstStart = true;
    #now;
    #milisec;
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

        if (this.#firstStart){
            this.#now = new Date();
            this.#now.setHours(0);
            this.#now.setMinutes(0);
            this.#now.setSeconds(0);

            this.#milisec = 1000;

            this.#firstStart = false;
        }

        this.timerId = setInterval(() => {
            this.#now.setTime(this.#now.getTime() + this.#milisec);
            this.container.innerHTML = this.timerTemplate(this.#now);
        }, this.#milisec);
    }

    stop(){
        this.pause();
        this.#firstStart = true;
    }

    pause(){
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

export { Timer };