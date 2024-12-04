
/*
    Kedvenc időtöltésed
*/

const data = [
    {
        text: "Kerékpározás",
        value: "1",
        selected: false
    },
    {
        text: "Túrázás",
        value: "2",
        selected: true
    },
    {
        text: "Asztali tenisz",
        value: "3",
        selected: false
    },
    {
        text: "Úszás",
        value: "4",
        selected: false
    },
    {
        text: "Lovaglás",
        value: "5",
        selected: true
    },
    {
        text: "Olvasás",
        value: "6",
        selected: true
    },
    {
        text: "Zenehhalgatás",
        value: "7",
        selected: false
    },
];


function renderSelect(data, selector, multiselect = true){
    const parent = document.querySelector(selector);

    const ul = document.createElement('ul');
    ul.classList.add('my-select');

    for (const element of data){
        
        const li = document.createElement('li');
        
        li.dataset.value = element.value;
        li.textContent = element.text;

        if (element.selected)
            li.className = 'selected';

        li.addEventListener('click', function(){
            if (multiselect){
                li.classList.toggle('selected');
            } else {
                const selectedLi = ul.querySelector('li.selected');

                if (selectedLi)
                    selectedLi.classList.remove('selected');

                this.classList.add('selected');
            }
        });

        ul.appendChild(li);
    }

    parent.appendChild(ul);

    return ul;
}

function getValue(select){
    const values = [];

    select.querySelectorAll('.selected').forEach( li => values.push(li.dataset.value) );

    return values;
}

const s1 = renderSelect(data, '#content', true);


