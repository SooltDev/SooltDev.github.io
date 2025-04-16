

function renderChessTable(n, parent){
    let parentElement;

    if (parent instanceof HTMLElement)
        parentElement = parent;
    else if (typeof parent == 'string')
        parentElement = document.querySelector(parent);

    if (!parentElement)
        return false;

    const table = document.createElement('div');
    table.className = 'table';

    { // Fejléc generálás az ABC betűivel
        const row = document.createElement('div');
        row.className = 'row';

        const spaceElement = document.createElement('div');
        spaceElement.className = 'space';
        spaceElement.textContent = ' ';

        row.appendChild(spaceElement);

        const aCharCode = 'A'.charCodeAt(0);

        for (let cols = 0; cols < n; cols++){
            const charElement = document.createElement('div');
            charElement.className = 'char';
            charElement.textContent = String.fromCharCode(aCharCode + cols);

            row.appendChild(charElement);
        }

        table.appendChild(row);
    }

    for (let rows = 0; rows < n; rows++ ){
        const row = document.createElement('div');
        row.className = 'row';

        const numberElement = document.createElement('div');
        numberElement.className = 'num';
        numberElement.textContent = n - rows;

        row.appendChild(numberElement);

        for (let cols = 0; cols < n; cols++){
            const cell = document.createElement('div');
            cell.className = (rows + cols) % 2 == 0 ? 'white' : 'dark';
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    parentElement.appendChild(table);

}

renderChessTable(8, '#content');