const { loadJSON, requireCSS, require, global } = STools;

global('GLOBAL', {});

(async function(){
    const naviData = await loadJSON('/navi.json');

    /**
     * További CSS fájlok betöltés
     */

    requireCSS('/js/component/basicgrid/style.css');
    requireCSS('/js/component/basicselect/style.css');
    requireCSS('/js/component/basiclabels/style.css');
    requireCSS('/js/component/basiclabels/style.css');
    requireCSS('/js/component/basicalert/style.css');

    /**
     * Komponensek betöltése
     */
    
    await require('/js/navi.mod.js');
    await require('/js/component/eventmanager.cls.js');
    require('/js/component/basicalert/basicalert.js');
    require('/js/component/basiclabels/basiclabels.cls.js');
    require('/js/component/basicgrid/basicgrid.cls.js');
    require('/js/component/basicselect/basicselect.cls.js');

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

    basicAlert.show("Légy üdvözölve a példatárban. Jó munkát a feladatok kiosztásához.");
    
})();