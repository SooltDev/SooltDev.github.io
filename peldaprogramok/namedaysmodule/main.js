/*
const p = new Promise(function(resolve, reject){
    let x = 10;
    setTimeout(() => {
        if (x == 10)
            resolve('ok');
        else reject('error');
    }, 1500)
});
*/

nameDays.getNameDays().then(d => {
    document.querySelector('#nevnaposok').textContent = `Isten éltessen ${d.main.join(', ')}`;
});

