import * as sTools from './assets/js/stools.js';
import Game from './assets/game/game.js';

(async function (){
    
    const options = await sTools.loadJSON('./configoptions.json');

    sTools.global('game', 
        new Game(options, '#game-place')
    );

    //new Game(options, '#game-place');
    
})();