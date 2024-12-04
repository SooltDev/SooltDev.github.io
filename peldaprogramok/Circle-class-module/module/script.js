
function random(a, b){
    return Math.floor( Math.random() * (b - a)) + a;
}

function randomRGB(){
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

const circles = [];

for (let i = 1; i <= 25; i++){
    let r = random(12, 75);
    let r2 = r * 2;

    let x = random(0, window.innerWidth - r2);
    let y = random(0, window.innerHeight - r2);

    let color = randomRGB();
    circles.push(
        new Circle(x, y, r, color)
    )
}