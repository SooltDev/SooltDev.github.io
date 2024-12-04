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

                listObject.on('singleexpand', () => {
                    this.expandAll(listObject);
                });
            }
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

        saveToStorage(){
            localStorage.setItem(this.groupName, JSON.stringify(this.data));
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

        listExport(filename){
            const link = document.createElement("a");
            const file = new Blob([JSON.stringify(this.data, null, "\t")], { type: 'application/json;charset=utf8' });
            link.href = URL.createObjectURL(file);
            link.download = filename || `${this.groupName}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        listImport(fileInput, domContainer = this.domContainer){
            const fr = new FileReader();

            fr.addEventListener('load', (e) => {
                console.log(e);
                this.clear();
                let lines = e.target.result;
                localStorage.setItem(this.groupName, lines);
                this.loadStorage(domContainer);
            });
            
            fr.readAsText(fileInput);
        }
    }
})();