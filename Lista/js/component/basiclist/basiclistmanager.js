const BasicListManager = (function(){

    const {deleteFromArray, getElement} = STools;

    return class BasicListManager extends EventManager{

        lists = [/*basicList object*/];
        groupName;
        domContainer;
        group; //a nyers adatok

        constructor(group, domContainer){
            super();
            this.groupName = group.name;
            this.domContainer = getElement(domContainer);
            this.group = group;
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
            }
        }

        createItem(title){
            const list = new BasicList({
                title: title,
                renderTo: this.domContainer
            });

            this.addItem(list);

            return list;
        }

        loadStorage(domContainer = this.domContainer){
            const listData = localStorage[this.groupName];
            if (listData && listData != "undefined"){
                JSON.parse(localStorage[this.groupName])['lists'].forEach(item => {
                    this.addItem(
                        new BasicList(Object.assign(item, {
                            renderTo: domContainer
                        }))
                    );
                });
            }
        }

        render(group = this.group, domContainer = this.domContainer){
            this.group = group;
            this.domContainer = domContainer;

            this.group.lists.forEach(item => {
                this.addItem(
                    new BasicList(Object.assign(item, {
                        renderTo: domContainer
                    }))
                );
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