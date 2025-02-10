
var help = (function(){
    const {global} = STools;
    const LOCAL = {
        editedId: null
    };

    let modulName = "Help";

    let template = `
        <h2>Egy kis segítség a Lista használatáhzo.</h2>
        <div>
            <h4>Listaelem típusok, gyorsfukciók</h4><br>
            Lehetőség van a listaelemek viselkedésének a befolyásolására, Annak stílusának megváltoztatására, 
            ezáltal kategorizálására aszerint, hogy egy adott teendő, fontos, kcsak opcionális, vagy éppen folyamatban levő ügy.
            Továbbá arra is lehetőség van, hogy egy listaelemnek aznapra figyelmeztető időt állíthassunk be, pl, ha mennünk kell valahova,
            lehetőségünk van egy időpontot beállítani, hogy figyelmeztessen, hogy el ne késsünk.
            Ezen típusok beállítására csupán a megfelelő karakterekkel kell kezdődnie a listaelemnek, 
            amelyet menetküzben is lehet módosítani, a listaelem meletti ceruzaikonra kattintva. <br>

            <h4>Az alábbi lehetőségek állnak rendelkezésre.</h4><br>
            <p>A világos négyzetben láthatjuk, ahogyan a listaelemnek kezdődnie kell</p>
            <div class="list list-body">
                <ul>
                    <li class="list-item-progress">
                        <span class="list-item-text"><code>-></code>&nbsp;- Folyamatban levő ügy</span>
                    </li>
                    <li class="list-item-serious">
                        <span class="list-item-text"><code>! </code>&nbsp;- Fontos </span>
                    </li>
                    <li class="list-item-optional">
                        <span class="list-item-text"><code>? </code>&nbsp;- Kevésbé fontos, vagy opcionális </span>
                    </li>
                    <li class="">
                        <span class="list-item-text"><code>15:30</code>&nbsp;- Figyelmeztet ebben az időpontban, egy felugró ablakkal. Hangjelzéssel is fog, ennek fejlesztése folyamatban.</span>
                    </li>
                </ul>
            </div>
        </div>
    `;

    let destructing = true;


    const render = async (renderTo) => {

        destructing = false;
        LOCAL.renderTo = renderTo;

        renderTo.innerHTML = template;

    }

    const destruct = () => {
        console.log(`Destructing module ${modulName}`);
        LOCAL.renderTo.innerHTML = '';
        destructing = true;
    }

    return {
        renderTo: function(options){
            console.log(`run module ${modulName} render`);
            Object.assign(LOCAL, options);
            render(options.renderTo);
        },
        destruct
    }
})();
