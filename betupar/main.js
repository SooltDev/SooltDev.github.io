import { gameSetup } from "./js/gamesetup.js";
import { matchLine } from "./js/game.js";

//screen.orientation.lock('portrait');

const game = matchLine({
    parentElement: '#content',
});

const app = gameSetup({
    parentElement: '#content',
    game: game
});

game.gameSetup = app;

app.render();
