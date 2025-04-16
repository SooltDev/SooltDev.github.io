/*
const module = (function ()) {
    //Inicializáló kód
    //Rejtett változók és függvények
    //Visszatérés egy objektummal
    return {
        //Publikus interfész
    };
})();
*/

const textBox = (function(){
    
    const template = `
        <div class="text-box">
            <h2></h2>
            <h4></h4>
            <p></p>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = template;

    const textBoxElement = div.firstElementChild;

    let iDIndex = 1;

    function getElement(selectorOrElement){
        let element = null;

        if (typeof selectorOrElement == "string" )
            element = document.querySelector(selectorOrElement);
        else if (typeof selectorOrElement == "object" && selectorOrElement instanceof HTMLElement)
            element = selectorOrElement;

        return element;
    }

    const create = (option) => {
        const element = textBoxElement.cloneNode(true);
        element.id = `textbox-${iDIndex++}`;

        const titleElement = element.querySelector("h2");
        const subtitleElement = element.querySelector("h4");
        const textElement = element.querySelector("p");

        titleElement.textContent = option.title;
        subtitleElement.textContent = option.subtitle;
        textElement.textContent = option.text;

        const parentElement = getElement(option.renderTo);

        if (parentElement)
            parentElement.appendChild(element);

        return element;
    }

    const remove = (id) => {

    }

    return {
        create, remove
    }

})();
