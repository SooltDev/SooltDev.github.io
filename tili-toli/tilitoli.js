/*
    File: MAIN SCRIPT

    Game: Tili-Toli
    Version: 2.0 Beta
    Author: Fosztó Zsolt
*/

document.title = "Tili-Tolti " + TiliToli.version;

let step = 0;
const stepContainer = document.querySelector("#stepsct .step");

function reset(){
    stepContainer.innerHTML = "0";
    step = 0;
    document.querySelector(".game-status").innerHTML = "Tili-Toli";
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

    win: function(){
        document.querySelector(".game-status").innerHTML = "NYERT!";
        ttimer.stop();
    },
    moveAction: function(){
        step++;
        stepContainer.innerHTML = step+"";
    },
    afterShuffle: function(){
        ttimer.restart();
    }
});

document.querySelector("#new-game").addEventListener("click", function(){
    reset();
    let level = ttLevel.initValue;
    tt.setSize(level, level);
    tt.renderGameTable();
    ttimer.stop();
    setTimeout(function(){
        tt.shuffle(300, 2);
    }, 1000);
});

document.querySelector("#shuffle").addEventListener("click", function(){
    ttimer.stop();
    tt.shuffle(200, 2);
})