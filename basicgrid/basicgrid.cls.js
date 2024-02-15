
const SElement = {
    create(o){
        Object.assign(this, {
            tagName: "div"
        }, o);

        const element = document.createElement(tagName);
        if (o.cssName)
            element.className = cssName;

        if (o.content)
            element.innerHTML = content;
        
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

    constructor(o){
        Object.assign(this, {
            
        }, o);

        this.build();
        this.render();
    }

    build(){
        this.parentElement = document.querySelector(this.renderTo);
        this.grid = SElement.create({cssName: "basic-grid"});
        this.parentElement.appendChild(this.grid);
        this.title = SElement.create("div", "basic-grid-title", titletext);
        this.grid.appendChild(this.title);
    }

    renderHeader(){
        let cell;
        const row = SElement.create({cssName: "grid-row grid-head"});
        this.grid.appendChild(row);

        const _this = this;

        for (const head of this.headers){
            cell = SElement.create({cssName: "grid-cell", content: head.text});
            cell.style.width = head.width ? head.width : "100%";
    
            if (head.sortable){
    
                let sortElement = head.order ?
                SElement.create({tagName: "span", cssName: "grid-sort " + head.order, content: order[head.order]}) :
                SElement.create({tagName: "span", cssName: "grid-sort ", content: "♦"});
    
                cell.appendChild(sortElement);
    
                sortElement.onclick = function(){
                    let order = this.classList.contains("asc") ? "desc" : "asc";
                    //reset header
                    _this.headers.forEach(h => h.order = undefined);
    
                    //set order in header
                    head.order = order;
                    _this.data = _this.data.sort( (el, nextEl) => {
                        let element, nextElement
                        if (order == "asc"){
                            element = el[head.key];
                            nextElement = nextEl[head.key];
                        }else{
                            element = nextEl[head.key];
                            nextElement = el[head.key];
                        }
    
                        if (element > nextElement)
                            return 1;
                        if (element == nextElement)
                            return 0;
                        
                        return -1;
                    });
    
                    _this.render();
                }
            }
    
            row.appendChild(cell);
        }
    }

    render(){
        let row, cell;

        for (const element of this.data){

            row = createElementWithCSS("div", "grid-row");
            grid.appendChild(row);
    
            row.onclick = function(){
                let addOrRemove = this.classList.contains("selected-row") ? "remove" : "add";
                grid.querySelectorAll(".selected-row").forEach(r => r.classList.remove("selected-row"));
                
                this.classList[addOrRemove]("selected-row");
            }
    
            for (const head of headers){
                cell = createElementWithCSS("div", "grid-cell", element[head.key]);
                cell.style.width = head.width ? head.width : "100%";
                row.appendChild(cell);
            }
        }
    }

    sortByKey(key = "id", order = "asc"){ // order = asc/desc

    }

    set title(text){
        this.title.innerHTML = text;
    }

    get title(){
        return this.title.innerText;
    }

    set header(h){

    }

    get header(){
        return this.headers;
    }

}