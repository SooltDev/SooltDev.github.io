/*!
    File: MAIN SCRIPT

    Game: Tili-Toli
    Version: 2.0 Beta
    Author: Fosztó Zsolt
*/

document.title = "Tili-Tolti " + TiliToli.version;
//document.querySelector(".game-status").innerHTML = "Játék";

let step = 0;
const stepContainer = document.querySelector("#stepsct .step");

function reset() {
    stepContainer.innerHTML = "0";
    step = 0;
    //document.querySelector(".game-status").innerHTML = "Játék";
    ttimer.reset();
}

const ttLevel = new NumberType("#tt-level");

const ttimer = new Timer({
    container: "#timerct .step",
    format: "mm:ss"
});

const tt = new TiliToli({
    sizex: 4,
    sizey: 4,
    addTo: "#tili-toli",
    stepType: "multi", // single/multi
    keyControll: true, //false

    win: function () {
        //document.querySelector(".game-status").innerHTML = "NYERT!";
        ttimer.stop();
    },
    moveAction: function () {
        step++;
        stepContainer.innerHTML = step + "";
    },
    afterShuffle: function () {
        reset();
        ttimer.restart();
    }
});

const arrows = new ArrowKeys({
    renderTo: ".game-section",
    events: {
        keydown: function(){
            tt.winnerPrize();
        }
    },
    keyevents: {
        "ArrowUp": function(){
            tt.move("up");
        },
        "ArrowDown": function(){
            tt.move("down");
        },
        "ArrowLeft": function(){
            tt.move("left");
        },
        "ArrowRight": function(){
            tt.move("right");
        },
        "Enter": function(){
            document.querySelector("#new-game").click();
        }
    }
});

window.focus();

document.querySelector("#new-game").addEventListener("click", function () {
    reset();
    let level = ttLevel.initValue;
    tt.setSize(level, level);
    tt.renderGameTable();
    ttimer.stop();
    tt.displayEmptySlot();
    setTimeout(function () {
        tt.shuffle(300, 2);
    }, 500);
});

/*
<div class="game-button" id="pause-game">
                        <i class="si si-pause"></i> <span>Szünet</span>
                    </div>
*/

const pauseBtn = new ToggleButton({
    id: 'pause-game',
    cssClass: 'game-button',
    status: 'off', //optional
    icon: {
        cssClass: 'si',
        onClass: 'si-pause',
        offClass: 'si-play'
    },
    parentElement: document.querySelector('#game-controll'),
    text: "Szünet :)",
    offText: "Folytatás",
    toggleEvents: {
        on: function(){
            console.log("ON");
        },
        off: function(){
            console.log("OFF");
        }
    }
});

/*
document.querySelector("#shuffle").addEventListener("click", function(){
    ttimer.stop();
    tt.shuffle(200, 2);
});
//*/
