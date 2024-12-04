const { loadJSON, requireCSS, require, global } = STools;

global('GLOBAL', {});

(async function(){
    const naviData = await loadJSON('./navi.json');

    /**
     * További CSS fájlok betöltés
     */

    requireCSS('./js/component/basicalert/style.css');
    requireCSS('./js/component/basiclist/style.css');
    requireCSS('./style/cpanel.css');

    /**
     * Komponensek betöltése
     */
    
    await require('./js/navi.mod.js');
    await require('./js/component/eventmanager.cls.js');
    await require('./js/component/basiclist/basiclist.js');
    await require('./js/component/basiclist/basiclistmanager.js');
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

    //basicAlert.show("Légy üdvözölve a példatárban. Jó munkát a feladatok kiosztásához.");

    window.addEventListener('pagehide', function(event) {

    });
    
})();