
const BasicGrid = (function () {

    const { createElement, getElement, evalTamplate, isObject, templateEvalToDOMList } = STools;

    //#region options
    /**
     * Constant Options
     */
    const actionsColWidth = "15%";
    const actionBtnClass = (action) => `basic-grid-action-${action}`;
    const editBtnClass = actionBtnClass('edit');
    const deleteBtnClass = actionBtnClass('delete');
    const saveBtnClass = actionBtnClass('save');

    //#endregion

    const actionTemplates = {
        edit: `
            <span class="${editBtnClass} grid-action-btn">
                <a href="#">&#9998;</a>
            </span>`,
        del: `
            <span class="${deleteBtnClass} grid-action-btn">
                <a href="#">&#10060;</a>
            </span>`,
        save: `
            <span class="${saveBtnClass} grid-action-btn inactive">
                <a href="#">&#128190;</a>
            </span>`,
    };

    const headerTemplate = `
        <div class="grid-header">
            <div class="grid-title"></div>
            <div class="grid-search-ct">
                <input type="text" class="grid-search" placeholder="Helyi keresés">
            </div>
        </div>
    `;

    const paginationTemplate = `
        <div class="grid-row grid-pagination" data-eval="pagination-element">
            <div class="grid-cell grid-pagination-controll" data-eval="pagination-controll-element">
                <div class="grid-pagination-btn grid-firstpage" data-eval="firstpage-btn">&#9198;</div>
                <div class="grid-pagination-btn grid-prevpage" data-eval="prevpage-btn">&#9204;</div>
                <div class="grid-active-page" data-eval="active-page-element">page 1 of 1</div>
                <div class="grid-pagination-btn grid-nextpage" data-eval="nextpage-btn">&#9205;</div>
                <div class="grid-pagination-btn grid-lastpage" data-eval="lastpage-btn">&#9197;</div>
                <div class="grid-pagination-info" data-eval="pagination-info-element"></div>
            </div>
        </div>
    `;

    const preTooltip = (function () {

        const toolTipTpl = `
            <div class="pre-tooltip">
                <pre></pre>
            </div>
        `;

        const element = evalTamplate(toolTipTpl);
        const bodyElement = element.firstElementChild;

        Object.assign(element.style, {
            "position": "absolute",
            "display": "none"
        });

        document.body.appendChild(element);

        const show = (event, text) => {
            text = text || event.target.textContent;
            bodyElement.textContent = text;
            element.style.display = "block";
        }

        const hide = () => {
            element.style.display = "none";
        }

        return {
            show, hide
        }

    })();


    return class BasicGrid extends EventManager {
        order = {
            asc: "▲", //novekvo
            desc: "▼" //csokkeno
        }

        parentElement;
        element; //gridElement
        headers;
        renderTo;
        #data;
        titleElement;
        headerElement;//A táblázat fejléce
        topHeaderElement;
        paginationElement;
        activePageElement;
        bodyElement;
        actions;
        idKey = null;
        selectable = true;
        innerEdit = false; //Ha true, a sorokba direkt lehet szerkeszrteni az adatokat.

        pagination = false;
        numberPerPage = 10;
        page = 1;
        pageFirstIndex = 0;
        pageLastIndex = 0;
        totalPage;
        itemFrom;
        itemTo;

        multiselect = false;
        headerCheckbox;

        firstpageBtn;
        lastpageBtn;
        nextpageBtn;
        firstpageBtn;

        searchElement; //input element of locale search

        textFormatToolTip = false;

        constructor(o) {

            super();

            Object.assign(this, {
                actions: []
            }, o);


            this.paginationInit();

            this.build();
            this.render();
        }

        paginationInit() {
            if (this.pagination)
                this.totalPage = Math.ceil(this.data.length / this.numberPerPage);
            else {
                this.totalPage = 1;
                this.numberPerPage = this.data.length;
            }
        }

        build() {
            this.parentElement = getElement(this.renderTo);
            this.element = createElement({ className: "basic-grid" });
            this.parentElement.appendChild(this.element);
            /*
            this.titleElement = createElement({ className: "basic-grid-title", textContent: this.title });
            this.element.appendChild(this.titleElement);
            */
            this.element.insertAdjacentHTML("afterbegin", headerTemplate);
            this.topHeaderElement = this.element.firstElementChild;
            this.titleElement = this.element.querySelector(".grid-title");
            this.titleElement.textContent = this.title || '';

            this.searchElement = this.topHeaderElement.querySelector(".grid-search");

            this.searchElement.addEventListener('keydown', (ev) => {
                const text = this.searchElement.value;
                if (text.length > 3){
                    
                }
            });
        }

        checkAllDisplayed(checked = true) {
            if (this.multiselect) {
                this.bodyElement.querySelectorAll('.grid-cell.grid-checkbox input[type="checkbox"]').forEach(c => {
                    if (checked != c.checked) {
                        c.checked = checked;
                        this.trigger('check', c, this.getRowDataById(c.value));
                    }
                });
            }
        }

        fixHeaderCheckboxCheck() {
            if (this.multiselect) {
                if (this.isAllDisplayedChecked) {
                    this.headerCheckbox.indeterminate = false;
                    this.headerCheckbox.checked = true;
                }
                else if (this.checkedCount > 0) {
                    this.headerCheckbox.checked = false;
                    this.headerCheckbox.indeterminate = true;
                } else {
                    this.headerCheckbox.checked = false;
                    this.headerCheckbox.indeterminate = false;
                }
            }
        }

        check(v, checked = true) {
            const rowData = this.getRowDataById(v);
            
            const row = this.getRowElementByData(rowData);

            if (row) { //lehet, hogy nem azon az oldalon vagyunk, amelyiken l'tszik ez a sor.
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked != checked) {
                    checkbox.checked = checked;
                    this.trigger('check', checkbox, rowData);
                    this.fixHeaderCheckboxCheck();
                }
            }
        }

        uncheck(v) {
            this.check(v, false);
        }

        get isAllDisplayedChecked() {
            return [...this.bodyElement.querySelectorAll('.grid-cell.grid-checkbox input[type="checkbox"]')]
                .every(c => c.checked);
        }

        get checkedCount() {
            let count = 0;
            this.bodyElement.querySelectorAll('.grid-cell.grid-checkbox input[type="checkbox"]').forEach(c => {
                if (c.checked)
                    count++;
            });
            return count;
        }

        //#region renderHeader
        /**
         * A gridhez tartozó fejléc előállítása és renderelése/megjelenítése
         */
        renderHeader() {

            //const headerElement = this.element.querySelector('.grid-head');
            if (this.headerElement)
                this.headerElement.remove();

            const row = createElement({ className: "grid-row grid-head" });
            this.topHeaderElement.insertAdjacentElement('afterend', row);

            this.headerElement = row;
            /**
             * Checkboxok létrehozása, amennyiben a multidelect = true
             */
            if (this.multiselect) {
                const cell = createElement({
                    className: "grid-cell grid-checkbox",
                    innerHTML: '<input type="checkbox">'
                });
                row.appendChild(cell);

                this.headerCheckbox = cell.firstElementChild;
                cell.firstElementChild.addEventListener('click', () => {
                    this.checkAllDisplayed(this.headerCheckbox.checked);
                });
            }

            //return;
            for (const head of this.headers) {
                const cell = createElement({ className: "grid-cell", textContent: head.text });
                cell.style.width = head.width ? head.width : "100%";

                if (head.sortable && head.key) {

                    let sortElement = head.order ?
                        createElement({ tagName: "span", className: "grid-sort " + head.order, textContent: this.order[head.order] }) :
                        createElement({ tagName: "span", className: "grid-sort ", textContent: "♦" });

                    cell.appendChild(sortElement);

                    sortElement.addEventListener('click', () => {
                        let order = sortElement.classList.contains("asc") ? "desc" : "asc";
                        //reset header
                        this.headers.forEach(h => h.order = undefined);

                        //set order in header
                        head.order = order;
                        this.data = this.data.sort((el, nextEl) => {
                            let element, nextElement
                            if (order == "asc") {
                                element = el[head.key];
                                nextElement = nextEl[head.key];
                            } else {
                                element = nextEl[head.key];
                                nextElement = el[head.key];
                            }

                            return typeof element == "string" ? element.localeCompare(nextElement) : element - nextElement;
                        });

                        this.render();
                    })
                }

                row.appendChild(cell);
            }

            if (this.actions.length > 0) {
                const actionCell = createElement({ className: "grid-cell", textContent: "Műveletek" });
                actionCell.style.width = actionsColWidth;
                row.appendChild(actionCell);
            }
        }
        //#endregion

        //#region row select funcs
        selectRow(row) {
            if (row && row instanceof HTMLElement && row.classList.contains('grid-row'))
                row.classList.add('selected-row');
        }

        unselectRow(row) {
            if (row && row instanceof HTMLElement && row.classList.contains('grid-row'))
                row.classList.remove('selected-row');
        }

        toggleSelectRow(row) {
            if (row && row instanceof HTMLElement && row.classList.contains('grid-row'))
                row.classList.toggle('selected-row');
        }

        unselectAllRow() {
            this.bodyElement.querySelectorAll('.selected-row').forEach(row =>
                row.classList.remove('.selected-row')
            );
        }

        get selectedRow() {
            return this.bodyElement.querySelector('.selected-row');
        }
        //#endregion

        /**
         * A rács sorainak előálítása
         */
        //#region renderRows
        renderRows(renderedItems = this.data) {

            if (!this.bodyElement) {
                this.bodyElement = createElement({ className: 'grid-body' });
                this.headerElement.insertAdjacentElement('afterend', this.bodyElement);
            } else {
                this.bodyElement.innerHTML = '';
            }

            /**
             * Sorok létrehozása-renderelése
             */
            for (const rowItem of renderedItems) {
                /**
                 * Checkboxok létrehozása, amennyiben a multidelect = true
                 */
                const row = createElement({
                    className: "grid-row",
                    dataset: { id: this.idKey ? rowItem[this.idKey] : '' }
                });

                if (this.multiselect) {
                    const cell = createElement({
                        className: "grid-cell grid-checkbox",
                        innerHTML: `<input type="checkbox" value="${rowItem[this.idKey]}">`
                    });

                    /**
                     * Annak függvényében állítja be a headerCheckbox-ot, hogy mind, részlegesen,
                     * vagy semmi nincs kijelölve
                     */
                    const checkboxElement = cell.firstElementChild;
                    checkboxElement.addEventListener('click', () => {
                        this.fixHeaderCheckboxCheck();
                        this.trigger('check', checkboxElement, rowItem);
                    });
                    row.appendChild(cell);
                }

                this.bodyElement.appendChild(row);

                /**
                 * Ha a selectable be van állítva, egy css hozzáadásával sorra való klikkeléssel,
                 * kiválaszthatjuk, kijelöljük a sort.
                 */
                if (this.selectable) {
                    row.addEventListener('click', () => {
                        let addOrRemove = row.classList.contains("selected-row") ? "remove" : "add";
                        this.bodyElement.querySelectorAll(".selected-row").forEach(r => r.classList.remove("selected-row"));

                        row.classList[addOrRemove]("selected-row");
                    });
                }
                //#region Oszlopok
                /**
                 * Sorhoz tartozó oszlopok kigenerelása
                 */
                for (const head of this.headers) {
                    const cell = createElement({
                        className: "grid-cell " + (typeof rowItem[head.key] == 'number' ? 'text-right' : ''),
                        style: {
                            width: head.width ? head.width : "100%"
                        },
                        dataset: {
                            key: head.key
                        }
                    });

                    cell.innerHTML =
                        head.render
                            ? head.render(rowItem, cell)
                            : head.key && rowItem[head.key]
                                ? rowItem[head.key]
                                : '';

                    row.appendChild(cell);
                }
                //#endregion
                //#region Műveletek
                /**
                 * Műveletek oszlop hozzáadása, amennyiben az actions tömbbel inicializáltuk a példányt.
                 * pl, edit, delete, save. Ezekben az esetekben hozzáadja a gombot.
                 */
                if (this.actions.length) {

                    const actionCell = createElement({ className: "grid-cell" });
                    actionCell.style.width = actionsColWidth;

                    /**
                     * Eseménygombok létrehozása template string hozzáadásával
                     */
                    for (const action of this.actions) {
                        actionCell.innerHTML += actionTemplates[action.type];
                    }

                    /**
                     * Eseménygombok lekérdezése
                     */
                    const editBtn = actionCell.querySelector(`.${editBtnClass}`);
                    const delBtn = actionCell.querySelector(`.${deleteBtnClass}`);
                    const saveBtn = actionCell.querySelector(`.${saveBtnClass}`);

                    /**
                     * Szerkesztés gomb click eseménykezelése
                     */
                    //#region editBtn click
                    if (editBtn)
                        editBtn.addEventListener('click', (ev) => {
                            const editedRow = this.editedRow;
                            if (editedRow && editedRow == row) {
                                this.#cancelEditing(row);
                                return;
                            }

                            if (editedRow)
                                this.#cancelEditing(editedRow);

                            if (this.innerEdit)
                                this.#editRow(rowItem, row);

                            if (saveBtn)
                                saveBtn.classList.remove('inactive');
                            this.trigger('editrow', rowItem, row);
                            ev.stopPropagation();
                        });
                    //#endregion

                    //#region delBtn click
                    /**
                     * Ttörlés gomb click eseménykezelése
                     */
                    if (delBtn)
                        delBtn.addEventListener('click', async (ev) => {
                            const deletedItem = await this.deleteRowById(rowItem[this.idKey]);
                            if (deletedItem)
                                this.trigger('deleterow', deletedItem);
                            ev.stopPropagation();
                        });
                    //#endregion

                    //#region saveBtn click
                    /**
                     * Mentés gomb gomb click eseménykezelése
                     */
                    if (saveBtn)
                        saveBtn.addEventListener('click', (ev) => {
                            if (!saveBtn.classList.contains('inactive')) {
                                this.#saveRow(rowItem, row);
                                saveBtn.classList.add('inactive');
                                delete row.dataset.editable;
                                this.trigger('saverow', rowItem);
                                ev.stopPropagation();
                            }
                        });
                    //#endregion
                    row.appendChild(actionCell);
                }
                //#endregion
                this.trigger('renderrow', row, rowItem);
            } //END for rows

            this.trigger('renderrows');
            this.fixHeaderCheckboxCheck();
        }//End renderRows
        //#endregion

        //#region renderPagination
        updatePageInfo() {
            this.activePageElement.innerHTML =
                `<span>page <b>${this.page}</b> of <b>${this.totalPage}</b></span>`;
        }

        renderPagination() {
            if (!this.paginationElement) {
                const {
                    paginationElement, firstpageBtn, nextpageBtn, prevpageBtn, lastpageBtn,
                    paginationInfoElement, activePageElement
                } = Object.assign(this, templateEvalToDOMList(paginationTemplate));

                this.element.appendChild(paginationElement);

                firstpageBtn.addEventListener('click', () => {
                    if (!firstpageBtn.classList.contains('inactive')) {
                        this.firstPage();
                        this.trigger('firstpage');
                    }
                });

                prevpageBtn.addEventListener('click', () => {
                    if (!prevpageBtn.classList.contains('inactive')) {
                        this.prevPage();
                        this.trigger('prevpage');
                    }
                });

                nextpageBtn.addEventListener('click', () => {
                    if (!nextpageBtn.classList.contains('inactive')) {
                        this.nextPage();
                        this.trigger('nextpage');
                    }
                });

                lastpageBtn.addEventListener('click', () => {
                    if (!lastpageBtn.classList.contains('inactive')) {
                        this.lastPage();
                        this.trigger('lastpage');
                    }
                });
            }
        }
        //#endregion
        #uncheckHeader() {
            this.headerCheckbox.checked = false;
            this, this.headerCheckbox.indeterminate = false;
        }
        //#region pagination
        nextPage() {
            if (this.data.length > this.pageLastIndex) {
                this.pageFirstIndex = this.pageLastIndex;
                this.pageLastIndex += this.numberPerPage;
                this.page++;
                this.firstpageBtn.classList.remove('inactive');
                this.prevpageBtn.classList.remove('inactive');

                this.updatePageInfo();
                this.renderRows(this.data.slice(this.pageFirstIndex, this.pageLastIndex));

                if (this.page == this.totalPage) {
                    this.nextpageBtn.classList.add('inactive');
                    this.lastpageBtn.classList.add('inactive');
                }
            }
        }

        prevPage() {
            if (this.page > 1) {
                this.page--;
                this.pageFirstIndex = this.pageFirstIndex - this.numberPerPage;
                this.pageLastIndex = this.pageFirstIndex + this.numberPerPage;

                this.updatePageInfo();
                this.renderRows(this.data.slice(this.pageFirstIndex, this.pageLastIndex));

                this.nextpageBtn.classList.remove('inactive');
                this.lastpageBtn.classList.remove('inactive');

                if (this.page == 1) {
                    this.firstpageBtn.classList.add('inactive');
                    this.prevpageBtn.classList.add('inactive');
                }
            }
        }

        firstPage() {
            this.page = 1;
            this.pageFirstIndex = 0;
            this.pageLastIndex = this.pageFirstIndex + this.numberPerPage;
            this.updatePageInfo();
            this.renderRows(this.data.slice(this.pageFirstIndex, this.pageLastIndex));

            this.firstpageBtn.classList.add('inactive');
            this.prevpageBtn.classList.add('inactive');

            if (this.totalPage == 1) {
                this.nextpageBtn.classList.add('inactive');
                this.lastpageBtn.classList.add('inactive');
            } else {
                this.nextpageBtn.classList.remove('inactive');
                this.lastpageBtn.classList.remove('inactive');
            }

        }

        lastPage() {
            if (this.page < this.totalPage) {
                this.page = this.totalPage;
                this.pageFirstIndex = this.data.length - (this.data.length % this.numberPerPage);

                console.log(this.pageFirstIndex);


                if (this.pageFirstIndex == this.data.length)
                    this.pageFirstIndex = this.data.length - this.numberPerPage;

                this.pageLastIndex = this.data.length;

                this.updatePageInfo();
                this.renderRows(this.data.slice(this.pageFirstIndex, this.pageLastIndex));

                this.nextpageBtn.classList.add('inactive');
                this.lastpageBtn.classList.add('inactive');

                this.firstpageBtn.classList.remove('inactive');
                this.prevpageBtn.classList.remove('inactive');
            }

        }

        refreshActivePage() {
            this.renderRows(this.data.slice(this.pageFirstIndex, this.pageLastIndex));
            this.updatePageInfo();
            this.fixHeaderCheckboxCheck();
        }
        //#endregion

        get editableColumns() {
            return this.headers.filter(h => h.editable);
        }

        get editedRow() {
            return this.bodyElement.querySelector('.grid-row[data-editable="true"]');
        }

        #getActionBtn(action) {
            const row = this.editedRow;
            if (row)
                return row.querySelector(`.${actionBtnClass(action)}`);

            return null;
        }

        get saveBtn() {
            return this.#getActionBtn('save');
        }
        get editBtn() {
            return this.#getActionBtn('edit');
        }
        get deleteBtn() {
            return this.#getActionBtn('delete');
        }

        isEditable(row) {
            return row.dataset.editable ? true : false;
        }

        #saveRow(rowItem, rowElement) {
            for (const head of this.editableColumns) {
                const cellElement = rowElement.querySelector(`[data-key="${head.key}"]`);

                if (cellElement) {
                    const inputElement = cellElement.querySelector('input');
                    if (inputElement) {
                        const value = inputElement.value.trim();
                        cellElement.textContent = value;
                        rowItem[head.key] = value;
                    }

                }
            }
        }
        //#region #editRow

        #editRow(rowItem, rowElement) {
            for (const head of this.editableColumns) {
                const cellElement = rowElement.querySelector(`[data-key="${head.key}"]`);
                let input, select;

                if (cellElement) {

                    switch (head.type) {
                        case "text":
                            input = document.createElement("input");
                            input.type = "text";
                            break;
                        case "textarea":
                            input = document.createElement("textarea");
                            break;
                        /*
                        case "select":
                            cellElement.innerHTML = '';
                            select = new BasicSelect({
                                data: head.data,
                                renderTo: cellElement,
                                defaultText: "Kategória",
                                value: 1
                            });
                            break;
                        */
                    }


                    if (head.type == 'text' || head.type == 'textarea') {
                        input.value = rowItem[head.key];

                        input.addEventListener('keydown', (ev) => {
                            if (ev.key == "Enter") {
                                this.saveBtn.click();
                                return;
                            }

                            if (ev.key == "Escape") {
                                this.editBtn.click();
                            }
                        });

                        cellElement.replaceChild(input, cellElement.firstChild);
                    }
                }
            }

            rowElement.dataset.editable = true;
        }
        //#endregion

        //#region #cancelEditing
        #cancelEditing(rowElement) {
            const rowItem = this.getDataByRow(rowElement);

            for (const head of this.editableColumns) {
                const cellElement = rowElement.querySelector(`[data-key="${head.key}"]`);

                if (cellElement) {
                    cellElement.textContent = rowItem[head.key];
                }
            }

            const saveBtn = rowElement.querySelector(`.${actionBtnClass('save')}`);
            if (saveBtn)
                saveBtn.classList.add('inactive');

            delete rowElement.dataset.editable;
        }
        //#endregion

        /**
         * Töröl egy sort és frissíti a sorokat, hogy vizualizáljuk a változást.
         * @param {number} id - a sorhoz tartozó adat id
         * @returns {object} - a törölt sor adatai
         */
        async deleteRowById(id) {
            const delIndex = this.data.findIndex(d => d[this.idKey] == id);

            if (delIndex > -1)
                if (await basicAlert.confirm(`Biztos, hogy törölni akarod ezr a sort?`)) {
                    const deleteItem = this.data.splice(delIndex, 1)[0];
                    this.reloadWithData(this.data);
                    return deleteItem;
                }

            return null;
        }

        getRowDataById(id) {
            return this.data.find(d => d[this.idKey] == id);
        }

        getDataByRow(row) {
            return this.data.find(d => d[this.idKey] == row.dataset.id);
        }

        get selectedId() {
            const selectedRow = this.selectedRow;
            if (selectedRow)
                return this.getDataByRow(selectedRow)[this.idKey];

            return null;
        }

        editRow() {

        }

        getRowElementByData(dataItem) {
            if (this.idKey && dataItem)
                return this.bodyElement.querySelector(`[data-id="${dataItem[this.idKey]}"]`);

            return null;
        }

        //#region render
        render() {
            this.renderHeader();
            if (this.pagination) {
                this.renderPagination();
                this.firstPage();
            } else this.renderRows();
        }
        //#endregion

        refresh() {

        }

        reloadWithData(data) {
            this.data = data;
            if (this.pagination) {
                this.refreshActivePage();
            } else {
                this.renderRows();
            }
        }

        sortByKey(key = "id", order = "asc") { // order = asc/desc

        }

        set data(d) {
            this.#data = d;
            this.paginationInit();
        }

        get data() {
            return this.#data;
        }
    }
})();

