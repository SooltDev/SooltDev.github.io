
import Button from "../js/button.js";
import { getElement, evalTamplate, randomize } from "../js/stools.js";
import Hole from "./hole.js";
import Squirrel from "./squirrel.js";

const gameTamplate = `
    <div class="game-section">
        <div class="game-title">Kapd el a Mókust!</div>
        <div class="game-status">
            <div class="game-score">
                <span class="status-text">Pontszámok: </span><span class="score">0</span>
            </div>
            <div class="game-live">
            </div>
        </div>
        <div class="game-inner-ct">
            <div id="gamebox" class="gamebox">

            </div>
            <div class="game-controll">
                <div class="game-button" id="new-game" data-element="text">Kezdés</div>
                <div class="game-button" id="pause-game">
                    <i class="si si-pause" data-element="icon"></i><span data-element="text">Szünet</span>
                </div>
            </div>
            <div class="game-layer">
                <span class="game-layertext">Vége!</span>
            </div>
        </div>
    </div>
`;

const heartTpl = `<span class="heart">&#10084;</span>`;

export default class Game{

    #options = null;
    #holes = [];
    #score = 0;
    #live = 4;

    parentElement;
    element;
    holeCt;
    scoreCt;
    liveCt;
    startBtn;
    pauseBtn;
    gameLayer;

    #startId = null;
    #level = 'easy'; //medium, hard
    #paused = false;
    #speed;

    #squirrel = null;

    #squirreledHole;

    constructor(options, renderTo){
        this.options = options;
        this.parentElement = getElement(renderTo);

        this.#squirrel = new Squirrel();

        this.createGameBox();

        this.live = this.options.live; //setter function render hearts

        this.renderHoles();

        this.#squirrel.on('bang', () => {
            console.log('paused', this.#paused);
            
            if (!this.#paused){
                this.#squirrel.outOfHole();
                this.score++; //setter
            }
        });

        this.reset();
    }

    createGameBox(){
        this.element = evalTamplate(gameTamplate);
        this.holeCt = this.element.querySelector(".gamebox");
        this.scoreCt = this.element.querySelector(".score");
        this.liveCt = this.element.querySelector(".game-live");
        this.startBtn = new Button (this.element.querySelector("#new-game"));
        this.pauseBtn = new Button(this.element.querySelector("#pause-game"));
        this.gameLayer = this.element.querySelector(".game-layer");

        this.gameLayer.addEventListener('click', () => {
            this.gameLayer.classList.remove('show');
        });
        
        this.startBtn.on('click', () => {
            this.start();
            this.pauseBtn.enable();
            this.startBtn.disable();
        });

        this.startBtn.on('enable', () => {
            this.#paused = false;
        });

        this.pauseBtn.disable();

        this.pauseBtn.on('click', () => {
            this.pause();
            this.pauseBtn.disable();
        });

        this.parentElement.appendChild(this.element);
    }

    renderHearts(){
        this.liveCt.innerHTML = '';
        for (let i = 0; i < this.live; i++)
            this.liveCt.insertAdjacentHTML('beforeend', heartTpl);
    }

    renderHoles(){
        for (const index in this.options.holes){
            const hole = this.options.holes[index];
            this.#holes.push(
                new Hole({...hole, index}, this.holeCt)
            );
        }
    }

    randomHole(){
        const holeIndex = randomize(0, this.#holes.length);
        return this.#squirreledHole = this.#holes[holeIndex];
    }

    start(){
        if (this.#startId == null){
            
            this.#paused = false;

            if (this.isGameOver())
                this.reset();

            const loop = () => {
                
                if (this.#squirrel.isInHole()){
                    this.#squirrel.outOfHole();
                    this.live--; //setter render hearts

                    console.log("live is: " + this.#live);
                    
                    if (this.#live == 0)
                        this.gameOver();
                }

                if (!this.isGameOver()){
                    const hole = this.randomHole();
                    this.#squirrel.fromTheHole(hole);
                }

                if (this.score % 10 == 0){
                    this.#speed -= 200;
                }

                if (this.live > 0)
                    this.#startId = setTimeout( loop, this.#speed );

            } // end function loop

            console.log(this.#speed);

            this.#startId = setTimeout( loop, this.#speed );
            
        }
    }

    pause(){
        clearInterval(this.#startId);
        this.#startId = null;
        this.element.classList.add('disabled');
        this.pauseBtn.disable();
        this.startBtn.enable();
        this.startBtn.text = "Folytatás";
        this.#paused = true;
    }

    reset(){
        this.#startId = null;
        this.score = 0;
        this.live = this.options.live;
        this.#speed = this.options.levels[this.#level];
        this.#paused = false;
        this.startBtn.text = "Kezdés";
        this.pauseBtn.disable();
    }

    isGameOver(){
        return this.#live < 1;
    }

    gameOver(){
        clearInterval(this.#startId);
        this.#startId = null;
        this.gameLayer.classList.add('show');
        this.startBtn.enable();
        this.startBtn.text = "Kezdés";
        this.pauseBtn.disable();
    }

    set options(opt){
        this.#options = opt;
    }

    get options(){
        return this.#options;
    }

    get score(){
        return this.#score;
    }
    set score(s){
        this.#score = s;
        this.scoreCt.textContent = this.#score;
    }

    get live(){
        return this.#live;
    }

    set live(v){
        this.#live = v;
        this.renderHearts();
    }
}