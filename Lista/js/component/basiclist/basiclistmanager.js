const BasicListManager = (function(){

    const {deleteFromArray, getElement} = STools;

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
                 * BasicListManagaer-ből is
                 */
                listObject.on('delete', () => {
                    this.removeItem(listObject);
                });

                listObject.on('singleexpand', () => {
                    this.collapseAll(listObject);
                });

                listObject.on('clone', () => {
                    const item = listObject.data;
                    this.addItem(
                        new BasicList(Object.assign(item, {
                            renderTo: this.domContainer,
                            title: "Másolat - " + item.title
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
         */
        fixIdsIfNotExists(){
            this.group.lists.forEach(item => {
                let id;
                if (item.id && (id = this.indexById(item.id)) > this.idIndex)
                    this.idIndex = id;
            });

            this.group.lists.forEach(item => {
                if (!item.id )
                    item.id = this.#nextId();
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
            this.lists.filter(list => list.isRenewable).forEach(list => {
                console.log(list);
                
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