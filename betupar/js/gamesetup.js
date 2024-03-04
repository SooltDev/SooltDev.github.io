"use strict";

import { getElement, randomize, removeAllChild, shuffleArray, emptyArray} from "./assets/stools.js";
import { elementsFromTempalte, templateToObject } from "./assets/evaltemplate.js";
import { loadLetterCSV } from "./assets/csvtojson.js";
//import letterFigure from '../szavak.json';


const template = `
    <div class="playground" data-eval="dom" data-domname="element">
        <div class="palyground-inner">
            <img width="320" src="./style/svg/logo.svg"></img>
        </div>

        <div class="panel">
            <div class="panel-inner game-mode">
                <div class="btn btn-game-mode icon-btn letter-to-letter" id="letter-to-letter-btn" data-eval="dom">
                </div>
                <div class="btn btn-game-mode icon-btn voice-to-letter" id="voice-to-letter-btn" data-eval="dom">
                </div>
                <div class="btn btn-game-mode icon-btn letter-to-figure" id="letter-to-figure-btn" data-eval="dom">
                </div>
                <div class="btn btn-game-mode icon-btn options" id="options-btn" data-eval="dom">
                </div>
            </div>    
        </div>

    </div>
`;

const gameSetup = (options) => {

    const parentElement = getElement(options.parentElement);
    const GAME = options.game;

    let Elements = {
        // Elements container on template
    };

    const newGame = (opt) => {
        /*
        const app = matchLine({
            parentElement: opt.parentElement
        });
        */
        const app = GAME;

        app.render();
        
        app.gameOptions({
            letterNumber: opt.letterNumber || 4,
            from: {
                type: opt.fromType, //letter
            },
            to: {
                type: opt.toType //letter
            }
        });

        if (Elements.element)
            Elements.element.remove();
        
        window.app = app;
        app.newGame();
    
        return app;
    }

    const clearDOM = () => {
        for (const name in Elements){
            Elements[name].remove();
            delete Elements[name];
        }
    }

    const render = () => {

        clearDOM();

        const { letterToLetterBtn, letterToFigureBtn } = Elements = elementsFromTempalte(template);

        letterToLetterBtn.addEventListener('click', () => {
            newGame({
                parentElement,
                letterNumber: 4,
                fromType: 'letter',
                toType: 'letter'
            });
        });

        letterToFigureBtn.addEventListener('click', async () => {
            const res = await fetch('/szavak.json');
            const data = await res.json();

            console.log(data);
        });

        parentElement.appendChild(Elements.element);
    }

    return {
        render
    }

}

export { gameSetup }
