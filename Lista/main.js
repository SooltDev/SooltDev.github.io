const { loadJSON, requireCSS, require, global } = STools;

global('GLOBAL', {});

(async function(){
    const naviData = await loadJSON('./navi.json');

    /**
     * További CSS fájlok betöltés
     */

    requireCSS('./js/component/basicalert/style.css');
    requireCSS('./js/component/basiclist/style.css');
    requireCSS('./js/component/popupmenu/style.css');
    requireCSS('./js/component/toolbox/style.css');
    requireCSS('./style/cpanel.css');

    /**
     * Komponensek betöltése
     */
    
    await require('./js/navi.mod.js');
    await require('./js/component/eventmanager.cls.js');
    await require('./js/component/popupmenu/popupmenu.js');
    await require('./js/component/toolbox/toolbox.js');
    await require('./js/component/basiclist/basiclist.js');
    await require('./js/component/basiclist/basiclistmanager.js');
    await require('./js/component/basiclist/basiclistgroupmanager.js');
    await require('./js/component/basicalert/basicalert.js');


    /**
     * A menühöz tartozó JS fájlok betöltése
     */
    for (const navItem of naviData)
        if (navItem.app)
            await require(`./js/api/${navItem.name}/${navItem.name}.js`);

    /**
     * Menü létrehozása
     */
    global('navi', new Navi({
        renderTo: "#page .navi",
        contentRenderTo: '#page-content',
        data: naviData
    }));

    global('navi').homepage();

    basicAlert.show(`
        <h3>Figyelem!</h3><br>
        <h4>Havi megújúló lista élesítve!</h4></br>
        <p>Ha véletlenül előző hónapokban bepipáltad valemelyik listádnál ezt a lehetőséget, 
        akkor a rendszer észre fogja venni, hogy van meg nem újított lista, így arról másolatot készít, vagyis megújítja.
        <p>A régit is meghagyja, hogy tudd archiválni, eltenni, ha még szükséged lenne rá. </p>
        <p>Mindig az új lista fogja magát megújítani következő hónapban, nem a régi. Így a régit bátran törölheted, módosíthatod, vagy csinálhatsz vele bármit.</p>
    `);

    window.addEventListener('pagehide', function(event) {

    });
    
})();