
const SElement = {
    create(o){
        o = Object.assign({
            tagName: "div"
        }, o);

        const element = document.createElement(o.tagName);

        if (o.cssName)
            element.className = o.cssName;

        if (o.content)
            element.innerHTML = o.content;

        if (o.parentElement)
            o.parentElement.appendChild(element);
        
        return element;
    },

    evalHTMLString(str){
        return SElement.create({
            tagName: "div",
            content: str
        }).firstElementChild;
    }
}

class BasicGrid{
    order = {
        asc: "▲", //novekvo
        desc: "▼" //csokkeno
    }

    parentElement;
    element; //gridElement
    headers;
    renderTo;
    data;
    titleElement;
    bodyElement;

    constructor(o){
        Object.assign(this, {
            
        }, o);

        this.build();
        this.render();
    }

    build(){
        this.parentElement = document.querySelector(this.renderTo);
        this.element = SElement.create({cssName: "basic-grid"});
        this.parentElement.appendChild(this.element);
        this.titleElement = SElement.create({cssName: "basic-grid-title", content: this.title});
        this.element.appendChild(this.titleElement);
    }

    renderHeader(){

        const headerElement = this.element.querySelector('.grid-head');
        if (headerElement)
            headerElement.remove();

        const row = SElement.create({cssName: "grid-row grid-head"});
        this.titleElement.insertAdjacentElement('afterend', row);
        
        //return;
        for (const head of this.headers){
            const cell = SElement.create({cssName: "grid-cell", content: head.text});
            cell.style.width = head.width ? head.width : "100%";
    
            if (head.sortable){
    
                let sortElement = head.order ?
                SElement.create({tagName: "span", cssName: "grid-sort " + head.order, content: this.order[head.order]}) :
                SElement.create({tagName: "span", cssName: "grid-sort ", content: "♦"});
    
                cell.appendChild(sortElement);
    
                sortElement.addEventListener('click', () => {
                    let order = sortElement.classList.contains("asc") ? "desc" : "asc";
                    //reset header
                    this.headers.forEach(h => h.order = undefined);
    
                    //set order in header
                    head.order = order;
                    this.data = this.data.sort( (el, nextEl) => {
                        let element, nextElement
                        if (order == "asc"){
                            element = el[head.key];
                            nextElement = nextEl[head.key];
                        }else{
                            element = nextEl[head.key];
                            nextElement = el[head.key];
                        }
    
                        return typeof element == "string" ? element.localeCompare(nextElement) : element - nextElement;
                    });

                    this.render();
                })
            }
    
            row.appendChild(cell);
        }
    }

    renderRows(){
        
        if (!this.bodyElement)
            this.bodyElement = SElement.create({cssName: 'grid-body', parentElement: this.element});
        else this.bodyElement.innerHTML = '';

        for (const element of this.data){

            const row = SElement.create({cssName: "grid-row"});
            this.bodyElement.appendChild(row);
    
            row.addEventListener('click', () => {
                let addOrRemove = row.classList.contains("selected-row") ? "remove" : "add";
                this.bodyElement.querySelectorAll(".selected-row").forEach(r => r.classList.remove("selected-row"));
                
                row.classList[addOrRemove]("selected-row");
            });
    
            for (const head of this.headers){
                const cell = SElement.create({cssName: "grid-cell", content: element[head.key]} );
                cell.style.width = head.width ? head.width : "100%";
                row.appendChild(cell);
            }
        }
    }

    render(){
        this.renderHeader();
        this.renderRows();
    }

    sortByKey(key = "id", order = "asc"){ // order = asc/desc

    }
/*
    set title(text){
        this.titleElement.innerHTML = text;
    }

    get title(){
        return this.titleElement.innerText;
    }

    set header(h){

    }

    get header(){
        return this.headers;
    }
*/
}