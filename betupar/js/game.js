"use strict";

import * as sTools from "./assets/stools.js";
import { elementsFromTempalte, templateToObject } from "./assets/evaltemplate.js";
import { Matchbox } from "./assets/matchbox.js";
import { HTMLLine } from "./assets/line.cls.js";
import { rewards } from "./assets/rewards.js";

const matchboxTemplate = `
    <div class="playground" data-eval="dom">
        <div class="palyground-inner">
            <div class="matchbox">
                <div id="match-from" data-eval="dom"></div>
            </div>
            <div class="matchland" data-eval="dom"></div>
            <div class="matchbox">
                <div id="match-to" data-eval="dom"></div>
            </div>
        </div>
        <div class="panel">
            <div class="panel-inner">
                <div class="btn btn-home icon-btn" id="home-btn" data-eval="dom"></div>
                <div class="btn btn-reload icon-btn" id="reload-btn" data-eval="dom"></div>
                <div class="btn btn-status" id="status-display" data-eval="dom"></div>
            </div>    
        </div>
    </div>
`;

const lowerCaseLetters = 'a,á,b,c,cs,d,e,é,f,g,gy,h,i,í,j,k,l,ly,m,n,ny,o,ó,ö,ő,p,r,s,sz,t,ty,u,ú,ü,ű,v,x,z,zs'.split(',');
const upperCaseLetters = lowerCaseLetters.map(
    l => l.length == 1 ? l.toUpperCase() : l[0].toUpperCase() + l.slice(1)
);

const wowels = 'a,á,e,é,i,í,o,ó,ö,ő,u,ú,ü,ű'.split(',');

const isWowle = (letter) => wowels.includes(letter);

const isLower = letter => {
    return lowerCaseLetters.includes(letter);
};

const reverseChar = (l) => {
    let ret = '';
    if (l.length == 1)
        ret =  l.toUpperCase() == l ? l.toLowerCase() : l.toUpperCase();
    else 
        ret =  l[0].toUpperCase() == l[0] ? l.toLowerCase() : sTools.capitalize(l);
    return ret;
};

const epmtyLine = (boxes) => {
    for (const box of boxes)
        if (box.line && box.line instanceof HTMLLine)
            box.line.destroy();
};

const matchLine = function(options){
    let GAMESETUP;
    
    let REWARD;
    
    let Elements = {
        // Elements container on template
    };

    let 
        letterNumber = 4,
        gameType = 'mixed', //mixed, 'upper', 'lower'
        from = {
            type: 'letter',
            location: 'start'
        }, 
        to = {
            type: 'letter',
            location: 'target'
        };
    
    let letters = [];

    const fromBoxes = [];
    const toBoxes = [];

    const parentElement = sTools.getElement(options.parentElement);

    const gameMode = () => {
        return from.type + 'To' + sTools.capitalize(to.type);
    }

    const isPerfect = () => {
        for (const card of fromBoxes)
            if ( !card.linked || card.isWrong() )
                return false;

        return true;
    }

    const isComplete = () => {
        for (const card of fromBoxes)
            if ( !card.linked )
                return false;

        return true;
    }

    const clearDOM = () => {
        for (const name in Elements){
            Elements[name].remove();
            delete Elements[name];
        }
    }

    const render = () => {

        clearDOM();

        const {
            homeBtn, reloadBtn
        } = Elements = elementsFromTempalte(matchboxTemplate);
        parentElement.appendChild(Elements.playground);

        reloadBtn.addEventListener("click", newGame);
        homeBtn.addEventListener("click", () => {
            clearDOM();
            GAMESETUP.render();
            REWARD.layer.remove();
        });
    }

    /**
     * Beállításokat eszközöl a játék működéséhez
     * @param {{letterNumber: number, from: {type: string}, to: {type: string}}} o 
     * @param {number} o.letterNumber Ennyi kártyát fog generálni az app
     * @param {Object} o.from A bal oldalon levő kártyák beállításai
     * @param {Object} o.to A jobb oldalon levő kártyák beállításai
     */
    const gameOptions = (o) => {
        o = sTools.deepAssign(o, {
                letterNumber: 4,
                gameType: 'mixed', //mixed, 'upper', 'lower'
                from: {
                    type: 'letter',
                    location: 'start'
                },
                to: {
                    type: 'letter',
                    location: 'target'
                }
            });

        //console.log(o);
        letterNumber = o.letterNumber;
        from = o.from;
        to = o.to;
    }

    const randomLetters = () => {

        let letters = [];

        for (let i = 0; i < letterNumber; i++){

            let upperOrLetter = sTools.randomize(0, 2);
            let randomLetter = '';
            let randomChars = upperOrLetter ? upperCaseLetters : lowerCaseLetters;

            do {
                randomLetter = randomChars[sTools.randomize(0, randomChars.length)];
            } while (letters.includes(randomLetter.toLowerCase()))

            letters.push(randomLetter);
        }

        return letters;
    }

    const linkEvent = async () => {
        if (isPerfect())
            REWARD.success();
        else if (isComplete())
            REWARD.finished();
        else
            REWARD.correct();
    }

    const newGame = () => {
        epmtyLine(fromBoxes);
        epmtyLine(toBoxes);

        sTools.emptyArray(fromBoxes);
        sTools.emptyArray(toBoxes);

        if (REWARD && REWARD.layer)
            REWARD.layer.remove();

        letters = randomLetters();
        //console.log(from);
        //- létrehozzuk az új kártyákat a fromBoxes-ba és a toBoxes-ba
        for (const letter of letters){
            //- egy új példány készítése
            const fromBox = new Matchbox({
                type: from.type,
                letter: letter,
                location: from.location,
                playground: Elements
            });
            //- elkészítjül a társának is az új példányát
            const toBox = new Matchbox({
                type: to.type,
                letter: gameMode() == 'letterToLetter' ? reverseChar(letter) : letter,
                location: to.location,
                playground: Elements
            });

            fromBox.on('link', linkEvent);
            fromBox.on('badlink', () => {
                REWARD.incorrect();
            });

            toBox.on('link', linkEvent);
            toBox.on('badlink', () => {
                REWARD.incorrect();
            });

            //ekkor van 2 box példányunk. így be tudjuk állítani a boxoknak a társát
            fromBox.partner = toBox;
            toBox.partner = fromBox;

            fromBoxes.push(fromBox);
            toBoxes.push(toBox);
        }
        //- összekeversjük a toBoxes tömb sorrendjét
        sTools.shuffleArray(toBoxes);

        //- kirendereljük a képernyőre.

        build();
    }

    const isMixed = () => {
        return gameType == 'mixed';
    }

    const build = () => {

        const { matchFrom, matchTo } = Elements;

        sTools.removeAllChild(matchFrom);
        sTools.removeAllChild(matchTo);

        for (const i in fromBoxes){
            fromBoxes[i].appendTo(matchFrom);
            toBoxes[i].appendTo(matchTo);
        }

        REWARD = rewards({
            parentElement: Elements.playground
        });
    }

    return { render, gameOptions, newGame,
        get letters(){
            return letters;
        },
        get DOMElements(){
            return Elements
        },
        /**
         * @param {any} s
         */
        set gameSetup(s){
            GAMESETUP = s;
        }
    }
}

export { matchLine }
