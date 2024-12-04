const TextBox = ( function(){

    const template = `
        <div class="text-box">
            <h2></h2>
            <h4></h4>
            <p></p>
        </div>
    `;

    const box = document.createElement('div');
    box.innerHTML = template;

    return class TextBox{

        element;

        parentElement;
        
        titleElement;
        subtitleELement;
        textElement;

        constructor(options){
            let parent = options.renderTo;
            
            if (typeof parent == "string")
                this.parentElement = document.querySelector(parent);
            else if (typeof parent == "object" && parent instanceof HTMLElement)
                this.parentElement = parent;

            this.element = box.firstElementChild.cloneNode(true);

            this.titleElement = this.element.querySelector("h2");
            this.subtitleELement = this.element.querySelector("h4");
            this.textElement = this.element.querySelector("p");

            this.title = options.title;
            this.subtitle = options.subtitle;
            this.text = options.text;

            this.parentElement.appendChild(this.element);
        }

        set title(text){
            this.titleElement.textContent = text;
        }

        get title(){
            return this.titleElement.textContent;
        }

        set subtitle(text){
            this.subtitleELement.textContent = text;
        }

        get subtitle(){
            return this.subtitleELement.textContent;
        }

        set text(text){
            this.textElement.textContent = text;
        }

        get text(){
            return this.textElement.textContent;
        }

    };

} )();