console.log("Fej vagy írás");

function tossUp(){

    const random = (a, b) => Math.floor(Math.random() * (b - a)) + a;

    return new Promise(function(resolve, reject){
        setTimeout(() => {
            const coin = random(1, 3) == 1 ? "head" : "tails";

            if (coin == "head")
                resolve(coin);
            else 
                reject(coin);
        }, random(100, 1000));
    });

}


const content = document.querySelector('#content');

document.getElementById('toss-up').addEventListener('click', async () => {
    content.textContent = "...";
    
    try {
        const res = await tossUp();
        content.style.color = "blue";
        content.textContent = res + ' - Nyertél :D';

    } catch (err){
        content.style.color = "red";
        content.textContent = err + ' - Vesztettél :(';
    }
});