function random(a, b){
    return Math.floor( Math.random() * (b - a)) + a;
}

class Kerek{

    #pontok = [
        {value: 10, color: "#643105", backgroundColor: "#ffe5a8"}, 
        {value: 500, color: "#f2f8f6", backgroundColor: "#b4260f"}, 
        {value: "felező", color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 5, color: "#643105", backgroundColor: "#ffe5a8"}, 
        {value: 1000, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: 250, color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 75, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: "csőd", color: "#f2f8f6", backgroundColor: "#b4260f"}, 
        {value: "dupla", color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 100, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: 25, color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 50, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: 15, color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 150, color: "#643105", backgroundColor: "#ffe5a8"}, 
        {value: 750, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: 20, color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: 125, color: "#643105", backgroundColor: "#ffe5a8"}, 
        {value: 400, color: "#f2f8f6", backgroundColor: "#de2027"}, 
        {value: 55, color: "#643105", backgroundColor: "#ffe5a8"}, 
        {value: 275, color: "#183950", backgroundColor: "#7fa5c1"}, 
        {value: "újra", color: "#f2f8f6", backgroundColor: "#b4260f"}, 
        {value: 1, color: "#183950", backgroundColor: "#7fa5c1"}
    ];

    static tpl = `
    <div class="kerek-ct">
        <div class="forgat">Forgat</div>
        <div class="kerek">
            <div class="tarcsa">

            </div>
            <div class="jelzo">◄</div>
        </div>
    </div>
    `;

    constructor(o){
        this.forgathat = true;

        const div = document.createElement('div');
        div.innerHTML = Kerek.tpl;

        this.ct = div.firstElementChild;
        this.parentElement = document.querySelector(o.parentElement);

        this.parentElement.appendChild(this.ct);

        this.tarcsa = this.#getElement(".tarcsa");

        this.render();

        const _this = this;
        this.#getElement(".forgat").onclick = function(){
            if (_this.forgathat){
                _this.forgat();
                this.classList.add("inactive");
            }
        };
        
        this.forgatasUtan = o.forgatasUtan || function(){};
    }

    #getElement(sel){
        return this.ct.querySelector(sel);
    }

    render(){
        let kerekHTML = "";
        const r = 120;
        const reverse = r + (r / 10);
        const step = 18;
    
        let pontindex = 0;
    
        for (let x = 0; x <= 180; x += step){
    
            let scale = Math.cos(x * Math.PI / 180);
            let height = (reverse - Math.abs(Math.round(scale * r)))/2;
    
            let p = this.#pontok[pontindex];
            
            kerekHTML += `
                <div class="kerek-elem" style="height: ${height}px; background-color: ${p.backgroundColor}" id="pont-${pontindex}">
                    <span style="transform: scaleY(${1 - Math.abs(scale)}); color: ${p.color};">${p.value}</span>
                </div>
            `;    
            pontindex++;
        }
    
        this.tarcsa.innerHTML = kerekHTML;
    }

    forgat(){
        let speed = 10;
        let intensity = random(10, 26);
        const _this = this;
        
        if (this.forgathat){
            this.forgatas = false;
            while (speed <= 5000){
                setTimeout(function(){
                    _this.#pontok.unshift(_this.#pontok.pop());
                    _this.render();
                }, speed.toFixed());
        
                speed = speed + (speed/intensity);

            }
            setTimeout(function(){
                _this.forgatas = true;
                _this.forgatasUtan();
            },speed);
        }
    }

    /**
     * @param {boolean} b
     */
    set forgatas(b){
        this.forgathat = b;
        if (b)
            this.#getElement(".forgat").classList.remove("inactive");
        else 
            this.#getElement(".forgat").classList.add("inactive");
    }

    get forgatas(){
        return this.forgathat;
    }

    get val(){
        return this.#pontok[5].value;
    }
}
