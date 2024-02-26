import { gameSetup } from "./js/gamesetup.js";
import { matchLine } from "./js/app.js";

const game = matchLine({
    parentElement: '#content',
});

const app = gameSetup({
    parentElement: '#content',
    game: game
});

game.gameSetup = app;

app.render();

/*
import { matchLine } from "./js/app.js";

const app = matchLine({
    parentElement: '#content'
});

app.render();

app.gameSetup({
    letterNumber: 4,
    from: {
        type: 'letter',
    },
    to: {
        type: 'letter'
    }
});

window.app = app;
app.newGame();
*/