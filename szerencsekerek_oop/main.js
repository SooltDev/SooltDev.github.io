let kerek = new Kerek({
    parentElement: "#szerencsekerek",
    forgatasUtan: function(){
        kerek.forgatas = false;
        szoforgato.betuValasztas = true;
    }
});

//*
let szoforgato = new Szoforgato({
    parentElement: "#szerencsekerek",
    betutValaszt: function(){
        kerek.forgatas = true;
        szoforgato.betuValasztas = false;
    }
});

//szoforgato.rejtveny = "Aki másnak\nvermet ás,\nmaga esik bele";
//szoforgato.rejtveny = "Nem látja a\nfától,\naz erdőt";
//szoforgato.rejtveny = "Két szék közt\na pad alatt";
//szoforgato.rejtveny = "Rókalyuk";

//*/