class Szoforgato{

    static tpl = `
        <div class="szoforgato">
            <div class="kijelzo">
                <div class="kijelzo-inner">Szerencsekerék</div>
            </div>
            <div class="szoforgato-innerct"></div>
            <div class="betuk-ct"></div>
        </div>
    `;
    static massalhangzok = ["Q", "W", "R", "T", "Y", "P", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
    static maganhangzok = ["A", "Á", "E", "É", "I", "Í", "O", "Ó", "Ö", "Ő", "U", "Ú", "Ü", "Ű"];

    constructor(o){
        this.siseX = o.sizeX || 15;
        this.siseY = o.sizeY || 4;

        this.betutValaszt = o.betutValaszt || function(){};

        const div = document.createElement('div');
        div.innerHTML = Szoforgato.tpl;

        this.ct = div.firstElementChild;
        this.parentElement = document.querySelector(o.parentElement);

        this.parentElement.appendChild(this.ct);

        this.inenrCt = this.#getElement(".szoforgato-innerct");
        this.betukCt = this.#getElement(".betuk-ct");

        this.betuValasztas = false;

        this.render();
        this.betuRender();
    }

    #getElement(sel){
        return this.ct.querySelector(sel); 
    }

    uzenet(szoveg){
        this.#getElement(".kijelzo-inner").innerHTML = szoveg;
    }

    vanMegBetu(betuFajta = "massalhangzok"){
        for (const letterInfo of this.letterInfo){
            if (Szoforgato[betuFajta].includes(letterInfo.letter) && !letterInfo.visibled)
                return true;
        }

        return false;
    }

    megfejtve(){
        for (const letterInfo of this.letterInfo)
            if (!letterInfo.visibled)
                return false;

        return true;
    }

    betuRender(betuFajta = "massalhangzok"){

        const BETUK = Szoforgato[betuFajta];

        let rows = Math.ceil(BETUK.length / this.siseX);
        let HTMLString = '', row = '', letter = '';
        const _this = this;
        
        for (let y = 0; y < rows; y++){
            row = `<div class="szorow">`;
            for (let x = 0; x < this.siseX; x++){
                letter = BETUK[y * this.siseX + x] || "";
                row += `
                    <div class="szobox ${letter ? "letter" : ""}" data-letter="${letter}" >
                        <span>${letter}</span>
                    </div>
                `
            }
            row += "</div>";
            HTMLString += row;
        }

        this.betukCt.innerHTML = HTMLString;

        this.betukCt.querySelectorAll(".szobox.letter").forEach( box => {
            box.onclick = function(){
                if (_this.betuValasztas){
                    if ( !this.classList.contains("felhasznalt") ){

                        let letterInfo = _this.letterInfo.filter(l => l.letter == box.dataset.letter);
                        this.classList.add("felhasznalt");
                        
                        // Talakt betuk felforditasa

                        let letterTime = 100;

                        letterInfo.forEach( l => {

                            let lBox = _this.#getElement(l.boxId);
                            
                            setTimeout(function(){
                                lBox.classList.add("highlight");
                            }, letterTime);

                            letterTime += 1000;

                            setTimeout(function(){
                                lBox.classList.remove("highlight");
                                lBox.firstElementChild.innerHTML = l.letter;
                                l.visibled = true;

                                if (betuFajta == "massalhangzok" && !_this.vanMegBetu("massalhangzok")){
                                    _this.uzenet("Elfogyott az összes mássalhangzó! Válasszon magánhangzót!");
                                    _this.betuRender("maganhangzok");
                                }

                                if (_this.megfejtve())
                                    _this.uzenet("Gratulálunk, ön NYERT!");

                            }, letterTime + (letterInfo.length - 0.5) * 1000);

                        }); // talalt betuk felforditasanak vege

                        if (letterInfo.length > 0)
                            _this.uzenet(`${letterInfo.length} db. <b>${box.dataset.letter}</b> betű van a megfejtésben!`);
                        else 
                            _this.uzenet(`Sajnos <b>"${box.dataset.letter}"</b> betű nincs a megfejtésben!`);

                        _this.betutValaszt();

                    }//end if a betu meg nem vol felhasznalva
                }//end if betuValasztas
            }//end betuclick
        });//end betuk foreach
    }//end massalhangzoRender

    set betuValasztas(b){
        this.betuvalaszto = b ? true : false;
        if (!this.betuvalaszto)
            this.betukCt.querySelectorAll(".szobox.letter").forEach( l => {
                l.classList.add("inactive");
            });
        else 
            this.betukCt.querySelectorAll(".szobox.letter").forEach( l => {
                l.classList.remove("inactive");
            });

    }

    get betuValasztas(){
        return this.betuvalaszto;
    }

    reset(){

    }

    #getSzoBoxByPos(row, col){
        return this.inenrCt.querySelector(`#l-${row}-${col}`);
    }

    /**
     * @param {any} s
     */
    set rejtveny(s){
        
        this.szoveg = s.toUpperCase();
        this.letterInfo = [];
        let lines = this.szoveg.split("\n");
        let startColIndex = 0, startRowIndex = Math.round((this.siseY - lines.length)/2);

        for (let i = 0; i < lines.length; i++){

            startColIndex = Math.round((this.siseX - lines[i].length) / 2);

            for (let charsInd = 0; charsInd < lines[i].length; charsInd++){

                let szobox = this.#getSzoBoxByPos(i + startRowIndex, charsInd + startColIndex);
                let char = lines[i][charsInd];

                if (/[\?\.!\-,\s]/.test(char)){
                    szobox.querySelector("span").innerText = char;
                }
                else{ 
                    szobox.classList.add("in-game");
                    this.letterInfo.push({
                        letter: char.toUpperCase(),
                        boxId: `#l-${i + startRowIndex}-${charsInd + startColIndex}`,
                        visibled: false
                    });
                }   
            }
        }
    }

    render(){
        
        let HTMLString = '', row = '';
        
        for (let y = 0; y < this.siseY; y++){
            row = `<div class="szorow">`;
            for (let x = 0; x < this.siseX; x++){
                row += `
                    <div class="szobox" id="l-${y}-${x}" data-row="${y}" data-col="${x}">
                        <span></span>
                    </div>
                `

            }
            row += "</div>";
            HTMLString += row;
        }

        this.inenrCt.innerHTML = HTMLString;
    }
//QWRTYPSDFGHJKLZXCVBNM
    /**
     * @param {any} c
     */
    set char(c){
        this.char = c;
    }

    get char(){
        return this.char;
    }


}