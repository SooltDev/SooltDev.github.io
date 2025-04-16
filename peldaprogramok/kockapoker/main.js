
const kockak = [];
let kockakSzama = 5;
for (let i = 0; i < kockakSzama; i++)
    kockak.push(new Dice('#jatek'));

document.querySelector('#roll').addEventListener('click', function(){
    for (let i = 0; i < kockak.length; i++)
        kockak[i].roll()
            .then(v => console.log(v))
            .catch(v => console.log(v));
});