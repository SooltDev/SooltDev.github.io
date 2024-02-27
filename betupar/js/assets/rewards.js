import * as sTools from "./stools.js";
import { SElement, createSElement } from "./selement.js";

const rewards = (o) => {

    const parentElement = sTools.getElement(o.parentElement);

    const goodJob = () => {

    }

    const layer = () => {
        const element = document.createElement('div');
        element.className = 'reward-layer layerfadein';

        parentElement.appendChild(element);

        return element;
    }

    const correct = () => {
        const element = document.createElement('div');

        const parent = layer();
        parent.appendChild(element);

        setTimeout(() => {
            element.className = 'line-correct zoomin';
        }, 200);
        setTimeout(() => {
            parent.remove();
        }, 1600);

    }

    const incorrect =() => {

    }

    const success = () => {

    }

    const failed = () => {

    }

    const addStar = () => {

    }

    return {
        correct, incorrect, success, failed, addStar, goodJob
    }

};

export { rewards }