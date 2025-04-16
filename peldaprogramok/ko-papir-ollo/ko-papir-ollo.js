const koPapirOllo = (function(){

    const template = `
        <div class="game">
            <div class="gamer">
                <div class="player-name">Robi - <span id="player1-score"> 0</span></div>
                <div id="player1"></div>
            </div>
            <div class="gameland">
                <button>Kezdés</button>
            </div>
            <div class="gamer">
                <div class="player-name">Elek - <span id="player2-score"> 0</span></div>
                <div id="player2"></div>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = template;

    const messageBox = document.createElement('div');
    messageBox.className = "message-box";

    const alternatives = ['ko', 'papir', 'ollo'];

    let parentElement;

    const random = (a, b) => Math.floor(Math.random() * (b - a)) + a;

    const winner = (p1, p2) => {
        p1 = alternatives[p1];
        p2 = alternatives[p2];

        if (p1 == p2)
            return 'equal';

        if ( (p1 == 'ollo' && p2 == 'papir') || (p1 == 'ko' && p2 == 'ollo') || (p1 == 'papir' && p2 == 'ko') )
            return 'player1';

        return 'player2';
    }

    const render = (renderTo) => {
        parentElement = document.querySelector(renderTo);

        const gameElement = div.firstElementChild.cloneNode(true);

        parentElement.appendChild(gameElement);

        const player1Element = gameElement.querySelector("#player1");
        const player2Element = gameElement.querySelector("#player2");

        const player1Score = gameElement.querySelector("#player1-score");
        const player2Score = gameElement.querySelector("#player2-score");

        const gameland = gameElement.querySelector(".gameland");
        const btn = gameElement.querySelector("button");

        player1Element.classList.add('ko');
        player2Element.classList.add('ko');

        let player1Lot, player2Lot;
        
        const score = {
            player1: 0,
            player2: 0,
            equal: 0
        };

        btn.addEventListener('click', () => {

            player1Lot = random(0, 3);
            btn.remove();
            messageBox.remove();

        });

        document.body.addEventListener('keydown', (ev) => {
            //console.log(ev);

            if (ev.key == "Enter"){
                btn.click();
                return;
            }

            switch (ev.key.toUpperCase()){
                case "K":
                    player2Lot = 0;
                    break;
                case "P":
                    player2Lot = 1;
                    break;
                case "O":
                    player2Lot = 2;
                    break;
                default:
                    return;
            }

            player1Element.className = alternatives[player1Lot];
            player2Element.className = alternatives[player2Lot];

            const win = winner(player1Lot, player2Lot);
            score[win]++;

            const winnerText = {
                player1: "Robi győzött",
                player2: "Elek lett a győztes",
                equal: "Döntetlen, Újra!"
            };

            messageBox.textContent = winnerText[win];
            gameland.appendChild(messageBox);
            gameland.appendChild(btn);
            
            player1Score.textContent = score.player1;
            player2Score.textContent = score.player2;

        });
    }

    return {
        render
    }
})();