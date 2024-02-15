const randomize = (a, b) => Math.floor(Math.random() * (b -a )) + a;

const createElement = (o) => {

    o = Object.assign({
        tagName: 'div',
        className: '',
        id: '',
        innerHTML: ''
    }, o);

    const el = document.createElement(o.tagName);
    
    if (o.className)
        el.className = o.className;
    if (o.id)
        el.id = o.id;
    if (o.innerHTML)
        el.innerHTML = o.innerHTML;
    if (o.dataset)
        Object.assign(el.dataset, o.dataset);

    return el;
}

const getElement = (selectorOrElement) => {
    let el = null;

    if (typeof selectorOrElement === 'string')
        el = document.querySelector(selectorOrElement);
    else if (typeof selectorOrElement === 'object' && selectorOrElement instanceof HTMLElement)
        el = selectorOrElement;

    return el;
}


export {
    randomize, createElement, getElement
};