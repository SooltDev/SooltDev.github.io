function global(key, val){
    window[key] = val;
}

/**
 * Lekérdez paraméter alapján, egy DOM elementet.
 * @param {string|HTMLElement} selctorOrElement 
 * @returns {HTMLElement|null}
 */

function getElement(selctorOrElement){
    let el = selctorOrElement;

    if (typeof el == 'string')
        el = document.querySelector(el);

    return el instanceof HTMLElement ? el : null;
}

export {
    global, getElement
}