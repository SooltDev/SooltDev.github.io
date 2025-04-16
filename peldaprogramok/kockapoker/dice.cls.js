
(function(){
	const style = document.createElement('style');
	style.textContent = `
		.dice{
			background-color: #99856c;
			display: flex;
			border-radius: 6px;
			margin-right: 10px;
			box-shadow: 5px 5px 14px -1px #000;
			cursor: pointer;
			width: 50px;
			height: 50px;
			background-image: radial-gradient(farthest-corner at 18px -40px, #e8d8c4 46%, #79664f 100%);
			justify-content: center;
			align-items: center;
		}

        .dice.hold-on{
            box-shadow: 5px 5px 14px -1px #2f62a2;
            margin-top: -5px;
        }

		.dice-inner {
			background-color: rgb(171, 151, 127);
			display: flex;
			width: 44px;
			height: 46px;
			border-radius: 13px;
			text-align: center;
			justify-content: center;
			align-items: center;
			font-size: 32px;
			color: #311f08;
			text-shadow: 1px 1px #cec0af;
		}
	`;
	document.head.appendChild(style);
})();

/*
    2. Készítsetek egy dobókocka osztályt
        - Az osztály rendelkezzen egy dob metódussal, mely szimulálja, hogy dobtunk egyet a kockával.
          viszatér a dobott számmal, ám a példányban el is tárolja, hogy hányast dobtunk, amit egy getter függvénnyel lehessen lekérdezni.
          Úgy kérünk le értéket, hogy az csak olvasható legyen. Ha nem írjuk meg a settert melléje, akkor azt ugy nem tudjuk beállítani. 
          És ez esetben nem is kell, hisz új értéket, csak új dobással szerezhet a kocka.
        - Továbbá ezt a kocát lehessen bárhova HTML-en belül lerenderelni. Amit persze megtehetünk úgy is, hogy megadjuk a konstruktorban
          a renderTo lehetőséget, és a kocka ide jön létre.
        - Időzített script segítségével szimulálhatjuk a kocka gurítást is. (egyszerűen csak pörögnek a random számok, és az lesz az értéke, ahol megáll.)

        /*
    [
        [- 1 - -]
        [2 3 4 -]
        [- 6 - -]
        [- 5 - -]
    ]

*/

class Dice{
    
    #dice2d = [
        [0, 1, 0, 0],
        [2, 3, 4, 5],
        [0, 6, 0, 0],
        [0, 0, 0, 0],
    ];

    #stepFunctions = ['toUp', 'toDown', 'toLeft', 'toRight'];

    static template = `
        <div class="dice">
            <div class="dice-inner"></div>
        </div>
    `;

    #hold = false;

    constructor(renderTo){
        this.parentElement = document.querySelector(renderTo);

        this.build();
    }

    build(){
        const div = document.createElement('div');
        div.innerHTML = Dice.template;

        this.element = div.firstElementChild;

        this.element.addEventListener('click', () => {
            this.hold = !this.#hold;
        });

        this.contentElement = this.element.querySelector('.dice-inner');
        this.roll();

        this.parentElement.appendChild(this.element);
    }

    /**
     * @param {boolean} bool
     */
    set hold(bool){
        this.#hold = bool;
        this.element.classList[bool ? 'add' : 'remove']('hold-on');
    }

    get hold(){
        return this.#hold;
    }

    #random(a, b){
        b++;
        return Math.floor(Math.random() * (b - a)) + a;
    }

    #horizontalInit(){
        if (this.#dice2d[1][3] == 0){
            this.#dice2d[1][3] = this.#dice2d[3][1];
            this.#dice2d[3][1] = 0;
        }
    }

    toLeft(){
        this.#horizontalInit();
        const spinAxes = this.#dice2d[1];
        const first = spinAxes.shift();
        spinAxes.push(first);
    }

    toRight(){
        this.#horizontalInit();
        const spinAxes = this.#dice2d[1];
        const last = spinAxes.pop();
        spinAxes.unshift(last);
    }

    #verticalInit(){
        if (this.#dice2d[3][1] == 0){
            this.#dice2d[3][1] = this.#dice2d[1][3];
            this.#dice2d[1][3] = 0;
        }
    }
    
    toUp(){
        this.#verticalInit();
        const top = this.#dice2d[0][1];
        for (let i = 1; i < 4; i++)
            this.#dice2d[i-1][1] = this.#dice2d[i][1];

        this.#dice2d[3][1] = top;
    }

    toDown(){
        this.#verticalInit();
        const bottom = this.#dice2d[3][1];
        for (let i = 2; i >= 0; i--)
            this.#dice2d[i+1][1] = this.#dice2d[i][1];

        this.#dice2d[0][1] = bottom;
    }

    roll(){
        return new Promise((resolve, reject) => {

            if (!this.hold){

                let steps = this.#random(10, 35);
                
                let timerId = setInterval( () => {
                    let direction = this.#random(0, 3);
                    
                    this[this.#stepFunctions[direction]]();
                    this.contentElement.textContent = this.value;

                    if (steps == 0 ){
                        clearInterval(timerId);
                        resolve(this.value);
                    }
                    steps--

                }, 40); // end setInterval
            } else 
                reject(this.value);
        }); // end Promise
    }

    get value(){
        return this.#dice2d[1][1];
    }
}