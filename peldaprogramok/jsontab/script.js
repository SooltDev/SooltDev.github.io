
(async function(){

    const tabPaneTpl = `
        <div class="tab-pane">
            <div id="koltok" class="tabs-btn"></div>
            <div id="tartalom" class="tabs-content"></div>
        </div>
    `;

    document.querySelector('#content').innerHTML = tabPaneTpl;

    const template = (kolto) => `
        <div class="tab-page">
            <h2>${kolto.name}</h2>
            <div class="tab-content">
                <div> 
                    <img src="${kolto.img}"></img>
                </div>
                <div> 
                    <p>${kolto.text.join('</p><p>')}</p>
                </div>
            </div>
            <div class="tab-content">
                <h4>A költő egy néhány műve:</h4>
                <ul><li>${kolto.versek.join('</li><li>')}</li></ul>
            </div>
        </div>
    `

    const koltokElement = document.querySelector('#koltok');
    const tartalomElement = document.querySelector('#tartalom');

    const response = await fetch('koltok.json');
    const koltok = await response.json();

    for (const koltoId in koltok){
        const span = document.createElement("span");
        const kolto = koltok[koltoId];

        span.textContent = kolto.name;

        span.addEventListener('click', () => {
            tartalomElement.innerHTML = template(kolto);

            const active = koltokElement.querySelector(".active");
            if (active){
                active.classList.remove("active");
            }
            span.classList.add("active")
        });

        koltokElement.appendChild(span);
    }

})();