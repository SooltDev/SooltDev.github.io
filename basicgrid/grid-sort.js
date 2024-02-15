function createElementWithCSS(tagName, cssName, content){
    const element = document.createElement(tagName);
    element.className = cssName;

    if (content)
        element.innerHTML = content;
    //element.classList.add(cssName);
    return element;
}

function renderGrid(data, headers, renderTo, titletext = "Basic Grid"){
    const grid = createElementWithCSS("div", "basic-grid");
    let row, cell;
    const order = {
        asc: "▲", //novekvo
        desc: "▼" //csokkeno
    }

    document.querySelector(renderTo).innerHTML = "";

    const title = createElementWithCSS("div", "basic-grid-title", titletext);
    grid.appendChild(title);

    /*
        keszitsuk el a tablazat fejlecet.
        - iteraljunk vegig a fejlecen, 
            - hozzunk letre egy tablazat sort annyi cellaval, ahany fejlec elem van
            - majd ezt a sort adjuk hozza a gridhez.
    */

    row = createElementWithCSS("div", "grid-row grid-head");
    grid.appendChild(row);

    for (const head of headers){
        cell = createElementWithCSS("div", "grid-cell", head.text);
        cell.style.width = head.width ? head.width : "100%";

        if (head.sortable){

            let sortElement = head.order ?
                createElementWithCSS("span", "grid-sort " + head.order, order[head.order]) :
                createElementWithCSS("span", "grid-sort ", "♦");

            cell.appendChild(sortElement);

            sortElement.onclick = function(){
                let order = this.classList.contains("asc") ? "desc" : "asc";
                //reset header
                headers.forEach(h => h.order = undefined);

                //set order in header
                head.order = order;
                const sortabledData = data.sort( (el, nextEl) => {
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

                renderGrid(sortabledData, headers, renderTo, titletext);
            }
        }

        row.appendChild(cell);
    }

    for (const element of data){

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
        
    document.querySelector(renderTo).appendChild(grid);
}

renderGrid(
    USERS, 
    [
        {key: "id", text: "ID", width: "20%", sortable: true}, 
        {key: "username", text: "Felhasználónév", sortable: true},
        {key: "lastName", text: "Családnév"},
        {key: "firstName", text: "Keresztnév", sortable: true},
        {key: "email", text: "Email"},
        {key: "status", text: "Status", width: "50%", sortable: true, }
    ], 
    "#grid-container",
    "Felhasználók"
);
