/*
    main script
*/

document.title = "Tili-Tolti " + TiliToli.version;

let step = 0;
let stepContainer = document.querySelector(".game-messagebox .step");

function reset(){
    stepContainer.innerHTML = "0";
    step = 0;
    document.querySelector(".game-status").innerHTML = "Tili-Toli";
}

const ttLevel = new NumberType("#tt-level");

const tt = new TiliToli({
    sizex: 4,
    sizey: 4,
    addTo: "#tili-toli",
    win: function(){
        document.querySelector(".game-status").innerHTML = "NYERT!";
    },
    moveAction: function(){
        step++;
        stepContainer.innerHTML = step+"";
    }
});

document.querySelector("#new-game").addEventListener("click", function(){
    reset();
    let level = ttLevel.initValue;
    tt.setSize(level, level);
    tt.renderGameTable();
});

document.querySelector("#shuffle").addEventListener("click", function(){
    tt.shuffle(200, 2);
})