const BasicListManager = (function(){

    const {deleteFromArray, getElement} = STools;

    const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"]

    return class BasicListManager extends EventManager{

        lists = [/*basicList object*/];
        groupName;
        domContainer;
        group; //a nyers adatok
        idIndex = 0;

        constructor(group, domContainer){
            super();
            this.groupName = group.name;
            this.domContainer = getElement(domContainer);
            this.group = group;

            console.log(this.group);
            
        }

        /**
         * Új lista hozzáadása
         * @param {object} listObject 
         */
        addItem(listObject){
            if (listObject instanceof BasicList){

                this.lists.push(listObject);
                /**
                 * Ha a listát töröljük, akkor automatikusan törlődjön az őt tartalmazó 
                 * BasicListManagaer-ből is, vagyis innen :)
                 */
                listObject.on('delete', () => {
                    this.removeItem(listObject);
                });

                listObject.on('singleexpand', () => {
                    this.collapseAll(listObject);
                });

                listObject.on('clone', () => {
                    const item = listObject.data;
                    item.timestamp = Date.now();
                    this.addItem(
                        new BasicList(Object.assign(item, {
                            renderTo: this.domContainer,
                            title: "Másolat - " + item.title,
                            id: this.#nextId()
                        }))
                    );
                });
    
            }
        }

        createItem(title){
            const list = new BasicList({
                title: title,
                id: this.#nextId(),
                renderTo: this.domContainer
            });

            this.addItem(list);

            return list;
        }

        /**
         * Előállítja a hiányzó ID kulcsokat. 
         * Régi listákból eredő bugot javít, tehát, ha előző verziót importálunk a továbbfejlesztett verzióba
         * Egy idő után már fölöslegessé válhat.
         */
        fixIdsIfNotExists(){

            //Az idIndexet a legnagyobb meglévő ID-ra állítja
            this.group.lists.forEach(item => {
                let id;
                if (item.id && (id = this.indexById(item.id)) > this.idIndex)
                    this.idIndex = id;
            });

            this.group.lists.forEach(item => {
                if (!item.id )
                    item.id = this.#nextId();
                // fix duplicated ID
                else 
                    this.group.lists.filter( el => el != item && item.id == el.id)
                        .forEach( el => el.id = this.#nextId());
                
            });
        }

        #nextId(){
            return `${this.group.as}-${++this.idIndex}`;
        }

        indexById(idstring){
            return Number(idstring.match(/[0-9]+/g)[0]);
        }

        render(group = this.group, domContainer = this.domContainer){
            this.group = group;
            this.domContainer = domContainer;

            this.fixIdsIfNotExists();

            this.group.lists.forEach(item => {

                const list = new BasicList(Object.assign(item, {
                    renderTo: domContainer,
                    group: this
                }));

                this.addItem(list);
            });

            this.renewCheck();
        }

        renewCheck(){
            const now = new Date();
            this.lists.filter(list => list.isRenewable && !list.archive && !list.renewabled).forEach(listObject => {
                console.log(listObject);
                //*
                const item = listObject.data;

                delete item.dayly;
                delete item.monthly;
                delete item.weekly;
                delete item.id;

                item.items.forEach(el => delete el.done);

                const newList = new BasicList(Object.assign(item, {
                    renderTo: this.domContainer,
                    title: now.getFullYear() + " " + months[now.getMonth()] + " - " + item.title,
                    id: this.#nextId(),
                    timestamp: Date.now(),
                }));

                listObject.renewabledate = Date.now();

                const renewType = listObject.renewableType;

                //*// A másolat vigye tovább a megújulást, és a régi ne újuljon meg, hogy azt lehessen archiválni, törölni... stb.
                newList.renewabledate = Date.now();
                listObject.removeData("renewabledate");
                newList[renewType] = listObject[renewType];
                listObject[renewType] = null;
                //*/

                this.addItem(newList);
                //*/
            });
        }

        archiveView(display = true){
            this.lists.forEach(listItem => {
                if (listItem.archive == display){
                    listItem.addDOM();
                } else {
                    listItem.removeDOM();
                }

            });
        }

        collapseAll(unique){            
            this.lists
                .filter(list => list != unique)
                .forEach(list => list.collapse());
        }

        expandAll(unique){
            this.lists
                .filter(list => list != unique)
                .forEach(list => list.expand());
        }

        removeItem(listObject){
            return deleteFromArray(this.lists, listObject);
        }

        clear(){
            while (this.lists.length)
                this.lists[0].remove();
        }

        get jsonStr(){
            return JSON.stringify(this.data);
        }

        get data(){
            const dataStruct = {
                name: this.groupName,
                lists: []
            };

            this.lists.forEach(item => {
                dataStruct.lists.push(
                    item.data
                );
            });

            return dataStruct;
        }

    }
})();