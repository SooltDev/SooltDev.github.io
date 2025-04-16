const random = (a, b) => Math.floor(Math.random() * (b - a) ) + a;

const randomRgb = () => `rgb(${random(0, 256)}, ${random(0, 256)}, ${random(0, 256)})`;

const getElement = (selectorOrElement) => {
    let element = null;
    if (typeof selectorOrElement == 'string')
        element = document.querySelector(selectorOrElement);
    else if (selectorOrElement instanceof HTMLElement)
        element = selectorOrElement;

    return element;
}

const colorPartsDecimal = color => {
    let colors = [];

    if (/^#([\da-f]{3}|[\da-f]{6})$/.test(color)){
        color = color.slice(1);
        colors = (color.length == 6 ? color.match(/[\da-f]{2}/g) : color.match(/[\da-f]/g))
            .map((n) => parseInt(n.length == 1 ? n+n : n, 16));
    } else if (/^rgb\(\d{1,3}(,\s?\d{1,3}){2}\)$/.test(color)){
        colors = color.match(/\d{1,3}/g).map(Number);
    }

    return colors;
}

const colorRange = (color, range) => {
    let [r, g, b] = colorPartsDecimal(color);

    console.log(r, g, b);
    
    const calcRange = (cr) => cr + Math.round((range >= 0 ? (255 - cr) : cr) / 100 * range);
    const calcColor = (c) => c > 255 ? 255 : c < 0 ? 0 : c;
    
    /*
    const newR = calcColor(calcRange(r));
    const newG = calcColor(calcRange(g));
    const newB = calcColor(calcRange(b));
    //*/

    //*
    const newR = calcRange(r);
    const newG = calcRange(g);
    const newB = calcRange(b);
    //*/
    return `rgb(${newR}, ${newG}, ${newB})`;
}

export {
    random, randomRgb, getElement, colorRange
}