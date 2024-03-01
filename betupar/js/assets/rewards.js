import * as sTools from "./stools.js";
import { SElement, createSElement } from "./selement.js";
import { evalTemplate, elementsFromTempalte} from "./evaltemplate.js";


const starsTpl = `
    <div class="stars-ct" data-eval="dom">
        <div class="stars-inner" data-eval="dom"></div>
    </div>
`;

/**
 * Addig fog érni az element1, ameddig az element2
 * @param {HTMLElement} element1 
 * @param {HTMLElement} element2 
 */
const setHeightToHeight = (element1, element2) => {
    element1.style.height = 
        ((element2.offsetHeight + element2.offsetTop) - element1.offsetTop) + 'px';
}

const rewards = (o) => {

    const parentElement = sTools.getElement(o.parentElement);
    let layerElement;

    const goodJob = () => {

    }

    const layer = () => {
        return new Promise(function(resolve, reject){

            const element = document.createElement('div');
            layerElement = element;

            element.addEventListener('animationend', () => {
                resolve(element);
            });

            element.style.height = parentElement.offsetHeight+'px';
            element.className = 'reward-layer layerfadein';

            parentElement.appendChild(element);
        });
    }

    const rewardAnim = async (cssName, animName, options = {
        hideAfterFinish: true
    }) => {

        const element = document.createElement('div');

        const parent = await layer();
        parent.appendChild(element);

        element.addEventListener('animationend', () => {

            if (!options.hideAfterFinish){
                parent.addEventListener('click', () => {
                    parent.remove();
                });
                parent.style.transition = 'height .2s ease-in';
                setHeightToHeight(parent, parentElement.firstElementChild);
            }
        });

        element.className = 'reward ' + cssName + ' ' + animName;
        
        if (options.hideAfterFinish)
            setTimeout(() => {
                parent.remove();
                
            }, 1600);
        else {

        }

        return {parent, element};
    }

    const correct = () => {
        rewardAnim('line-correct', 'zoomin');
    }

    const incorrect =() => {
        rewardAnim('line-incorrect', 'zoomin');
    }

    const success = () => {
        rewardAnim('all-success', 'zoomin', {
            hideAfterFinish: false
        });
    }

    const finished = () => {
        rewardAnim('all-finished', 'zoomin', {
            hideAfterFinish: false
        });
    }

    const failed = () => {

    }

    const addStars = (starNumber) => {
        const {starsCt, starsInner} = elementsFromTempalte(starsTpl);
        
    }

    return {
        correct, incorrect, success, failed, addStars, goodJob, finished,
        get layer(){
            return layerElement;
        }
    }

};

export { rewards }