const BasicListManager = (function(){

    const {deleteFromArray, getElement} = STools;

    return class BasicListManager extends EventManager{

        lists = [];
        groupName;
        domContainer;

        constructor(name, domContainer){
            super();
            this.groupName = name;
            this.domContainer = getElement(domContainer);
        }

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
            }
        }

        removeItem(listObject){
            return deleteFromArray(this.lists, listObject);
        }

        saveToStorage(){
            localStorage.setItem(this.groupName, JSON.stringify(this.data));
        }

        loadStorage(domContainer){
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

        listExport(){

        }

        listImport(){

        }
    }
})();