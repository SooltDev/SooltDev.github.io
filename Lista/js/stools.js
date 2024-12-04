
var STools = (function(){
    const loadJSON = async (url) => {
        const res = await fetch(url);
        return res.json();
    }
    
    const require = async (url) => {
        return new Promise(function (resolve, reject) {
            const s = document.createElement('script');
            s.src = url;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    };
    
    const requireCSS = async (url) => {
        return new Promise(function (resolve, reject) {
            const s = document.createElement('link');
            s.rel = 'stylesheet';
            s.href = url;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
    
    const randomize = (a, b) => Math.floor(Math.random() * (b -a )) + a;
    
    /**
     * Átalakít egy stringet úgy, hogy nagybetűvel kezdődjön, az összes többi kisbetűs lesz
     * (Főleg szavakra alkalmazandó)
     * @param {string} s 
     * @returns {string}
     */
    const capitalize = (s) => typeof s == 'string' ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
    
    const shuffleArray = (array) => {
        let j;
        const [ ...copyArray ] = array;
        
        do {
            for (let i = 0; i < array.length; i++){
                
                do {
                    j = randomize(0, array.length);
                } while (j == i)
    
                [array[i], array[j]] = [array[j], array[i]];
    
            }
        } while (JSON.stringify[array] == JSON.stringify(copyArray))
    
        return array;
    }
    
    /**
     * Objecteket és Tömböket egyesít. Hasonló az Object.Assign()-hez, annyi külömbséggel, hogy 
     * a deepAssign a teljes mélységig klónoz. 
     * 
     * A deepAssign metódust egy tömb vagy object teljes mélységében való klónozására is használható.
     * 
     * Annyiban jobb a JSON.parse(JSON.stringify(object)) megoldáshoz képest, hogy a 
     * 
     * @param  {...object|array} objects 
     * @returns {object|array}
     */
    const deepAssign = (...objects) => {
        const merged = Array.isArray(objects[0]) ? [] : {};
        
        for (const object of objects){
            
            for (const key in object){
                if (!Array.isArray(object[key]) && object[key] instanceof Object ){
                    if (!merged.hasOwnProperty(key))
                        merged[key] = {};
                    merged[key] = deepAssign(merged[key], object[key]);
                }
                else if ( Array.isArray(object[key]) ) {
                    if (!merged.hasOwnProperty(key))
                        merged[key] = [];
                    merged[key] = deepAssign(merged[key], object[key]);
                } else 
                    merged[key] = object[key];
            }
        }
    
        return merged;
    };
    
    /**
     * Kiürít egy tömböt. Előfordul, hogy a tömböt nem szeretnénk lecserélni, vagy konstans. 
     * Így nem adhatunk az őt tároló változónak új értéket egy üres tömbbel. Ekkor szükség az ürítés
     * 
     * @param {array} array 
     * @returns {array} A kiürített tömb
     */
    
    const emptyArray = (array) => {
        array.splice(0, array.length);
        return array;
    }
    
    const createElement = (o) => {
    
        o = Object.assign({
            tagName: 'div',
            className: '',
            id: '',
            innerHTML: '',
            style: {}
        }, o);
    
        const el = document.createElement(o.tagName);
        
        if (o.className)
            el.className = o.className;
    
        if (o.id)
            el.id = o.id;
    
        if (o.innerHTML)
            el.innerHTML = o.innerHTML;
    
        if (o.innerText)
            el.innerText = o.innerText;
    
        if (o.textContent)
            el.textContent = o.textContent;

        if (o.style){
            Object.assign(el.style, o.style);
        }
        
        if (o.dataset)
            Object.assign(el.dataset, o.dataset);
    
        Object.assign(el.style, o.style);
    
        if (o.parentElement){
            let pElement = getElement(o.parentElement);
            if (pElement)
                pElement.appendChild(el);
        }
    
        return el;
    }
    
    const getElement = (selectorOrElement) => {
    
        if (!selectorOrElement)
            return null;
    
        let el = null;
    
        if (typeof selectorOrElement === 'string')
            el = document.querySelector(selectorOrElement);
        else if (typeof selectorOrElement === 'object' && selectorOrElement instanceof HTMLElement)
            el = selectorOrElement;
    
        return el;
    }
    
    function removeAllChild(element, onlyHTML = false){
        const el = getElement(element);
    
        if (el){
            const childType = onlyHTML ? 'firstElementChild' : 'firstChild';
            while (el[childType]){
                el[childType].remove();
            }
        }
    }

    /**
     * Megtisztítja a fölösleges kulcsoktól az objectet. Használható például osztályok helyes inicializálására
     * @param {object} obj Az object, amiből törölni szeretnénk a megadott kulcsokat
     * @param  {...string} props paraméterlista, mely tartalmazza a megtartható kucslcsokat
     * @returns {object} visszatér a tisztított objecttel
     */
    const remainProps = (obj, ...props) => {
        
        for (const key in obj)
            if (!props.includes(key))
                delete obj[key];

        return obj;
    }
    
    const isObject = o => o instanceof Object && o.constructor === Object;

    /**
     * Egy szabályos HTML attributumot camelCase stílusuvá alakít.
     * @param {string} attrName 
     * @returns {string}
     */
    const camelCaseAttrName = (attrName) => {
        return attrName
            .toLowerCase()
            .replace(/[^\w\s\-]/g, '')
            .replace(/[\s\-_]+[a-z]/g, hit => hit[hit.length-1].toUpperCase());
    }
    
    /**
     * Egy templétből csinál DOM elemet.
     * 
     * @param {string} str 
     * @returns {HTMLElement}
     */
    const evalTamplate = (str) => {
        const div = document.createElement('div');
        div.innerHTML = str;
    
        return div.firstElementChild;
    }

    /**
     * Egy object-be visszaadja azokat az elemeket, amelyek data-eval paraméterrel vannak ellátva.
     * A data-eval pedig a DOM element kulcsa lesz. Ez az ttribútum törlődik majd.
     * @param {string} templateStr 
     */
    const templateEvalToDOMList = (templateStr) => {
        const div = document.createElement('div');
        div.innerHTML = templateStr;

        const domEvalMap = {};

        div.querySelectorAll('[data-eval]').forEach( el => {
            domEvalMap[camelCaseAttrName(el.dataset.eval)] = el;
            delete el.dataset.eval;
        });

        return domEvalMap;
    }
    
    /**
     * A window objectbe beállít egy értéket, amennyiben nincs érték, úgy visszaadja az értéket.
     * tehát setter/getter függvényként használható
     * @param {string} key 
     * @param {any} val 
     * @returns 
     */
    const global = (key, val="/*null*/") => {
        if (val != "/*null*/")
            window[key] = val;

        return window[key];
    }

    Object.defineProperties(global, {
        GLOBAL: {
            value: {},
            writable: true
        },
        define: {
            value: function(key, val){
                this.GLOBAL[key] = val;
            }
        },

        val: {
            value: function(key){
                return this.GLOBAL[key];
            }
        },

        remove: {
            value: function(key){
                delete this.GLOBAL[key];
            }
        }
    });

    global('global', global);

    const deleteFromArray = (array, item) => {
        const deletIndex = array.findIndex(
            typeof item == 'function' ? item : el => el == item
        );
        if (deletIndex > -1)
            return array.splice(deletIndex, 1)[0];

        return null;
    }

    const timeStringToMS = (timeString) => {
        if (/^\d\d(:\d\d){1,2}/.test(timeString)){
            return new Date(`1970-01-01 ${timeString}`).getTime();
        }
        
        return 0;
    }
    
    return {
        randomize, createElement, getElement, removeAllChild, 
        shuffleArray, emptyArray, deepAssign, capitalize, isObject,
        loadJSON, evalTamplate, global, require, requireCSS, camelCaseAttrName,
        templateEvalToDOMList, remainProps, deleteFromArray, timeStringToMS
    }

})();
